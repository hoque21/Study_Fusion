import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <footer className="bg-gradient-to-r from-[#0B1F3A] to-[#122C4F] text-white mt-16 relative overflow-hidden">
      {/* Background floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-[#F5A623]/10 rounded-full blur-3xl top-0 left-0 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#3B5378]/20 rounded-full blur-3xl bottom-0 right-0 animate-ping"></div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-16 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12 relative z-10"
      >
        {/* About Section */}
        <motion.div custom={0} variants={fadeUp}>
          <h2 className="text-2xl font-bold mb-4 tracking-wide">
            Study{" "}
            <span className="bg-gradient-to-r from-[#F5A623] to-[#FFC15E] bg-clip-text text-transparent">
              Fusion
            </span>
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            A trusted education consultancy helping students navigate
            university admissions, visa applications, scholarships, and
            career pathways across Malaysia &amp; Australia.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-6">
            {[
              { icon: <FaFacebookF size={20} />, href: "https://www.facebook.com" },
              { icon: <FaInstagram size={20} />, href: "https://www.instagram.com" },
              { icon: <FaPhoneAlt size={20} />, href: "tel:+60123456789" },
              { icon: <FaEnvelope size={20} />, href: "mailto:info@studyfusion.com" },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="hover:text-[#F5A623] transition"
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div custom={1} variants={fadeUp} className="text-right">
          <h2 className="text-xl font-bold mb-4 tracking-wide">Quick Links</h2>
          <ul className="space-y-3 text-gray-300">
            {[
              { label: "University Admissions", link: "#admissions" },
              { label: "Visa Guidance", link: "#visa" },
              { label: "Scholarships", link: "#scholarships" },
              { label: "Contact Us", link: "#contact" },
            ].map((item, i) => (
              <motion.li key={i} whileHover={{ x: -6 }} transition={{ type: "spring", stiffness: 200 }}>
                <a href={item.link} className="hover:text-[#F5A623] transition">
                  {item.label}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div custom={2} variants={fadeUp} className="text-right">
          <h2 className="text-xl font-bold mb-4 tracking-wide">Contact Info</h2>
          <div className="space-y-2 text-gray-300">
            <p>Level 12, Menara Fusion, Jalan Ampang, 50450 Kuala Lumpur, Malaysia</p>
            <p>+60 12-345 6789</p>
            <p>+61 2 5550 1234</p>
            <p>
              <a href="mailto:info@studyfusion.com" className="hover:text-[#F5A623] transition">
                info@studyfusion.com
              </a>
            </p>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div custom={3} variants={fadeUp} className="text-right">
          <h2 className="text-xl font-bold mb-4 tracking-wide">Our Location</h2>
          <motion.iframe
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            title="Study Fusion Location"
            src="https://www.google.com/maps?q=Kuala+Lumpur,+Malaysia&output=embed"
            width="100%"
            height="150"
            className="border-0 rounded-xl shadow-lg"
            loading="lazy"
          ></motion.iframe>
        </motion.div>
      </motion.div>

      {/* Footer Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="border-t border-[#1F3A5F] mt-12 py-4 text-center text-gray-300 text-sm relative z-10"
      >
        © {new Date().getFullYear()} Study Fusion. All rights reserved.
      </motion.div>
    </footer>
  );
}
