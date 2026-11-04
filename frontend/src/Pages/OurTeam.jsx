import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  FaGraduationCap,
  FaPassport,
  FaHandHoldingUsd,
  FaRoute,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaStickyNote,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { appointmentAPI, consultantAPI } from "../services/api";

const MySwal = withReactContent(Swal);

const TIME_SLOTS = [
  { id: "09:00-10:00", label: "9:00 AM – 10:00 AM" },
  { id: "10:00-11:00", label: "10:00 AM – 11:00 AM" },
  { id: "11:00-12:00", label: "11:00 AM – 12:00 PM" },
  { id: "12:00-13:00", label: "12:00 PM – 1:00 PM" },
  { id: "13:00-14:00", label: "1:00 PM – 2:00 PM" },
  { id: "14:00-15:00", label: "2:00 PM – 3:00 PM" },
  { id: "15:00-16:00", label: "3:00 PM – 4:00 PM" },
  { id: "16:00-17:00", label: "4:00 PM – 5:00 PM" },
  { id: "17:00-18:00", label: "5:00 PM – 6:00 PM" },
];

const sectionDetails = {
  Admissions: {
    icon: <FaGraduationCap size={40} className="text-[#0B1F3A]" />,
    desc: "Guidance on university selection, applications & admission requirements",
  },
  "Visa Guidance": {
    icon: <FaPassport size={40} className="text-[#0B1F3A]" />,
    desc: "Student visa applications, documentation & migration support",
  },
  Scholarships: {
    icon: <FaHandHoldingUsd size={40} className="text-[#0B1F3A]" />,
    desc: "Scholarship search, financial aid & funding applications",
  },
  "Career Guidance": {
    icon: <FaRoute size={40} className="text-[#0B1F3A]" />,
    desc: "Career planning, pathway programs & personalised counselling",
  },
};

const OurTeam = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [selectedSection, setSelectedSection] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Form state
  const [apptDate, setApptDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamError, setTeamError] = useState("");
  const [teamLoading, setTeamLoading] = useState(true);

  const sections = [...new Set(teamMembers.map((member) => member.section))]
    .filter(Boolean)
    .map((name) => ({
      name,
      icon:
        sectionDetails[name]?.icon ||
        <FaGraduationCap size={40} className="text-[#0B1F3A]" />,
      desc: sectionDetails[name]?.desc || `Meet our ${name} consultants.`,
    }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    consultantAPI
      .getAll()
      .then((response) => setTeamMembers(response.data.consultants))
      .catch((error) =>
        setTeamError(error.message || "Unable to load consultants."),
      )
      .finally(() => setTeamLoading(false));
  }, []);

  const resetModal = () => {
    setApptDate("");
    setSelectedSlot("");
    setNotes("");
    setBookedSlots([]);
    setLoadingSlots(false);
  };

  const openModal = (member) => {
    if (!isAuthenticated) {
      MySwal.fire({
        title: "Login Required",
        html: "<p>You must be logged in to book a consultation.</p>",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#0B1F3A",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
      }).then((res) => {
        if (res.isConfirmed) navigate("/login");
      });
      return;
    }
    resetModal();
    setSelectedMember(member);
    setShowModal(true);
  };

  const fetchSlots = useCallback(async (doctor, date) => {
    if (!doctor || !date) return;
    setLoadingSlots(true);
    setSelectedSlot("");
    setBookedSlots([]);
    try {
      const res = await appointmentAPI.getSlots(doctor, date);
      setBookedSlots(res.data.bookedSlots || []);
    } catch (err) {
      MySwal.fire({
        title: "Error",
        text: "Failed to load available slots. Please try again.",
        icon: "error",
        confirmButtonColor: "#0B1F3A",
      });
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setApptDate(date);
    if (date && selectedMember) fetchSlots(selectedMember.name, date);
  };

  const handleBook = async () => {
    if (!apptDate || !selectedSlot) return;
    setBooking(true);
    try {
      const res = await appointmentAPI.book({
        doctor_name: selectedMember.name,
        doctor_role: selectedMember.role,
        appointment_date: apptDate,
        time_slot: selectedSlot,
        notes: notes.trim() || null,
        fee: selectedMember.fee,
      });
      setShowModal(false);
      MySwal.fire({
        title: "Consultation Request Saved",
        html: `<p style="color:#0B1F3A">
          This browser demo saved your request locally. It is not a real appointment.<br/>
          <b>Consultant:</b> ${selectedMember.name}<br/>
          <b>Date:</b> ${new Date(apptDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}<br/>
          <b>Slot:</b> ${TIME_SLOTS.find((s) => s.id === selectedSlot)?.label}<br/>
          <b>Booking ID:</b> #${res.data.appointmentId}
        </p>`,
        icon: "success",
        iconColor: "#F5A623",
        background: "#FFF7E8",
        confirmButtonColor: "#F5A623",
        confirmButtonText: "View My Consultations",
      }).then((r) => {
        if (r.isConfirmed) navigate("/my-appointments");
      });
    } catch (err) {
      MySwal.fire({
        title: "Booking Failed",
        text:
          err?.response?.data?.message ||
          "Could not book consultation. Please try again.",
        icon: "error",
        confirmButtonColor: "#0B1F3A",
      });
    } finally {
      setBooking(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FC] to-white px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-[#0B1F3A] mb-3">
            Find Your Consultant
          </h2>
          <p className="text-[#3B5378] max-w-xl mx-auto">
            Choose a department, meet our consultants, and book a 1-hour session
            that works for you.
          </p>
        </motion.div>

        {isAuthenticated && (
          <div className="mb-10 flex justify-center">
            <Link
              to="/my-appointments"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0B1F3A] px-5 py-2.5 font-semibold text-[#0B1F3A] transition hover:bg-[#0B1F3A] hover:text-white"
            >
              <FaCalendarAlt aria-hidden="true" />
              My Bookings
            </Link>
          </div>
        )}

        {teamError && (
          <p className="mb-6 rounded-xl bg-red-50 p-4 text-red-700" role="alert">
            {teamError}
          </p>
        )}
        {teamLoading && (
          <p className="mb-6 text-center text-[#3B5378]" role="status">
            Loading consultants…
          </p>
        )}

        {/* Section Grid */}
        {!selectedSection && !teamLoading && !teamError && sections.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section, i) => (
              <motion.div
                key={section.name}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center cursor-pointer border-2 border-transparent hover:border-[#0B1F3A] transition-all"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                }}
                onClick={() => setSelectedSection(section.name)}
              >
                <div className="bg-[#FFF3DF] rounded-full p-4 mb-4">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">
                  {section.name}
                </h3>
                <p className="text-gray-500 text-sm">{section.desc}</p>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="mt-4 text-[#3B5378] font-semibold text-sm flex items-center gap-1"
                >
                  View Consultants →
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
        {!teamLoading && !teamError && sections.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-gray-600">
            No consultants are available right now.
          </p>
        )}

        {/* Consultant Cards */}
        {selectedSection && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setSelectedSection("")}
                className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-full hover:bg-[#16324F] transition text-sm font-semibold"
              >
                ← All Departments
              </button>
              <h3 className="text-2xl font-bold text-[#3B5378]">
                {selectedSection} Consultants
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers
                .filter((m) => m.section === selectedSection)
                .map((member, i) => (
                  <motion.div
                    key={member.name}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#E2E8F0] flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{
                      y: -6,
                      boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
                    }}
                  >
                    {/* Photo */}
                    <div className="relative h-52 overflow-hidden bg-[#EAF0FA]">
                      <motion.img
                        src={member.photo}
                        alt={`${member.name}, ${member.role}`}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] text-xs font-bold px-2 py-1 rounded-full shadow">
                        ${member.fee.toLocaleString()}
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-lg font-bold text-[#0B1F3A]">
                        {member.name}
                      </h4>
                      <p className="text-[#3B5378] font-medium text-sm">
                        {member.role}
                      </p>
                      <div className="mt-2 space-y-1 text-xs text-gray-500 flex-1">
                        <p>🏢 {member.address}</p>
                        <p>⏳ {member.experience}</p>
                        <p>📅 {member.available}</p>
                      </div>
                      <motion.button
                        onClick={() => openModal(member)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-4 w-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] py-2.5 rounded-full font-bold text-sm shadow hover:shadow-md transition"
                      >
                        📅 Book Consultation
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Consultation Modal */}
      <AnimatePresence>
        {showModal && selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                resetModal();
              }
            }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#0B1F3A] to-[#16324F] text-white p-6 rounded-t-2xl flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedMember.photo}
                    alt={selectedMember.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#F5A623]"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                    <p className="text-[#B9C4D4] text-sm">
                      {selectedMember.role}
                    </p>
                    <span className="mt-1 inline-block bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] text-xs font-bold px-2 py-0.5 rounded-full">
                      ${selectedMember.fee.toLocaleString()} / session
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetModal();
                  }}
                  className="text-white/70 hover:text-white ml-2 mt-1 transition"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Student Info (read-only) */}
                <div className="bg-[#F5F8FC] rounded-xl p-4 border border-[#E2E8F0]">
                  <p className="text-xs font-bold text-[#3B5378] uppercase tracking-wide mb-2">
                    Your Details
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-semibold text-[#0B1F3A] text-sm">
                        {user?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mobile</p>
                      <p className="font-semibold text-[#0B1F3A] text-sm">
                        {user?.mobile}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] mb-2">
                    <FaCalendarAlt className="text-[#F5A623]" /> Select Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={apptDate}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 outline-none transition text-[#0B1F3A] font-medium"
                  />
                </div>

                {/* Time Slot Grid */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] mb-2">
                    <FaClock className="text-[#F5A623]" /> Select Time Slot (1
                    Hour)
                    {apptDate && !loadingSlots && (
                      <span className="ml-auto text-xs text-gray-400 font-normal">
                        {TIME_SLOTS.length - bookedSlots.length} of{" "}
                        {TIME_SLOTS.length} available
                      </span>
                    )}
                  </label>

                  {!apptDate ? (
                    <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      📅 Please select a date first to see available slots
                    </div>
                  ) : loadingSlots ? (
                    <div className="flex items-center justify-center py-6 text-[#3B5378] gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Loading available slots...
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isBooked = bookedSlots.includes(slot.id);
                        const isSelected = selectedSlot === slot.id;
                        return (
                          <button
                            key={slot.id}
                            disabled={isBooked}
                            onClick={() =>
                              !isBooked && setSelectedSlot(slot.id)
                            }
                            className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition border-2 ${
                              isBooked
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                                : isSelected
                                  ? "bg-[#F5A623] text-[#0B1F3A] border-[#F5A623] shadow-md scale-105"
                                  : "bg-[#F5F8FC] text-[#0B1F3A] border-[#DCE6F2] hover:bg-[#EAF0FA] hover:border-[#0B1F3A] cursor-pointer"
                            }`}
                          >
                            {slot.label.split(" – ")[0]}
                            <br />
                            <span className="text-[10px] font-normal opacity-70">
                              – {slot.label.split(" – ")[1]}
                            </span>
                            {isBooked && (
                              <div className="text-[9px] text-red-400 mt-0.5">
                                Booked
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] mb-2">
                    <FaStickyNote className="text-[#F5A623]" /> Notes{" "}
                    <span className="font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe your goals or questions for this consultation..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 outline-none transition text-sm resize-none"
                  />
                </div>

                {/* Fee Summary */}
                <div className="flex items-center justify-between bg-[#F5F8FC] rounded-xl px-4 py-3 border border-[#E2E8F0] text-sm">
                  <div className="flex items-center gap-2 text-[#0B1F3A] font-medium">
                    <FaMoneyBillWave className="text-[#F5A623]" />
                    Consultation Fee:{" "}
                    <span className="font-bold text-[#0B1F3A]">
                      ${selectedMember.fee.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-gray-500 flex items-center gap-1">
                    <FaClock size={12} /> 1 Hour
                  </div>
                </div>

                {/* Book Button */}
                <motion.button
                  onClick={handleBook}
                  disabled={!apptDate || !selectedSlot || booking}
                  whileHover={{
                    scale: !apptDate || !selectedSlot || booking ? 1 : 1.02,
                  }}
                  whileTap={{
                    scale: !apptDate || !selectedSlot || booking ? 1 : 0.98,
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#0B1F3A] to-[#16324F] text-white rounded-full font-bold text-base shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {booking ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Booking...
                    </span>
                  ) : !apptDate ? (
                    "Select a Date"
                  ) : !selectedSlot ? (
                    "Select a Time Slot"
                  ) : (
                    "Confirm Consultation ✓"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OurTeam;
