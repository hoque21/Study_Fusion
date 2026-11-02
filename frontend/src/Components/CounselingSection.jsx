import React from "react";
import counselingImg from "../assets/counseling.jpg"; // update path to your image

const CounselingSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between py-16 px-8 md:px-20 bg-white">
      {/* Left Content */}
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-[#F5A623] text-2xl font-semibold">
          Study &amp; Career Counseling
        </h2>
        <h3 className="text-[#0B1F3A] text-xl font-bold">
          Guidance for Every Student
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Looking for expert guidance on studying abroad?{" "}
          <strong>Study Fusion</strong> is your one-stop solution. We offer
          both face-to-face and online consultations, with a multidisciplinary
          team of consultants ready to support you with admissions, visas, and
          scholarships. Whether you're just exploring options or ready to
          apply, our dedicated advisors ensure every student gets the guidance
          they need, wherever they are.
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
  );
};

export default CounselingSection;
