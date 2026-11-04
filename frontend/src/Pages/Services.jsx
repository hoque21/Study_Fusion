import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaPassport,
  FaHandHoldingUsd,
  FaRoute,
  FaChalkboardTeacher,
} from "react-icons/fa";

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const services = [
    {
      title: "University Admissions",
      description:
        "Comprehensive guidance on choosing the right university and building a strong application.",
      details:
        "Get help comparing universities and programs, checking entry requirements, preparing application documents, and submitting applications on time.",
      icon: <FaGraduationCap className="text-[#0B1F3A] w-16 h-16" />,
    },
    {
      title: "Visa & Migration Consultation",
      description:
        "Expert support with student visa applications, documentation, and interview preparation.",
      details:
        "We help you understand visa requirements, organize supporting documents, complete application steps, and prepare for possible interviews.",
      icon: <FaPassport className="text-[#0B1F3A] w-16 h-16" />,
    },
    {
      title: "Scholarship & Financial Aid",
      description:
        "Helping you find and apply for scholarships and funding to make studying abroad affordable.",
      details:
        "Explore scholarship options and funding pathways, review eligibility, and get support preparing clear and complete applications.",
      icon: <FaHandHoldingUsd className="text-[#0B1F3A] w-16 h-16" />,
    },
    {
      title: "Career & Pathway Counselling",
      description: "Personalised guidance to map out the right course and career pathway.",
      details:
        "Discuss your interests and goals, compare course pathways, and create a practical plan that connects your education choices to future careers.",
      icon: <FaRoute className="text-[#0B1F3A] w-16 h-16" />,
    },
    {
      title: "Test Prep & Training Programs",
      description:
        "Workshops and training to help students prepare for English tests, interviews, and applications.",
      details:
        "Build practical skills through structured sessions covering English-test preparation, application writing, and interview practice.",
      icon: <FaChalkboardTeacher className="text-[#0B1F3A] w-16 h-16" />,
    },
  ];

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0.4, duration: 0.8 },
    },
    hover: {
      scale: 1.06,
      boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FC] to-[#EAF0FA] px-6 sm:px-8 lg:px-16 py-20">
      {/* Header */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1F3A] mb-2 drop-shadow-sm">
          Our Services
        </h2>
        <p className="text-[#3B5378] text-sm md:text-base">
          Discover our range of professional services to guide your study-abroad journey.
        </p>
      </motion.div>

      {/* Service Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="relative bg-white rounded-3xl shadow-lg cursor-pointer flex flex-col overflow-hidden"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            whileHover="hover"
          >
            {/* Icon */}
            <div className="flex items-center justify-center h-48 bg-[#EAF0FA]">
              {service.icon}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-start">
              <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">{service.title}</h3>
              <p className="text-gray-700 text-sm mb-4">{service.description}</p>
              <button
                type="button"
                onClick={() => setSelectedService(service)}
                className="px-4 py-2 bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] font-semibold rounded-full shadow-md transition-colors"
              >
                Learn More
              </button>
            </div>

            {/* Hover Overlay */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#FFF3DF]/50 to-transparent pointer-events-none rounded-3xl"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </motion.div>

      {selectedService && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1F3A]/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedService(null);
          }}
        >
          <motion.section
            aria-labelledby="service-details-title"
            aria-modal="true"
            role="dialog"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#B7791F]">
                  Service details
                </p>
                <h2
                  id="service-details-title"
                  className="text-2xl font-bold text-[#0B1F3A]"
                >
                  {selectedService.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                aria-label="Close service details"
                className="rounded-full px-3 py-1 text-2xl leading-none text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>
            <p className="leading-7 text-slate-700">{selectedService.details}</p>
            <Link
              to="/contact"
              className="mt-7 inline-flex rounded-full bg-[#0B1F3A] px-5 py-3 font-semibold text-white hover:bg-[#16324F]"
            >
              Contact us about this service
            </Link>
          </motion.section>
        </div>
      )}
    </div>

  );
};

export default Services;
