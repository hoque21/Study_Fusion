import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaCalendarAlt, FaClock, FaMoneyBillWave, FaNotesMedical, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { appointmentAPI } from "../services/api";

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

const formatSlot = (slotId) => TIME_SLOTS.find((s) => s.id === slotId)?.label || slotId;

const formatDate = (dateStr) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const STATUS_CONFIG = {
  Pending:   { bg: "bg-amber-100",  text: "text-amber-800",  border: "border-amber-300",  icon: "⏳", dot: "bg-amber-400"  },
  Confirmed: { bg: "bg-green-100",  text: "text-green-800",  border: "border-green-300",  icon: "✅", dot: "bg-green-500"  },
  Cancelled: { bg: "bg-red-100",    text: "text-red-800",    border: "border-red-300",    icon: "❌", dot: "bg-red-400"    },
  Completed: { bg: "bg-[#EAF0FA]",  text: "text-[#0B1F3A]",  border: "border-[#DCE6F2]",  icon: "🎉", dot: "bg-[#0B1F3A]"  },
};

const FILTERS = ["All", "Upcoming", "Completed", "Cancelled"];

export default function MyAppointments() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    fetchAppointments();
  }, [isAuthenticated]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentAPI.getMyAppointments();
      setAppointments(res.data.appointments || []);
    } catch {
      MySwal.fire({
        title: "Error",
        text: "Failed to load your consultations.",
        icon: "error",
        confirmButtonColor: "#0B1F3A",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appt) => {
    const result = await MySwal.fire({
      title: "Cancel Consultation?",
      html: `<p>Cancel your consultation with <b>${appt.doctor_name}</b> on <b>${formatDate(appt.appointment_date)}</b>?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#0B1F3A",
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "Keep It",
    });
    if (!result.isConfirmed) return;

    setCancelling(appt.id);
    try {
      await appointmentAPI.cancelAppointment(appt.id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === appt.id ? { ...a, status: "Cancelled" } : a))
      );
      MySwal.fire({
        title: "Cancelled",
        text: "Your consultation has been cancelled.",
        icon: "success",
        iconColor: "#F5A623",
        background: "#FFF7E8",
        confirmButtonColor: "#F5A623",
      });
    } catch (err) {
      MySwal.fire({
        title: "Error",
        text: err?.response?.data?.message || "Could not cancel consultation.",
        icon: "error",
        confirmButtonColor: "#0B1F3A",
      });
    } finally {
      setCancelling(null);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getFilteredCount = (f) =>
    appointments.filter((a) => {
      const d = new Date(a.appointment_date + "T00:00:00");
      if (f === "Upcoming") return d >= today && a.status !== "Cancelled" && a.status !== "Completed";
      if (f === "Completed") return a.status === "Completed";
      if (f === "Cancelled") return a.status === "Cancelled";
      return true;
    }).length;

  const filtered = appointments.filter((a) => {
    const apptDate = new Date(a.appointment_date + "T00:00:00");
    if (filter === "Upcoming") return apptDate >= today && a.status !== "Cancelled" && a.status !== "Completed";
    if (filter === "Completed") return a.status === "Completed";
    if (filter === "Cancelled") return a.status === "Cancelled";
    return true;
  });

  const upcoming = appointments.filter((a) => {
    const apptDate = new Date(a.appointment_date + "T00:00:00");
    return apptDate >= today && a.status !== "Cancelled" && a.status !== "Completed";
  }).length;

  const isCancellable = (appt) => {
    const apptDate = new Date(appt.appointment_date + "T00:00:00");
    return apptDate >= today && (appt.status === "Pending" || appt.status === "Confirmed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FC] to-white px-4 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/team"
            className="inline-flex items-center gap-2 text-[#0B1F3A] hover:text-[#16324F] font-medium text-sm mb-4 transition"
          >
            <FaArrowLeft size={12} /> Back to Consultants
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0B1F3A]">My Bookings</h1>
              <p className="text-[#3B5378] mt-1">
                Welcome, {user?.name}. Track and manage your sessions.
              </p>
            </div>
            {upcoming > 0 && (
              <div className="bg-[#0B1F3A] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md">
                {upcoming} Upcoming {upcoming === 1 ? "Session" : "Sessions"}
              </div>
            )}
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border-2 ${
                filter === f
                  ? "bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-md"
                  : "bg-white text-[#0B1F3A] border-[#DCE6F2] hover:border-[#0B1F3A]"
              }`}
            >
              {f}
              {f !== "All" && (
                <span className="ml-1 text-xs opacity-70">
                  ({getFilteredCount(f)})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#3B5378] gap-3">
            <svg
              className="animate-spin h-7 w-7"
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
            <span className="text-lg font-medium">Loading your consultations...</span>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">
              {filter === "All" ? "No Consultations Yet" : `No ${filter} Consultations`}
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              {filter === "All"
                ? "You haven't booked any consultations yet. Find a consultant and book your first session!"
                : `You have no ${filter.toLowerCase()} consultations.`}
            </p>
            <Link to="/team">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] font-bold px-6 py-3 rounded-full shadow-md"
              >
                Find a Consultant
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {filtered.map((appt, i) => {
                const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.Pending;
                const apptDate = new Date(appt.appointment_date + "T00:00:00");
                const isPast = apptDate < today;

                return (
                  <motion.div
                    key={appt.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white rounded-2xl shadow-md border-l-4 overflow-hidden transition-all hover:shadow-lg ${
                      appt.status === "Cancelled"
                        ? "border-red-400 opacity-70"
                        : appt.status === "Completed"
                        ? "border-[#F5A623]"
                        : isPast
                        ? "border-gray-300"
                        : "border-[#0B1F3A]"
                    }`}
                  >
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Consultant Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#16324F] to-[#0B1F3A] flex items-center justify-center text-white font-bold text-xl shadow-inner">
                          {appt.doctor_name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-[#0B1F3A] text-lg">
                            {appt.doctor_name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.icon} {appt.status}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            #{appt.id}
                          </span>
                        </div>
                        <p className="text-[#3B5378] text-sm font-medium mb-2">
                          {appt.doctor_role}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <FaCalendarAlt
                              className="text-[#F5A623] flex-shrink-0"
                              size={13}
                            />
                            <span>{formatDate(appt.appointment_date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FaClock
                              className="text-[#F5A623] flex-shrink-0"
                              size={13}
                            />
                            <span>{formatSlot(appt.time_slot)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FaMoneyBillWave
                              className="text-[#F5A623] flex-shrink-0"
                              size={13}
                            />
                            <span className="font-semibold text-[#0B1F3A]">
                              ${appt.fee?.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {appt.notes && (
                          <div className="mt-2 flex items-start gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                            <FaNotesMedical
                              className="text-[#F5A623] mt-0.5 flex-shrink-0"
                              size={12}
                            />
                            <span className="italic">{appt.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0">
                        {isCancellable(appt) ? (
                          <motion.button
                            onClick={() => handleCancel(appt)}
                            disabled={cancelling === appt.id}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-full text-sm font-semibold hover:bg-red-100 hover:border-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancelling === appt.id ? "Cancelling..." : "Cancel"}
                          </motion.button>
                        ) : appt.status === "Cancelled" ? (
                          <Link to="/team">
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              className="px-4 py-2 bg-[#F5F8FC] text-[#0B1F3A] border border-[#DCE6F2] rounded-full text-sm font-semibold hover:bg-[#EAF0FA] transition"
                            >
                              Rebook
                            </motion.button>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}

        {/* Book More CTA */}
        {!loading && appointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Link to="/team">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition"
              >
                📅 Book Another Consultation
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
