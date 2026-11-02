import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/Logo.jpg";

const MySwal = withReactContent(Swal);

// Study Fusion brand palette:
// "Study" -> deep ink-navy (trust, academic credibility)
// "Fusion" -> warm amber-gold, blended in as the accent that "fuses" with the navy
const INK = "#0B1F3A";
const INK_LIGHT = "#122C4F";
const INK_BORDER = "#1F3A5F";
const FUSION_GOLD = "#F5A623";
const FUSION_GOLD_LIGHT = "#FFC15E";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    MySwal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: FUSION_GOLD,
      cancelButtonColor: "#B33A3A",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
        MySwal.fire({
          title: "Logged Out",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const menuLinks = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/about" },
    { name: "Services", to: "/services" },
    { name: "Expert Consultants", to: "/team" },
    { name: "Universities", to: "/universities" },
    { name: "Resources", to: "/research" },
  ];

  const navVariants = {
    hidden: { y: -80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 + i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="backdrop-blur-lg bg-[#0B1F3A]/95 text-white shadow-md fixed top-0 w-full z-50 border-b border-[#1F3A5F]"
    >
      <div className="max-w-9xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.img
                src={logo}
                alt="Study Fusion Logo"
                className="h-12 w-12 rounded-full object-cover shadow-lg ring-2 ring-[#F5A623]/40"
                whileHover={{ rotate: 10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">
                  Study{" "}
                  <span className="bg-gradient-to-r from-[#F5A623] to-[#FFC15E] bg-clip-text text-transparent">
                    Fusion
                  </span>
                </span>
                {/* Fusion mark: a small gradient thread standing in for the "fusion"
                    of two education systems, sitting under the wordmark */}
                <motion.span
                  className="h-[2px] w-10 rounded-full bg-gradient-to-r from-[#1F3A5F] via-[#F5A623] to-[#FFC15E] origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                />
                <motion.span
                  className="text-sm text-[#B9C4D4] mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1.2 }}
                >
                  Education Consultancy — Malaysia &amp; Australia
                </motion.span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuLinks.map((link, i) => (
              <motion.div
                key={link.name}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={link.to}
                  className={`relative group transition ${
                    location.pathname === link.to
                      ? "text-[#F5A623] font-semibold"
                      : "text-white/90 hover:text-[#F5A623]"
                  }`}
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-[#F5A623] to-[#FFC15E] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}

            {/* Auth Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center space-x-4 ml-6"
            >
              {isAuthenticated ? (
                <>
                  <span className="text-[#FFC15E] font-medium text-sm">
                    👋 Hi, {user?.name?.split(" ")[0]}
                  </span>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#B33A3A] hover:bg-[#932F2F] text-white px-4 py-2 rounded-full font-semibold shadow-lg transition"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-[#F5A623]/30"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.95 }}
                      className="border-2 border-[#F5A623] text-[#F5A623] px-4 py-2 rounded-full font-semibold shadow-md hover:bg-[#F5A623] hover:text-[#0B1F3A] transition"
                    >
                      Register
                    </motion.button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-3xl text-[#F5A623] focus:outline-none"
          >
            {isOpen ? "✖" : "☰"}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden bg-[#122C4F]/95 backdrop-blur-md flex flex-col space-y-3 px-4 pb-6 pt-2 overflow-hidden border-t border-[#1F3A5F]"
          >
            {menuLinks.map((link, i) => (
              <motion.div
                key={link.name}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={link.to}
                  className={`block py-2 text-lg transition ${
                    location.pathname === link.to
                      ? "text-[#F5A623] font-semibold"
                      : "text-white/90 hover:text-[#F5A623]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 mt-4 border-t border-[#1F3A5F] pt-4">
              {isAuthenticated ? (
                <>
                  <p className="text-[#FFC15E] font-medium text-sm px-1">
                    👋 Hi, {user?.name}
                  </p>
                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#B33A3A] hover:bg-[#932F2F] text-white px-4 py-2 rounded-full font-semibold shadow-lg transition w-full"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] px-4 py-2 rounded-full font-semibold shadow-lg"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full border-2 border-[#F5A623] text-[#F5A623] px-4 py-2 rounded-full font-semibold shadow-md hover:bg-[#F5A623] hover:text-[#0B1F3A] transition"
                    >
                      Register
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
