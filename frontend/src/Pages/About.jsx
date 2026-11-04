import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { consultantAPI } from "../services/api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay },
});

const About = () => {
  const [consultants, setConsultants] = useState([]);
  const [consultantError, setConsultantError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    consultantAPI
      .getAll()
      .then((response) => setConsultants(response.data.consultants))
      .catch((error) =>
        setConsultantError(error.message || "Unable to load consultants."),
      );
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#F5F8FC] via-white to-[#F5F8FC] min-h-screen">
      {/* ── PAGE HEADER ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0B1F3A] to-[#16324F] text-white py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block bg-[#F5A623]/20 border border-[#F5A623]/40 text-[#FFC15E] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-sm">
            About{" "}
            <span className="bg-gradient-to-r from-[#F5A623] to-[#FFC15E] bg-clip-text text-transparent">
              Study Fusion
            </span>
          </h1>
          <p className="text-[#D7E0EE] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            A trusted education consultancy for university admissions, visa
            guidance, and scholarship support — serving students across
            Malaysia &amp; Australia since 2018.
          </p>
        </motion.div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Mission & Vision */}
        <section>
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-[#0B1F3A] text-center mb-3"
            {...fadeUp()}
          >
            Our Mission &amp; Vision
          </motion.h2>
          <motion.p
            className="text-center text-[#3B5378] mb-10 max-w-lg mx-auto text-sm"
            {...fadeUp(0.1)}
          >
            The purpose and future that guide everything we do at Study
            Fusion.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: "🎯",
                title: "Our Mission",
                text: "To deliver honest, high-quality education consultancy that empowers students and families to pursue the right university pathway with confidence.",
              },
              {
                icon: "🌟",
                title: "Our Vision",
                text: "To be the leading education consultancy across Malaysia & Australia — recognised for excellence, integrity, and end-to-end support from application to arrival.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-3xl shadow-lg p-8 border-l-4 border-[#F5A623] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                {...fadeUp(i * 0.15)}
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

        {/* Our Story */}
        <section className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-[#E2E8F0]">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-[#0B1F3A] mb-4"
            {...fadeUp()}
          >
            Our Story
          </motion.h2>
          <motion.div
            className="space-y-4 text-gray-600 leading-relaxed"
            {...fadeUp(0.1)}
          >
            <p>
              Study Fusion was founded in 2018 with a simple yet powerful
              belief — that every student deserves clear, honest guidance on
              the path to studying abroad. Starting as a small counselling
              office in Kuala Lumpur, we have grown into a multidisciplinary
              consultancy serving thousands of students across Malaysia and
              Australia.
            </p>
            <p>
              Our team of admissions consultants, visa specialists,
              scholarship advisors, and career counsellors work together
              under one roof, ensuring each student receives comprehensive,
              coordinated support tailored to their unique goals.
            </p>
            <p>
              Today, Study Fusion stands as one of the most trusted names in
              education consultancy in the region — committed to our
              students, to continuous learning, and to the success of every
              applicant who walks through our doors.
            </p>
          </motion.div>
        </section>

        {/* Meet Our Consultants */}
        <section>
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-[#0B1F3A] text-center mb-3"
            {...fadeUp()}
          >
            Meet Our Consultants
          </motion.h2>
          <motion.p
            className="text-center text-[#3B5378] mb-10 max-w-lg mx-auto text-sm"
            {...fadeUp(0.1)}
          >
            Our certified and experienced consultants who are dedicated to
            your study-abroad journey.
          </motion.p>

          {consultantError ? (
            <p className="text-center text-red-700" role="alert">
              {consultantError}
            </p>
          ) : consultants.length === 0 ? (
            <p className="text-center text-gray-600">No consultants to display.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {consultants.map((member, i) => (
              <motion.div
                key={member.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#E2E8F0] flex flex-col hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                {...fadeUp(i * 0.12)}
              >
                {/* Photo */}
                <div className="relative h-52 overflow-hidden bg-[#EAF0FA]">
                  <motion.img
                    src={member.photo}
                    alt={`${member.name}, ${member.role}`}
                    className="w-full h-full object-cover object-top"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute bottom-3 left-3 bg-[#0B1F3A]/85 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {member.tag || member.section}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-lg font-extrabold text-[#0B1F3A]">
                    {member.name}
                  </h4>
                  <p className="text-[#3B5378] font-semibold text-sm">
                    {member.role}
                  </p>
                  <div className="mt-3 space-y-1 text-xs text-gray-500 flex-1">
                    <p className="flex items-center gap-1.5">
                      <span>⏳</span> {member.experience}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span>📅</span> Available: {member.available}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span>🏢</span> {member.office}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default About;
