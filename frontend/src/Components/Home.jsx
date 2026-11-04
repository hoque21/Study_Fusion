import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  FaHeart,
  FaShieldAlt,
  FaStar,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaStickyNote,
  FaCheckCircle,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { useAuth } from "../contexts/AuthContext";
import {
  appointmentAPI,
  consultantAPI,
  reviewAPI,
} from "../services/api";
import { resizeImage } from "../utils/resizeImage";

import heroImg from "../assets/service.jpg";

const MySwal = withReactContent(Swal);

/* ─── Study Fusion brand palette ─────────────────────────────────────────────
   "Study" -> deep ink-navy (trust, academic credibility)
   "Fusion" -> warm amber-gold (the accent that "fuses" with the navy)
   Kept in one place so the whole page stays in sync with the navbar. ────── */
const INK = "#0B1F3A";
const INK_MID = "#16324F";
const INK_SOFT = "#3B5378";
const INK_BORDER = "#DCE6F2";
const PALE = "#F5F8FC";
const PALE_BLUE = "#EAF0FA";
const GOLD = "#F5A623";
const GOLD_LIGHT = "#FFC15E";
const GOLD_TINT = "#FFF7E8";
const GOLD_BORDER = "#F5D9A3";
const GOLD_TEXT = "#7A4A12";
const GOLD_TEXT_SOFT = "#9C6512";

/* ─── constants ───────────────────────────────────────────────────────────── */

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

const VALUES = [
  {
    icon: <FaHeart className="text-4xl text-[#0B1F3A]" />,
    title: "Personalised Care",
    desc: "Empathy, kindness, and understanding in every interaction with our students.",
  },
  {
    icon: <FaShieldAlt className="text-4xl text-[#0B1F3A]" />,
    title: "Integrity",
    desc: "Honest, transparent guidance and the highest professional standards.",
  },
  {
    icon: <FaStar className="text-4xl text-[#0B1F3A]" />,
    title: "Excellence",
    desc: "Continuous improvement in student counselling and global admissions expertise.",
  },
];

const STATS = [
  { num: "5,000+", label: "Students Guided" },
  { num: "4", label: "Expert Consultants" },
  { num: "7+", label: "Years of Service" },
  { num: "98%", label: "Visa Success Rate" },
];

const WHY_POINTS = [
  "Certified and experienced education counsellors and visa specialists",
  "Confidential, honest guidance tailored to your goals",
  "Flexible scheduling — book your free 1-hour consultation online",
  "Dedicated team covering admissions, visas, and scholarships",
  "Specialised pathway programs for undergraduate & postgraduate study",
  "Affordable consultation fees starting at $50",
];

const FAQS = [
  {
    q: "How do I book a consultation?",
    a: "Scroll down to 'Meet Our Consultants', log in, choose a consultant, pick a date and a free 1-hour slot, then confirm. You'll receive a booking ID instantly.",
  },
  {
    q: "What are your working hours?",
    a: "Our consultants are available Saturday through Thursday, 9:00 AM – 6:00 PM.",
  },
  {
    q: "Is online consultation available?",
    a: "Yes. We offer both in-person and online consultations for admissions, visas, and scholarship guidance.",
  },
  {
    q: "Can I cancel or reschedule?",
    a: "Yes — log in, go to     My Bookings, and cancel any upcoming session. Contact us directly to reschedule.",
  },
  {
    q: "Do you help with both Malaysia and Australia applications?",
    a: "Absolutely. Our consultants specialise in university admissions, visas, and scholarships for both Malaysia and Australia, tailored to your goals.",
  },
  {
    q: "Is payment taken online?",
    a: "No — payment is collected at our office on the day of your consultation.",
  },
];

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const todayStr = () => new Date().toISOString().split("T")[0];

const formatDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* ─── FAQ accordion ──────────────────────────────────────────────────────── */

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border border-[#DCE6F2] rounded-xl overflow-hidden shadow-sm"
      initial={false}
      animate={{ backgroundColor: open ? "#FFF7E8" : "#ffffff" }}
      transition={{ duration: 0.25 }}
    >
      <button
        className="w-full flex justify-between items-center px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-[#0B1F3A] text-sm md:text-base">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-[#F5A623] text-xl font-bold flex-shrink-0 ml-3"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <p className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   HOME COMPONENT
══════════════════════════════════════════════════════════════════════════════ */

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  /* modal state */
  const [showModal, setShowModal] = useState(false);
  const [doctor, setDoctor] = useState(null); // selected consultant

  /* booking form */
  const [apptDate, setApptDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const reviewsPerPage = 3;
  const reviewPageCount = Math.ceil(reviews.length / reviewsPerPage);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewPhoto, setReviewPhoto] = useState("");
  const [reviewPhotoError, setReviewPhotoError] = useState("");
  const [consultants, setConsultants] = useState([]);
  const [consultantError, setConsultantError] = useState("");
  const isReviewUserAuthenticated = Boolean(user);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    university: "",
    course: "",
    comment: "",
    rating: 5,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    let active = true;
    reviewAPI
      .getPublic()
      .then((response) => {
        if (active) setReviews(response.data.reviews);
      })
      .catch((error) => {
        MySwal.fire({
          title: "Reviews Could Not Load",
          text: error.message || "Please refresh the page and try again.",
          icon: "error",
          confirmButtonColor: INK,
        });
      })
      .finally(() => {
        if (active) setReviewLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    consultantAPI
      .getAll()
      .then((response) => setConsultants(response.data.consultants))
      .catch((error) =>
        setConsultantError(error.message || "Unable to load consultants."),
      );
  }, []);

  useEffect(() => {
    if (reviewPageCount < 2) {
      setReviewPage(0);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setReviewPage((current) => (current + 1) % reviewPageCount);
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [reviewPageCount]);

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((current) => ({ ...current, [name]: value }));
  };

  const handleReviewPhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setReviewPhotoError("");
    try {
      setReviewPhoto(await resizeImage(file));
    } catch (error) {
      setReviewPhotoError(error.message);
      event.target.value = "";
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!isReviewUserAuthenticated) return;
    setReviewSubmitting(true);
    try {
      await reviewAPI.submit({ ...reviewForm, photo: reviewPhoto });
      setReviewForm({
        name: "",
        university: "",
        course: "",
        comment: "",
        rating: 5,
      });
      setReviewPhoto("");
      setReviewPhotoError("");
      setShowReviewForm(false);
      await MySwal.fire({
        title: "Review Submitted",
        text: "Your review is waiting for admin approval. Once approved, it will appear on the website.",
        icon: "success",
        iconColor: GOLD,
        background: GOLD_TINT,
        confirmButtonColor: GOLD,
      });
    } catch (error) {
      MySwal.fire({
        title: "Could Not Add Review",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Please check your review and try again.",
        icon: "error",
        confirmButtonColor: INK,
      });
    } finally {
      setReviewSubmitting(false);
    }
  };

  /* ── modal helpers ────────────────────────────────────────────────────── */

  const resetForm = () => {
    setApptDate("");
    setSelectedSlot("");
    setNotes("");
    setBookedSlots([]);
    setLoadingSlots(false);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openBooking = (member) => {
    if (!isAuthenticated) {
      MySwal.fire({
        title: "Login Required 🔒",
        html: `<p style="color:#374151">You need to be <b>logged in</b> to book a consultation with <b>${member.name}</b>.</p>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: INK,
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Go to Login",
        cancelButtonText: "Maybe Later",
      }).then((r) => {
        if (r.isConfirmed) navigate("/login");
      });
      return;
    }
    resetForm();
    setDoctor(member);
    setShowModal(true);
  };

  /* ── fetch slots ──────────────────────────────────────────────────────── */

  const fetchSlots = useCallback(async (doctorName, date) => {
    if (!doctorName || !date) return;
    setLoadingSlots(true);
    setSelectedSlot("");
    setBookedSlots([]);
    try {
      const res = await appointmentAPI.getSlots(doctorName, date);
      setBookedSlots(res.data.bookedSlots || []);
    } catch (err) {
      MySwal.fire({
        title: "Could Not Load Slots",
        text:
          err?.response?.data?.message ||
          "Failed to fetch available slots. Please try again.",
        icon: "error",
        confirmButtonColor: INK,
      });
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setApptDate(date);
    if (date && doctor) fetchSlots(doctor.name, date);
  };

  /* ── submit booking ───────────────────────────────────────────────────── */

  const handleBook = async () => {
    if (!apptDate || !selectedSlot || !doctor) return;
    setBooking(true);
    try {
      const res = await appointmentAPI.book({
        doctor_name: doctor.name,
        doctor_role: doctor.role,
        appointment_date: apptDate,
        time_slot: selectedSlot,
        notes: notes.trim() || null,
        fee: doctor.fee,
      });

      closeModal();

      MySwal.fire({
        title: "Consultation Request Saved",
        html: `
          <div style="text-align:left;color:${INK};line-height:2">
            <p>This browser demo saved your request locally. It is not a real appointment.</p>
            <p>✅ <b>Consultant:</b> ${doctor.name}</p>
            <p>📅 <b>Date:</b> ${formatDate(apptDate)}</p>
            <p>🕐 <b>Slot:</b> ${TIME_SLOTS.find((s) => s.id === selectedSlot)?.label}</p>
            <p>💳 <b>Fee:</b> $${doctor.fee.toLocaleString()}</p>
            <p>🔖 <b>Booking ID:</b> #${res.data.appointmentId}</p>
          </div>`,
        icon: "success",
        iconColor: GOLD,
        background: GOLD_TINT,
        confirmButtonColor: GOLD,
        confirmButtonText: "View My Consultations",
        showCancelButton: true,
        cancelButtonText: "Stay on Home",
        cancelButtonColor: "#6b7280",
      }).then((r) => {
        if (r.isConfirmed) navigate("/my-appointments");
      });
    } catch (err) {
      MySwal.fire({
        title: "Booking Failed ❌",
        text:
          err?.response?.data?.message ||
          "Could not book the consultation. Please try again.",
        icon: "error",
        confirmButtonColor: INK,
      });
    } finally {
      setBooking(false);
    }
  };

  const availableCount = TIME_SLOTS.length - bookedSlots.length;
  const displayStats = STATS.map((stat) =>
    stat.label === "Expert Consultants"
      ? { ...stat, num: String(consultants.length) }
      : stat,
  );

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="bg-gradient-to-b from-[#F5F8FC] via-white to-[#F5F8FC]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* background */}
        <motion.img
          src={heroImg}
          alt="Study Fusion consultation"
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A]/90 via-[#122C4F]/75 to-[#1F3A5F]/55" />

        {/* decorative orbs */}
        <motion.div
          className="absolute w-80 h-80 bg-[#F5A623]/10 rounded-full blur-3xl -top-20 -left-20"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-[#3B5378]/20 rounded-full blur-3xl -bottom-24 -right-24"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* hero content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: -35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block bg-[#F5A623]/20 border border-[#F5A623]/50 text-[#FFC15E] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              Trusted Education Consultancy · Since 2018
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl mb-4 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#F5A623] to-[#FFC15E] bg-clip-text text-transparent">
                Study Fusion
              </span>
            </h1>

            <p className="text-[#D7E0EE] text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              A trusted partner for university admissions, visa guidance, and
              scholarship support — helping students across Malaysia &amp;
              Australia reach the right campus.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() =>
                  document
                    .getElementById("book-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] font-bold px-8 py-3.5 rounded-full shadow-xl hover:shadow-[#F5A623]/30 transition"
              >
                📅 Book a Consultation
              </motion.button>

              <Link to="/services">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  className="border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition"
                >
                  Explore Our Services
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 60"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full"
          >
            <path
              fill="#F5F8FC"
              d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
            />
          </svg>
        </div>
      </div>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <div className="bg-[#0B1F3A] text-white py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {displayStats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-4xl font-extrabold text-[#F5A623]">{s.num}</p>
              <p className="text-[#B9C4D4] text-sm mt-1 font-medium">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {/* Mission & Vision */}
        <section>
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-[#0B1F3A] text-center mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Mission &amp; Vision
          </motion.h2>
          <motion.p
            className="text-center text-[#3B5378] mb-10 max-w-lg mx-auto text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            The values and long-term goals that drive everything we do at
            Study Fusion.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Our Mission",
                text: "Deliver honest, high-quality education consultancy that empowers students and families to pursue the right university pathway with confidence.",
                icon: "🎯",
              },
              {
                title: "Our Vision",
                text: "Be a leading education consultancy across Malaysia & Australia, known for excellence, integrity, and end-to-end support from application to arrival.",
                icon: "🌟",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-3xl shadow-lg p-8 border-l-4 border-[#F5A623] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-2xl font-bold text-[#0B1F3A] mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section>
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-[#0B1F3A] text-center mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>
          <motion.p
            className="text-center text-[#3B5378] mb-10 max-w-lg mx-auto text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            The principles we hold true in every student interaction and every
            decision we make.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-7 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-default"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ rotate: 1 }}
              >
                <div className="bg-[#FFF3DF] rounded-full p-4 mb-4">
                  {v.icon}
                </div>
                <h4 className="text-xl font-bold text-[#0B1F3A] mb-2">
                  {v.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-br from-[#0B1F3A] to-[#16324F] rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose Study Fusion?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_POINTS.map((point, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <FaCheckCircle
                  className="text-[#F5A623] mt-0.5 flex-shrink-0"
                  size={18}
                />
                <p className="text-[#D7E0EE] text-sm leading-relaxed">
                  {point}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── MEET OUR CONSULTANTS + BOOK CONSULTATION ───────────────────── */}
        <section id="book-section">
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1F3A] mb-3">
              Meet Our Consultants
            </h2>
            <p className="text-[#3B5378] max-w-xl mx-auto text-sm md:text-base">
              Our certified consultants are ready to guide your study-abroad
              journey. Each session is <strong>1 hour</strong> and starts at{" "}
              <strong className="text-[#0B1F3A]">$50</strong>.
            </p>
          </motion.div>

          {/* guest banner */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FFF7E8] border border-[#F5D9A3] rounded-2xl px-6 py-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="font-semibold text-[#7A4A12] text-sm">
                    Login to Book a Consultation
                  </p>
                  <p className="text-[#9C6512] text-xs mt-0.5">
                    Create a free account or sign in to schedule a 1-hour
                    session with any consultant.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-[#0B1F3A] text-white text-sm font-semibold px-5 py-2 rounded-full shadow hover:bg-[#16324F] transition"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="border-2 border-[#0B1F3A] text-[#0B1F3A] text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#F5F8FC] transition"
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* logged-in welcome bar */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F5F8FC] border border-[#DCE6F2] rounded-2xl px-6 py-3"
            >
              <p className="text-[#16324F] text-sm font-medium">
                👋 Hello, <strong>{user?.name}</strong>! Choose a consultant
                below to book your session.
              </p>
              <Link to="/my-appointments">
                <span className="inline-flex rounded-full border border-[#B9C4D4] px-4 py-1.5 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#F5F8FC]">
                  📋 My Bookings
                </span>
              </Link>
            </motion.div>
          )}

          {/* team cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
            {consultantError && (
              <p className="col-span-full rounded-xl bg-red-50 p-4 text-red-700" role="alert">
                {consultantError}
              </p>
            )}
            {consultants.map((member, i) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#E2E8F0] flex flex-col hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 120 }}
              >
                {/* photo */}
                <div className="relative h-52 overflow-hidden bg-[#EAF0FA]">
                  <motion.img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
                    ${member.fee.toLocaleString()}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#0B1F3A]/85 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {member.tag}
                  </div>
                </div>

                {/* info */}
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-lg font-extrabold text-[#0B1F3A]">
                    {member.name}
                  </h4>
                  <p className="text-[#3B5378] font-semibold text-sm">
                    {member.role}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-gray-500 flex-1">
                    <p className="flex items-center gap-1.5">
                      <span>⏳</span>
                      {member.experience}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span>📅</span>Available: {member.available}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span>🕐</span>1-hour sessions
                    </p>
                  </div>

                  <motion.button
                    onClick={() => openBooking(member)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 w-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] py-2.5 rounded-full font-bold text-sm shadow hover:shadow-md transition flex items-center justify-center gap-2"
                  >
                    <FaCalendarAlt size={12} />
                    {isAuthenticated
                      ? "Book Consultation"
                      : "Book (Login First)"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Student Reviews */}
        <section id="student-reviews">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1F3A] mb-3">
              Student Reviews
            </h2>
            <p className="text-[#3B5378] max-w-xl mx-auto text-sm md:text-base">
              Share your university journey and help other students make informed choices.
            </p>
            <button
              type="button"
              onClick={() => {
                if (!isReviewUserAuthenticated) {
                  MySwal.fire({
                    title: "Login Required",
                    text: "Please log in before submitting a student review.",
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonText: "Go to Login",
                    cancelButtonText: "Cancel",
                    confirmButtonColor: INK,
                  }).then((result) => {
                    if (result.isConfirmed) navigate("/login");
                  });
                  return;
                }
                setShowReviewForm((visible) => !visible);
              }}
              aria-expanded={showReviewForm}
              aria-controls="student-review-form"
              className="mt-5 rounded-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] px-6 py-3 font-bold text-[#0B1F3A] shadow hover:shadow-md"
            >
              {!isReviewUserAuthenticated
                ? "Log in to Write a Review"
                : showReviewForm
                  ? "Close Review Form"
                  : "Write a Review"}
            </button>
          </motion.div>

          <div
            className={`grid grid-cols-1 ${showReviewForm ? "lg:grid-cols-5" : ""} gap-8 items-start`}
          >
            {showReviewForm && (
            <form
              id="student-review-form"
              onSubmit={handleReviewSubmit}
              className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6 space-y-4"
            >
              <h3 className="text-xl font-bold text-[#0B1F3A]">
                Write a Review
              </h3>
              <div>
                <label
                  htmlFor="review-name"
                  className="block text-sm font-semibold text-[#0B1F3A] mb-1"
                >
                  Student Name
                </label>
                <input
                  id="review-name"
                  name="name"
                  value={reviewForm.name}
                  onChange={handleReviewChange}
                  required
                  maxLength={80}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE6F2] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50"
                />
              </div>
              <div>
                <label
                  htmlFor="review-university"
                  className="block text-sm font-semibold text-[#0B1F3A] mb-1"
                >
                  University
                </label>
                <input
                  id="review-university"
                  name="university"
                  value={reviewForm.university}
                  onChange={handleReviewChange}
                  required
                  maxLength={120}
                  placeholder="Your university"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE6F2] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50"
                />
              </div>
              <div>
                <label
                  htmlFor="review-course"
                  className="block text-sm font-semibold text-[#0B1F3A] mb-1"
                >
                  Course
                </label>
                <input
                  id="review-course"
                  name="course"
                  value={reviewForm.course}
                  onChange={handleReviewChange}
                  required
                  maxLength={120}
                  placeholder="Your course or program"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE6F2] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50"
                />
              </div>
              <fieldset>
                <legend className="block text-sm font-semibold text-[#0B1F3A] mb-1">
                  Your Rating
                </legend>
                <div className="flex items-center gap-1" role="group" aria-label="Choose a rating">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        setReviewForm((current) => ({ ...current, rating }))
                      }
                      aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
                      aria-pressed={reviewForm.rating === rating}
                      className="p-1 focus:outline-none focus:ring-2 focus:ring-[#F5A623] rounded"
                    >
                      <FaStar
                        className={
                          rating <= reviewForm.rating
                            ? "text-[#F5A623]"
                            : "text-gray-300"
                        }
                        size={22}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label
                  htmlFor="review-comment"
                  className="block text-sm font-semibold text-[#0B1F3A] mb-1"
                >
                  Comments
                </label>
                <textarea
                  id="review-comment"
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  required
                  maxLength={1000}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE6F2] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 resize-y"
                />
              </div>
              <div>
                <label
                  htmlFor="review-photo"
                  className="block text-sm font-semibold text-[#0B1F3A] mb-1"
                >
                  Profile picture (optional)
                </label>
                <input
                  id="review-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleReviewPhotoChange}
                  className="w-full rounded-xl border border-[#DCE6F2] px-4 py-2.5 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Image is resized before saving (maximum upload: 5 MB).
                </p>
                {reviewPhotoError && (
                  <p className="mt-1 text-sm text-red-700" role="alert">
                    {reviewPhotoError}
                  </p>
                )}
                {reviewPhoto && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={reviewPhoto}
                      alt="Review profile preview"
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setReviewPhoto("")}
                      className="text-sm font-semibold text-red-700 underline"
                    >
                      Remove picture
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] py-3 rounded-full font-bold shadow hover:shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {reviewSubmitting ? "Submitting Review..." : "Submit Review"}
              </button>
              <p className="text-xs text-gray-500">
                Your review will be published after admin approval. No account is needed.
              </p>
            </form>
            )}

            <div className={showReviewForm ? "lg:col-span-3" : ""}>
              {reviewLoading ? (
                <p className="text-center text-[#3B5378] py-10">Loading student reviews...</p>
              ) : reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center text-[#3B5378]">
                  No approved student reviews yet. Be the first to share your experience.
                </div>
              ) : (
                <>
                  <p className="mb-4 text-center text-sm text-[#3B5378]" aria-live="polite">
                    Reviews change automatically
                  </p>
                  <div
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
                    aria-label="Student reviews, automatically rotating"
                  >
                    {reviews
                      .slice(
                        reviewPage * reviewsPerPage,
                        (reviewPage + 1) * reviewsPerPage,
                      )
                      .map((review) => (
                        <motion.article
                          key={review.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={review.photo || "/student-avatar.svg"}
                                alt=""
                                className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                              />
                              <div>
                                <h3 className="text-lg font-bold text-[#0B1F3A]">
                                  {review.name}
                                </h3>
                                <p className="text-sm text-[#3B5378]">
                                  {review.university} · {review.course}
                                </p>
                              </div>
                            </div>
                            <div
                              className="flex gap-0.5"
                              role="img"
                              aria-label={`${review.rating} out of 5 stars`}
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={
                                    star <= review.rating
                                      ? "text-[#F5A623]"
                                      : "text-gray-300"
                                  }
                                  size={15}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {review.comment}
                          </p>
                        </motion.article>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-[#0B1F3A] text-center mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="text-center text-[#3B5378] mb-10 max-w-lg mx-auto text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            Answers to the questions we hear most often.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact strip */}
        <section className="bg-white rounded-3xl shadow-lg border border-[#E2E8F0] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mb-1">
              Have a question?
            </h3>
            <p className="text-gray-600 text-sm">
              Reach our team anytime — we're here to help.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <a
              href="tel:+60123456789"
              className="flex items-center gap-2 bg-[#F5F8FC] border border-[#DCE6F2] text-[#0B1F3A] font-semibold px-5 py-2.5 rounded-full hover:bg-[#EAF0FA] transition"
            >
              <FaPhoneAlt className="text-[#F5A623]" size={13} />
              +60 12-345 6789
            </a>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] font-bold px-5 py-2.5 rounded-full shadow hover:shadow-md transition"
              >
                <FaMapMarkerAlt size={13} />
                Contact Us
              </motion.button>
            </Link>
          </div>
        </section>
      </div>
      {/* end max-w content */}

      {/* ══════════════════════════════════════════════════════════════════════
          CONSULTATION MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && doctor && (
          <motion.div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
              initial={{ scale: 0.85, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* header */}
              <div className="bg-gradient-to-r from-[#0B1F3A] to-[#16324F] text-white p-6 rounded-t-2xl flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover object-top border-2 border-[#F5A623] shadow-md"
                  />
                  <div>
                    <h3 className="text-xl font-extrabold leading-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-[#B9C4D4] text-sm">{doctor.role}</p>
                    <span className="mt-1.5 inline-block bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] text-xs font-bold px-2.5 py-0.5 rounded-full">
                      ${doctor.fee.toLocaleString()} / session
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white/70 hover:text-white transition mt-0.5 flex-shrink-0"
                  aria-label="Close"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* body */}
              <div className="p-6 space-y-5">
                {/* student info */}
                <div className="bg-[#F5F8FC] rounded-xl p-4 border border-[#E2E8F0]">
                  <p className="text-xs font-bold text-[#3B5378] uppercase tracking-widest mb-3">
                    Your Details
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">
                        Full Name
                      </p>
                      <p className="font-semibold text-[#0B1F3A] text-sm">
                        {user?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Mobile</p>
                      <p className="font-semibold text-[#0B1F3A] text-sm">
                        {user?.mobile}
                      </p>
                    </div>
                  </div>
                </div>

                {/* date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] mb-2">
                    <FaCalendarAlt className="text-[#F5A623]" />
                    Select Consultation Date
                  </label>
                  <input
                    type="date"
                    min={todayStr()}
                    value={apptDate}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 outline-none transition text-[#0B1F3A] font-medium bg-white"
                  />
                </div>

                {/* slots */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] mb-2">
                    <FaClock className="text-[#F5A623]" />
                    Select Time Slot
                    <span className="text-xs font-normal text-gray-400 ml-1">
                      (1-hour session)
                    </span>
                    {apptDate && !loadingSlots && (
                      <span className="ml-auto text-xs font-semibold text-[#3B5378]">
                        {availableCount}/{TIME_SLOTS.length} available
                      </span>
                    )}
                  </label>

                  {!apptDate ? (
                    <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
                      <span className="text-3xl mb-2">📅</span>
                      Pick a date above to see available slots
                    </div>
                  ) : loadingSlots ? (
                    <div className="flex items-center justify-center gap-3 py-8 text-[#3B5378]">
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
                      <span className="font-medium">
                        Checking availability…
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const booked = bookedSlots.includes(slot.id);
                        const selected = selectedSlot === slot.id;
                        const [start, end] = slot.label.split(" – ");
                        return (
                          <button
                            key={slot.id}
                            disabled={booked}
                            onClick={() => !booked && setSelectedSlot(slot.id)}
                            className={`relative py-2 px-1 rounded-xl text-[11px] font-semibold text-center transition-all border-2 select-none
                              ${
                                booked
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : selected
                                    ? "bg-[#F5A623] text-[#0B1F3A] border-[#F5A623] shadow-md scale-105"
                                    : "bg-[#F5F8FC] text-[#0B1F3A] border-[#DCE6F2] hover:bg-[#EAF0FA] hover:border-[#0B1F3A] cursor-pointer"
                              }`}
                          >
                            <span className={booked ? "line-through" : ""}>
                              {start}
                            </span>
                            <br />
                            <span className="opacity-60 text-[10px]">
                              – {end}
                            </span>
                            {booked && (
                              <span className="block text-[9px] text-red-400 mt-0.5 font-bold">
                                Booked
                              </span>
                            )}
                            {selected && (
                              <span className="block text-[9px] text-[#0B1F3A] mt-0.5 font-bold">
                                ✓ Selected
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* notes */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] mb-2">
                    <FaStickyNote className="text-[#F5A623]" />
                    Notes
                    <span className="text-xs font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe your goals or questions for this consultation…"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 outline-none transition text-sm resize-none bg-white"
                  />
                </div>

                {/* fee summary */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#F5F8FC] to-[#EAF0FA] rounded-xl px-4 py-3 border border-[#DCE6F2]">
                  <div className="flex items-center gap-2 text-sm text-[#0B1F3A] font-medium">
                    <FaMoneyBillWave className="text-[#F5A623]" />
                    Consultation Fee:
                    <span className="font-extrabold text-[#0B1F3A] ml-1">
                      ${doctor.fee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <FaClock size={12} />
                    Duration: 1 Hour
                  </div>
                </div>

                {/* confirm button */}
                <motion.button
                  onClick={handleBook}
                  disabled={!apptDate || !selectedSlot || booking}
                  whileHover={{
                    scale: !apptDate || !selectedSlot || booking ? 1 : 1.02,
                  }}
                  whileTap={{
                    scale: !apptDate || !selectedSlot || booking ? 1 : 0.98,
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0B1F3A] to-[#16324F] text-white rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Booking Your Consultation…
                    </span>
                  ) : !apptDate ? (
                    "① Select a Date to Continue"
                  ) : !selectedSlot ? (
                    "② Select a Time Slot"
                  ) : (
                    "✓ Confirm Consultation"
                  )}
                </motion.button>

                <p className="text-center text-xs text-gray-400">
                  Payment is collected at our office on the day of your
                  consultation.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
