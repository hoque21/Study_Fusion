import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import heroImage from "../assets/Hero.jpg";
import { authAPI } from "../services/api";

const MySwal = withReactContent(Swal);

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!token) {
      setTokenError(true);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      MySwal.fire({
        title: "Too Short",
        text: "Password must be at least 6 characters.",
        icon: "warning",
        confirmButtonColor: "#0B1F3A",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      MySwal.fire({
        title: "Passwords Don't Match ⚠️",
        text: "Please make sure both passwords are the same.",
        icon: "error",
        confirmButtonColor: "#0B1F3A",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword({
        token,
        newPassword: formData.newPassword,
      });

      await MySwal.fire({
        title: "Password Reset! 🎉",
        html: `<p style="color:#0B1F3A">${
          response?.data?.message || "Your password has been updated successfully."
        } Please log in with your new password.</p>`,
        icon: "success",
        iconColor: "#F5A623",
        background: "#FFF7E8",
        confirmButtonColor: "#F5A623",
        confirmButtonText: "Go to Login",
      });

      navigate("/login");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to reset password. The link may have expired or already been used.";

      MySwal.fire({
        title: "Reset Failed ❌",
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
        className="absolute w-72 h-72 bg-[#F5A623]/20 rounded-full blur-3xl top-20 left-10"
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
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6a4 4 0 100-8 4 4 0 000 8zm6 4a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-[#0B1F3A] mb-2">
          Reset Password 🔁
        </h2>

        {tokenError ? (
          /* Invalid / Missing Token State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-4"
          >
            <div className="text-5xl">🔗</div>
            <p className="text-red-700 font-semibold text-lg">
              Invalid Reset Link
            </p>
            <p className="text-gray-600 text-sm">
              This password reset link is missing or invalid. Please request a
              new one.
            </p>
            <Link to="/forgot-password">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="mt-3 w-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] py-3 rounded-full font-semibold shadow-lg transition"
              >
                Request New Link
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            <p className="text-gray-600 text-center text-sm mb-6">
              Enter and confirm your new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-[#0B1F3A] mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password (min 6 chars)"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] transition bg-white/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-[#0B1F3A] transition"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Strength hint */}
                {formData.newPassword.length > 0 && (
                  <p
                    className={`text-xs mt-1 font-medium ${
                      formData.newPassword.length >= 8
                        ? "text-green-600"
                        : formData.newPassword.length >= 6
                        ? "text-[#B8790E]"
                        : "text-red-500"
                    }`}
                  >
                    {formData.newPassword.length >= 8
                      ? "✔ Strong password"
                      : formData.newPassword.length >= 6
                      ? "⚠ Acceptable — consider making it longer"
                      : "✖ Too short (minimum 6 characters)"}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#0B1F3A] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] transition bg-white/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-[#0B1F3A] transition"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Match hint */}
                {formData.confirmPassword.length > 0 && (
                  <p
                    className={`text-xs mt-1 font-medium ${
                      formData.newPassword === formData.confirmPassword
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {formData.newPassword === formData.confirmPassword
                      ? "✔ Passwords match"
                      : "✖ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
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
                    Resetting Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>
          </>
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
