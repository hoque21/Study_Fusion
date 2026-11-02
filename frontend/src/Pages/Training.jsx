import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaExternalLinkAlt } from "react-icons/fa";

// Workshop images
import training1 from "../assets/Rifat.jpg";
import training2 from "../assets/Rifat.jpg";
import training3 from "../assets/Rifat.jpg";
import training4 from "../assets/Rifat.jpg";

/* ─── Partner Universities ────────────────────────────────────────────────
   Tuition figures are indicative annual costs for international
   undergraduates and vary by programme/intake — always confirm current
   fees and entry requirements on the official portal before applying. ── */

const MALAYSIA_UNIS = [
  {
    name: "Universiti Malaya (UM)",
    type: "Public",
    location: "Kuala Lumpur",
    tuition: "~USD 3,000 – 7,000 / year",
    apply: "https://study.um.edu.my",
  },
  {
    name: "Universiti Kebangsaan Malaysia (UKM)",
    type: "Public",
    location: "Bangi, Selangor",
    tuition: "~USD 2,500 – 6,000 / year",
    apply: "https://www.ukm.my",
  },
  {
    name: "Universiti Putra Malaysia (UPM)",
    type: "Public",
    location: "Serdang, Selangor",
    tuition: "~USD 2,500 – 6,500 / year",
    apply: "https://www.upm.edu.my",
  },
  {
    name: "Universiti Sains Malaysia (USM)",
    type: "Public",
    location: "Penang",
    tuition: "~USD 2,000 – 6,000 / year",
    apply: "https://admission.usm.my",
  },
  {
    name: "Universiti Teknologi Malaysia (UTM)",
    type: "Public",
    location: "Johor Bahru / KL",
    tuition: "~USD 2,500 – 7,000 / year",
    apply: "https://admission.utm.my",
  },
  {
    name: "International Islamic University Malaysia (IIUM)",
    type: "Public",
    location: "Gombak, Selangor",
    tuition: "~USD 2,500 – 6,000 / year",
    apply: "https://www.iium.edu.my",
  },
  {
    name: "Taylor's University",
    type: "Private",
    location: "Subang Jaya, Selangor",
    tuition: "~USD 6,000 – 15,000 / year (higher for Medicine)",
    apply: "https://university.taylors.edu.my",
  },
  {
    name: "Sunway University",
    type: "Private",
    location: "Bandar Sunway, Selangor",
    tuition: "~USD 5,000 – 12,000 / year",
    apply: "https://sunwayuniversity.edu.my",
  },
  {
    name: "Monash University Malaysia",
    type: "Private (Australian branch campus)",
    location: "Bandar Sunway, Selangor",
    tuition: "~USD 6,000 – 13,000 / year",
    apply: "https://www.monash.edu.my",
  },
  {
    name: "UCSI University",
    type: "Private",
    location: "Kuala Lumpur",
    tuition: "~USD 4,000 – 10,000 / year",
    apply: "https://www.ucsiuniversity.edu.my",
  },
];

const AUSTRALIA_UNIS = [
  {
    name: "University of Melbourne",
    type: "Public (Group of Eight)",
    location: "Melbourne, VIC",
    tuition: "~AUD 45,000 – 52,000 / year",
    apply: "https://study.unimelb.edu.au",
  },
  {
    name: "University of Sydney",
    type: "Public (Group of Eight)",
    location: "Sydney, NSW",
    tuition: "~AUD 45,000 – 58,000 / year",
    apply: "https://www.sydney.edu.au/study",
  },
  {
    name: "Australian National University (ANU)",
    type: "Public (Group of Eight)",
    location: "Canberra, ACT",
    tuition: "~AUD 45,000 – 50,000 / year",
    apply: "https://www.anu.edu.au/study",
  },
  {
    name: "University of Queensland (UQ)",
    type: "Public (Group of Eight)",
    location: "Brisbane, QLD",
    tuition: "~AUD 40,000 – 48,000 / year",
    apply: "https://study.uq.edu.au",
  },
  {
    name: "Monash University",
    type: "Public (Group of Eight)",
    location: "Melbourne, VIC",
    tuition: "~AUD 40,000 – 49,000 / year",
    apply: "https://www.monash.edu/study",
  },
  {
    name: "UNSW Sydney",
    type: "Public (Group of Eight)",
    location: "Sydney, NSW",
    tuition: "~AUD 42,000 – 52,000 / year",
    apply: "https://www.unsw.edu.au/study",
  },
  {
    name: "University of Western Australia (UWA)",
    type: "Public (Group of Eight)",
    location: "Perth, WA",
    tuition: "~AUD 38,000 – 46,000 / year",
    apply: "https://www.uwa.edu.au/study",
  },
  {
    name: "University of Adelaide",
    type: "Public (Group of Eight)",
    location: "Adelaide, SA",
    tuition: "~AUD 38,000 – 45,000 / year",
    apply: "https://www.adelaide.edu.au/degree-finder",
  },
  {
    name: "RMIT University",
    type: "Public",
    location: "Melbourne, VIC",
    tuition: "~AUD 35,000 – 42,000 / year",
    apply: "https://www.rmit.edu.au/study-with-us",
  },
  {
    name: "University of Technology Sydney (UTS)",
    type: "Public",
    location: "Sydney, NSW",
    tuition: "~AUD 36,000 – 44,000 / year",
    apply: "https://www.uts.edu.au/future-students",
  },
];

const UniversityCard = ({ uni, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.06, duration: 0.4 }}
    className="bg-white rounded-2xl shadow-md border border-[#E2E8F0] p-5 flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
  >
    <h4 className="text-base font-bold text-[#0B1F3A] leading-snug mb-1">
      {uni.name}
    </h4>
    <p className="text-xs text-[#3B5378] font-medium mb-3">
      {uni.type} · {uni.location}
    </p>
    <div className="mt-auto space-y-3">
      <div className="bg-[#F5F8FC] border border-[#DCE6F2] rounded-lg px-3 py-2">
        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">
          Indicative Tuition
        </p>
        <p className="text-sm font-semibold text-[#0B1F3A]">{uni.tuition}</p>
      </div>
      <a
        href={uni.apply}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] text-sm font-semibold py-2 rounded-full shadow hover:shadow-md transition"
      >
        Official Site &amp; Application Portal <FaExternalLinkAlt size={11} />
      </a>
    </div>
  </motion.div>
);

const Training = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const trainings = [
    {
      title: "IELTS & PTE Preparation",
      description: "Boost your English proficiency score for university admission.",
      topics: [
        "Test format overview",
        "Speaking & writing strategies",
        "Mock test practice",
        "Time management techniques",
      ],
      image: training1,
      price: "$250",
      date: "2025-12-01",
    },
    {
      title: "SOP & Personal Statement Writing",
      description: "Craft a compelling statement of purpose for your applications.",
      topics: [
        "Structuring your SOP",
        "Highlighting your strengths",
        "Common mistakes to avoid",
        "One-on-one review session",
      ],
      image: training2,
      price: "$150",
      date: "2025-12-15",
    },
    {
      title: "Visa Interview Preparation",
      description: "Practice and prepare for your student visa interview with confidence.",
      topics: [
        "Common interview questions",
        "Mock interview sessions",
        "Document checklist",
        "Confidence-building techniques",
      ],
      image: training3,
      price: "$180",
      date: "2026-01-10",
    },
    {
      title: "Scholarship Application Workshop",
      description: "Learn how to find and apply for scholarships effectively.",
      topics: [
        "Scholarship search strategies",
        "Application requirements",
        "Essay writing tips",
        "Deadline planning",
      ],
      image: training4,
      price: "$120",
      date: "2026-01-25",
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, type: "spring", stiffness: 100 },
    }),
    hover: { scale: 1.05, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" },
  };

  const showDetails = (training) => {
    Swal.fire({
      title: `<strong>${training.title}</strong>`,
      html: `
        <p><strong>Description:</strong> ${training.description}</p>
        <p><strong>Topics Covered:</strong></p>
        <ul style="text-align:left;margin-left:1em;">
          ${training.topics.map((topic) => `<li>${topic}</li>`).join("")}
        </ul>
        <p><strong>Price:</strong> ${training.price}</p>
        <p><strong>Upcoming Date:</strong> ${training.date}</p>
      `,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#0B1F3A",
      background: "#FFF7E8",
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 py-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#0B1F3A] mb-3">
          Partner Universities &amp; Training
        </h2>
        <p className="text-[#3B5378] text-sm md:text-base mb-4 max-w-2xl mx-auto">
          Explore our partner universities across Malaysia &amp; Australia, then get
          test- and application-ready with our workshops below.
        </p>
        <p className="text-xs text-gray-400 max-w-2xl mx-auto mb-14">
          Tuition figures shown are indicative annual costs for international
          undergraduates and vary by programme and intake — always confirm current
          fees and entry requirements on the official portal before applying.
        </p>

        {/* ── MALAYSIA UNIVERSITIES ─────────────────────────────────── */}
        <div className="text-left mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🇲🇾</span>
            <h3 className="text-2xl font-bold text-[#0B1F3A]">
              Partner Universities in Malaysia
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {MALAYSIA_UNIS.map((uni, i) => (
              <UniversityCard uni={uni} i={i} key={uni.name} />
            ))}
          </div>
        </div>

        {/* ── AUSTRALIA UNIVERSITIES ────────────────────────────────── */}
        <div className="text-left mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🇦🇺</span>
            <h3 className="text-2xl font-bold text-[#0B1F3A]">
              Partner Universities in Australia
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {AUSTRALIA_UNIS.map((uni, i) => (
              <UniversityCard uni={uni} i={i} key={uni.name} />
            ))}
          </div>
        </div>

        {/* ── WORKSHOPS ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6 text-left">
          <span className="text-2xl">🎓</span>
          <h3 className="text-2xl font-bold text-[#0B1F3A]">
            Workshops &amp; Training Programs
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainings.map((training, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer flex flex-col items-center transform transition-all duration-300 hover:-translate-y-2"
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
            >
                  {/* Card Header Gradient */}
                  <div className="w-full bg-gradient-to-r from-[#1F3A5F] to-[#0B1F3A] p-2 flex justify-center">
                    <img
                      src={training.image}
                      alt={training.title}
                      className="w-32 h-32 object-cover rounded-full border-4 border-white -mt-16 shadow-lg"
                      onClick={() => setSelectedImage(training.image)}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">{training.title}</h3>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">{training.description}</p>
                    <div className="flex flex-col items-center mb-3">
                      <p className="text-gray-900 font-semibold">Price: {training.price}</p>
                      <p className="text-gray-600 text-sm">Date: {training.date}</p>
                    </div>
                    <button
                      onClick={() => showDetails(training)}
                      className="mt-auto px-4 py-2 bg-gradient-to-r from-[#F5A623] to-[#FFC15E] text-[#0B1F3A] font-semibold rounded-full hover:shadow-md transition shadow-lg"
                    >
                      View Details
                    </button>
                  </div>
            </motion.div>
          ))}
        </div>

        <p className="text-gray-700 mt-12 text-lg max-w-3xl mx-auto">
          Our workshops are designed for students and applicants who want to strengthen their
          applications, ace their tests, and prepare confidently for visa interviews. Click on
          any card to see a larger image or view details.
        </p>
      </div>

      {/* Gallery Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-2xl max-w-3xl w-full shadow-xl">
            <button
              className="absolute top-2 right-2 text-gray-700 text-2xl font-bold hover:text-gray-900"
              onClick={() => setSelectedImage(null)}
            >
              ✖
            </button>
            <img
              src={selectedImage}
              alt="Workshop"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
