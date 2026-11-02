import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGlobe, FaPassport, FaHandHoldingUsd, FaGraduationCap } from "react-icons/fa";
import counselingImg from "../assets/Hero.jpg";

const initialResearchHighlights = [
  {
    title: "Global Education Trends",
    description:
      "Tracking university rankings, program changes, and admission trends across Malaysia & Australia.",
    icon: <FaGlobe className="text-[#0B1F3A] w-10 h-10" />,
  },
  {
    title: "Visa & Policy Research",
    description:
      "Monitoring visa policy changes and migration requirements to keep our guidance accurate and current.",
    icon: <FaPassport className="text-[#0B1F3A] w-10 h-10" />,
  },
  {
    title: "Scholarship & Funding Analysis",
    description:
      "Researching scholarship opportunities and funding options to help students study affordably.",
    icon: <FaHandHoldingUsd className="text-[#0B1F3A] w-10 h-10" />,
  },
  {
    title: "Student Success Studies",
    description:
      "Studying what helps students settle in, perform well, and graduate on time abroad.",
    icon: <FaGraduationCap className="text-[#0B1F3A] w-10 h-10" />,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, type: "spring", stiffness: 100 },
  }),
};

const Research = () => {
  const [researchHighlights, setResearchHighlights] = useState(initialResearchHighlights);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const reloadResearch = () => {
    const shuffled = [...researchHighlights].sort(() => Math.random() - 0.5);
    setResearchHighlights(shuffled);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-16">
      {/* ---------- RESEARCH SECTION ---------- */}
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold text-[#0B1F3A] mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Research at Study Fusion
        </motion.h2>

        <motion.p
          className="text-gray-700 text-lg mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Study Fusion conducts ongoing research into university admissions, visa policy, and
          scholarship opportunities across Malaysia &amp; Australia. Our research keeps our
          guidance accurate, current, and genuinely useful for every student we advise.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {researchHighlights.map((item, index) => (
            <motion.div
              key={index}
              className="bg-[#F5F8FC] rounded-xl shadow-lg p-6 text-left cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <div className="flex items-center mb-4">
                <div className="bg-white p-3 rounded-full shadow-md mr-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#0B1F3A]">{item.title}</h3>
              </div>
              <p className="text-gray-700">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <button
            className="bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] px-6 py-3 rounded-full font-semibold hover:shadow-md transition shadow-lg"
            onClick={() => alert("Coming soon: Full Research Details Page!")}
          >
            See Full Research Details
          </button>
          <button
            className="bg-[#0B1F3A] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#16324F] transition shadow-lg"
            onClick={reloadResearch}
          >
            Reload Highlights
          </button>
        </motion.div>
      </div>

      {/* ---------- COUNSELING SECTION ---------- */}
      <section className="flex flex-col md:flex-row items-center justify-between py-16 px-8 md:px-20 bg-white mt-24">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-[#F5A623] text-2xl font-semibold">
            Study &amp; Career Counseling
          </h2>
          <h3 className="text-[#0B1F3A] text-xl font-bold">
            Guidance for Every Student
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Looking for expert guidance on studying abroad? <strong>Study Fusion</strong> is
            your one-stop solution. We offer both face-to-face and online consultations, with a
            multidisciplinary team of consultants ready to support you with admissions, visas,
            and scholarships. Whether you're just exploring options or ready to apply, our
            dedicated advisors ensure every student gets the guidance they need, wherever they
            are.
          </p>

          <button className="bg-[#0B1F3A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#16324F] transition duration-300 flex items-center gap-2">
            View Consultants <span className="text-lg">→</span>
          </button>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src={counselingImg}
            alt="Counseling session"
            className="rounded-2xl shadow-lg max-w-full md:max-w-md"
          />
        </div>
      </section>
    </div>
  );
};

export default Research;
