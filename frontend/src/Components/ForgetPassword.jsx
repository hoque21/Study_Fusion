import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import heroImage from "../assets/Hero.jpg";
import { authAPI } from "../services/api";

const MySwal = withReactContent(Swal);

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobile.trim()) {
      MySwal.fire({
        title: "Required",
        text: "Please enter your registered mobile number.",
        icon: "warning",
        confirmButtonColor: "#0B1F3A",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword({ mobile });
      const link = `/reset-password?token=${encodeURIComponent(
        response.data.resetToken,
      )}`;
      setResetLink(link);
      setSubmitted(true);

      const result = await MySwal.fire({
        title: "Local Demo Reset Link",
        text: "No email was sent. Continue to the browser-only password reset page.",
        icon: "success",
        iconColor: "#F5A623",
        background: "#FFF7E8",
        confirmButtonColor: "#F5A623",
        confirmButtonText: "Reset Password",
      });
      if (result.isConfirmed) navigate(link);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      MySwal.fire({
        title: "Error ❌",
        text: message,
        icon: "error",
        confirmButtonColor: "#0B1F3A",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A]/85 via-[#122C4F]/70 to-[#1F3A5F]/55 backdrop-blur-sm" />

      {/* Floating Motion Orbs */}
      <motion.div
        className="absolute w-64 h-64 bg-[#F5A623]/20 rounded-full blur-3xl top-20 left-10"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-[#3B5378]/20 rounded-full blur-3xl bottom-20 right-16"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-2xl shadow-2xl rounded-2xl p-8 border border-white/40"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#FFF3DF] rounded-full p-4 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-[#0B1F3A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-5 0-8 2.5-8 4v1h16v-1c0-1.5-3-4-8-4z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-[#0B1F3A] mb-2">
          Forgot Password 🔐
        </h2>
        <p className="text-gray-600 text-center text-sm mb-6">
          Enter your registered <strong>mobile number</strong> to create a
          password reset link for this browser-only demo.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#0B1F3A] mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                placeholder="e.g. +60123456789"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] transition bg-white/70"
              />
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-[#0B1F3A]"
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
                  Creating Reset Link...
                </span>
              ) : (
                "Create Reset Link"
              )}
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-3"
          >
            <div className="text-5xl">📬</div>
            <p className="text-[#0B1F3A] font-semibold text-lg">
              Your local reset link is ready.
            </p>
            <p className="text-gray-600 text-sm">
              No email was sent.{" "}
              <Link to={resetLink} className="font-semibold underline">
                Continue to reset your password
              </Link>
            </p>
          </motion.div>
        )}

        {/* Back to Login */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-[#B8790E] font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
