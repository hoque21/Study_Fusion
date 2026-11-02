import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { contactAPI } from "../services/api";

const MySwal = withReactContent(Swal);

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      MySwal.fire({
        title: "Error",
        text: "Please fill in all required fields",
        icon: "error",
        confirmButtonColor: "#0B1F3A",
      });
      return;
    }

    setLoading(true);

    try {
      await contactAPI.submit(formData);

      MySwal.fire({
        title: "Saved in This Browser",
        text: "This frontend demo saved your message locally. No email or real message was sent.",
        icon: "success",
        iconColor: "#F5A623",
        background: "#FFF7E8",
        confirmButtonColor: "#F5A623",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send message. Please try again.";
      MySwal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#0B1F3A",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0B1F3A] mb-6">Contact Us</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-[#0B1F3A] mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Address:</strong> Level 12, Menara Fusion, Jalan Ampang, 50450 Kuala Lumpur, Malaysia
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> info@studyfusion.com
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> +60 12-345 6789
              </p>
              <p className="text-gray-700">
                For consultations, inquiries, or support, please reach out to us through email or phone.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-[#0B1F3A] mb-4">Send us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this about?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us how we can help you..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0B1F3A] to-[#16324F] text-white py-2 px-4 rounded-md hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
