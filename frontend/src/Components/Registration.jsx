
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  EyeIcon,
  EyeSlashIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import heroImage from "../assets/Hero.jpg";

const MySwal = withReactContent(Swal);

/* -------------------------------------------------------------------------- */
/* Reusable Field Component                                                   */
/* -------------------------------------------------------------------------- */

const Field = ({ label, error, required = false, children, hint }) => (
  <div>
    <label className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    {children}

    {hint && !error && (
      <p className="text-gray-400 text-xs mt-1">{hint}</p>
    )}

    {error && (
      <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
    )}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Input Class                                                                */
/* -------------------------------------------------------------------------- */

const inputClass = (fieldName, errors = {}) =>
  `w-full px-4 py-3 border-2 rounded-xl outline-none transition bg-white/90
   text-[#0B1F3A] font-medium placeholder:text-gray-400
   disabled:opacity-60
   ${
     errors[fieldName]
       ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
       : "border-gray-200 focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10"
   }`;

/* -------------------------------------------------------------------------- */
/* Section Header                                                             */
/* -------------------------------------------------------------------------- */

const SectionHeader = ({ number, title, description }) => (
  <div className="flex items-start gap-3 pt-2">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-sm font-bold shadow">
      {number}
    </div>

    <div>
      <h3 className="text-lg font-extrabold text-[#0B1F3A]">{title}</h3>

      {description && (
        <p className="text-xs text-[#3B5378] mt-0.5">{description}</p>
      )}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Registration Component                                                     */
/* -------------------------------------------------------------------------- */

const Registration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [passportFile, setPassportFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    sex: "",
    age: "",
    passportNumber: "",
    interestedUniversity: "",
    interestedCourse: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  /* ------------------------------------------------------------------------ */
  /* Scroll to top                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Handle Input Change                                                      */
  /* ------------------------------------------------------------------------ */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Passport Upload                                                          */
  /* ------------------------------------------------------------------------ */

  const handlePassportUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        passportFile: "Only PDF, JPG, and PNG files are allowed.",
      }));

      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        passportFile: "Passport file must be smaller than 5MB.",
      }));

      e.target.value = "";
      return;
    }

    setPassportFile(file);

    setErrors((prev) => ({
      ...prev,
      passportFile: "",
    }));
  };

  const removePassportFile = () => {
    setPassportFile(null);

    const fileInput = document.getElementById("passportFile");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Validation                                                               */
  /* ------------------------------------------------------------------------ */

  const validateForm = () => {
    const newErrors = {};

    /* Applicant information */

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (
      !/^\+?\d{7,20}$/.test(
        formData.mobile.replace(/[\s\-().]/g, "")
      )
    ) {
      newErrors.mobile =
        "Enter a valid mobile number (e.g. 01712345678).";
    }

    if (!formData.sex) {
      newErrors.sex = "Please select your gender.";
    }

    if (!formData.age) {
      newErrors.age = "Age is required.";
    } else if (
      Number(formData.age) < 5 ||
      Number(formData.age) > 120
    ) {
      newErrors.age = "Age must be between 5 and 120.";
    }

    /* Passport */

    if (!formData.passportNumber.trim()) {
      newErrors.passportNumber = "Passport number is required.";
    } else if (
      !/^[A-Za-z0-9]{6,20}$/.test(
        formData.passportNumber.replace(/\s/g, "")
      )
    ) {
      newErrors.passportNumber =
        "Enter a valid passport number.";
    }

    if (!passportFile) {
      newErrors.passportFile = "Please upload a copy of your passport.";
    }

    /* Study preferences */

    if (!formData.interestedUniversity.trim()) {
      newErrors.interestedUniversity =
        "Please enter your interested university.";
    }

    if (!formData.interestedCourse.trim()) {
      newErrors.interestedCourse =
        "Please enter your interested course.";
    }

    /* Password */

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    /* Address */

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ------------------------------------------------------------------------ */
  /* Error Message                                                             */
  /* ------------------------------------------------------------------------ */

  const getErrorMessage = (error) => {
    return (
      error.response?.data?.message ||
      error.message ||
      "Registration failed. Please try again."
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                    */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setLoading(true);

    try {
      const submissionData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        submissionData.append(key, value);
      });

      if (passportFile) {
        submissionData.append("passportFile", passportFile);
      }

      await register(submissionData);

      await MySwal.fire({
        title: `Welcome, ${formData.name.trim()}! 🎉`,
        text: "Your demo profile has been saved in this browser. Please log in to continue.",
        icon: "success",
        iconColor: "#F5A623",
        background: "#FFF7E8",
        confirmButtonColor: "#F5A623",
        confirmButtonText: "Go to Login",
      });

      navigate("/login");
    } catch (error) {
      MySwal.fire({
        title: "Registration Failed",
        text: getErrorMessage(error),
        icon: "error",
        confirmButtonColor: "#0B1F3A",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-10 px-4">
      {/* Background */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A]/90 via-[#122C4F]/75 to-[#1F3A5F]/60 backdrop-blur-sm" />

      {/* Decorative orbs */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
        }}
        className="absolute w-80 h-80 bg-[#F5A623]/20 rounded-full blur-3xl top-20 left-10 pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
        }}
        className="absolute w-96 h-96 bg-[#3B5378]/20 rounded-full blur-3xl bottom-20 right-16 pointer-events-none"
      />

      {/* Main Card */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.75,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-2xl bg-white/75 backdrop-blur-2xl shadow-2xl rounded-3xl p-6 sm:p-8 border border-white/50"
      >
        {/* Header */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0B1F3A] rounded-full mb-4 shadow-lg">
            <span className="text-2xl">🎓</span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#0B1F3A]">
            Student Registration
          </h2>

          <p className="text-[#3B5378] text-sm mt-2">
            Create your profile and start your study abroad journey
            with Study Fusion.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
          noValidate
        >
          {/* ---------------------------------------------------------------- */}
          {/* SECTION 1 - APPLICANT INFORMATION                                */}
          {/* ---------------------------------------------------------------- */}

          <SectionHeader
            number="1"
            title="Applicant Information"
            description="Tell us a little about yourself."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}

            <div className="sm:col-span-2">
              <Field
                label="Full Name"
                required
                error={errors.name}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rafiul Hoque"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass("name", errors)}
                />
              </Field>
            </div>

            {/* Email */}

            <Field
              label="Email Address"
              required
              error={errors.email}
            >
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={inputClass("email", errors)}
              />
            </Field>

            {/* Mobile */}

            <Field
              label="Mobile Number"
              required
              error={errors.mobile}
            >
              <input
                type="tel"
                name="mobile"
                placeholder="e.g. 01712345678"
                value={formData.mobile}
                onChange={handleChange}
                disabled={loading}
                className={inputClass("mobile", errors)}
              />
            </Field>

            {/* Gender */}

            <Field
              label="Gender"
              required
              error={errors.sex}
            >
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                disabled={loading}
                className={inputClass("sex", errors)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            {/* Age */}

            <Field
              label="Age"
              required
              error={errors.age}
            >
              <input
                type="number"
                name="age"
                placeholder="e.g. 25"
                min="5"
                max="120"
                value={formData.age}
                onChange={handleChange}
                disabled={loading}
                className={inputClass("age", errors)}
              />
            </Field>

            {/* Address */}

            <div className="sm:col-span-2">
              <Field
                label="Current Address"
                required
                error={errors.address}
              >
                <textarea
                  name="address"
                  placeholder="Enter your full current address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={loading}
                  rows={3}
                  className={
                    inputClass("address", errors) +
                    " resize-none"
                  }
                />
              </Field>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* SECTION 2 - PASSPORT INFORMATION                                 */}
          {/* ---------------------------------------------------------------- */}

          <SectionHeader
            number="2"
            title="Passport Details"
            description="Your passport information helps us prepare your application."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Passport Number */}

            <Field
              label="Passport Number"
              required
              error={errors.passportNumber}
              hint="Enter the passport number exactly as shown on your passport."
            >
              <input
                type="text"
                name="passportNumber"
                placeholder="e.g. A12345678"
                value={formData.passportNumber}
                onChange={handleChange}
                disabled={loading}
                autoCapitalize="characters"
                className={inputClass(
                  "passportNumber",
                  errors
                )}
              />
            </Field>

            {/* Passport Upload */}

            <Field
              label="Upload Passport"
              required
              error={errors.passportFile}
              hint="PDF, JPG or PNG — maximum 5MB."
            >
              {!passportFile ? (
                <label
                  htmlFor="passportFile"
                  className={`flex items-center justify-center gap-3 w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition bg-white/90 ${
                    errors.passportFile
                      ? "border-red-400 hover:border-red-500"
                      : "border-gray-300 hover:border-[#F5A623] hover:bg-[#FFF7E8]"
                  }`}
                >
                  <CloudArrowUpIcon className="w-6 h-6 text-[#F5A623]" />

                  <div>
                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      Choose passport file
                    </p>

                    <p className="text-xs text-gray-400">
                      Click to browse
                    </p>
                  </div>

                  <input
                    id="passportFile"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handlePassportUpload}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between gap-3 w-full px-4 py-3 border-2 border-green-200 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <DocumentTextIcon className="w-5 h-5 text-green-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0B1F3A] truncate">
                        {passportFile.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {(passportFile.size / 1024 / 1024).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removePassportFile}
                    disabled={loading}
                    className="flex-shrink-0 p-1.5 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-500 transition"
                    aria-label="Remove passport file"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </Field>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* SECTION 3 - STUDY PREFERENCES                                    */}
          {/* ---------------------------------------------------------------- */}

          <SectionHeader
            number="3"
            title="Study Preferences"
            description="Tell us where and what you are interested in studying."
          />

          <div className="space-y-4">
            {/* University */}

            <Field
              label="Interested University"
              required
              error={errors.interestedUniversity}
              hint="If you are not sure yet, enter your preferred university or write 'Not sure'."
            >
              <input
                type="text"
                name="interestedUniversity"
                placeholder="e.g. University of Malaya"
                value={formData.interestedUniversity}
                onChange={handleChange}
                disabled={loading}
                className={inputClass(
                  "interestedUniversity",
                  errors
                )}
              />
            </Field>

            {/* Course */}

            <Field
              label="Interested Course / Program"
              required
              error={errors.interestedCourse}
              hint="Enter the degree or program you are interested in."
            >
              <input
                type="text"
                name="interestedCourse"
                placeholder="e.g. Bachelor of Computer Science"
                value={formData.interestedCourse}
                onChange={handleChange}
                disabled={loading}
                className={inputClass(
                  "interestedCourse",
                  errors
                )}
              />
            </Field>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* SECTION 4 - ACCOUNT SECURITY                                     */}
          {/* ---------------------------------------------------------------- */}

          <SectionHeader
            number="4"
            title="Create Your Password"
            description="Use this password to access your student account."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}

            <Field
              label="Password"
              required
              error={errors.password}
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={
                    inputClass("password", errors) +
                    " pr-11"
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  disabled={loading}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-[#0B1F3A] transition"
                  tabIndex={-1}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </Field>

            {/* Confirm Password */}

            <Field
              label="Confirm Password"
              required
              error={errors.confirmPassword}
            >
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className={
                    inputClass("confirmPassword", errors) +
                    " pr-11"
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm((value) => !value)
                  }
                  disabled={loading}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-[#0B1F3A] transition"
                  tabIndex={-1}
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirm ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {formData.confirmPassword &&
                formData.password && (
                  <p
                    className={`text-xs mt-1 font-medium ${
                      formData.password ===
                      formData.confirmPassword
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {formData.password ===
                    formData.confirmPassword
                      ? "✔ Passwords match"
                      : "✖ Passwords do not match"}
                  </p>
                )}
            </Field>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Privacy Notice                                                    */}
          {/* ---------------------------------------------------------------- */}

          <div className="rounded-xl bg-[#F5F8FC] border border-[#DCE5F0] px-4 py-3">
            <p className="text-xs leading-relaxed text-[#3B5378]">
              This frontend demo stores profile details in this browser
              only. The selected passport file is not uploaded; only its
              filename and file details are kept locally. Do not enter real
              personal information.
            </p>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Submit                                                            */}
          {/* ---------------------------------------------------------------- */}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{
              scale: loading ? 1 : 1.02,
            }}
            whileTap={{
              scale: loading ? 1 : 0.98,
            }}
            className="w-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] py-3.5 rounded-full font-bold text-base shadow-lg hover:shadow-[#F5A623]/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
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

                Creating Student Profile...
              </span>
            ) : (
              "Create Student Account"
            )}
          </motion.button>
        </form>

        {/* ------------------------------------------------------------------ */}
        {/* Login                                                               */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />

          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
            Already registered?
          </span>

          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <Link to="/login" className="block">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full border-2 border-[#0B1F3A] text-[#0B1F3A] py-3 rounded-full font-bold text-base hover:bg-[#F5F8FC] transition"
          >
            Sign In Instead
          </motion.button>
        </Link>

        <p className="text-center text-xs text-gray-400 mt-5">
          By creating an account, you agree to provide accurate
          information for your education application.
        </p>
      </motion.div>
    </div>
  );
};

export default Registration;
