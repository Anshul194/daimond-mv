import axiosInstance from "@/axiosConfig/axiosInstance";
import React, { useState } from "react";
import { toast } from "react-toastify";

const StartProcessForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    centreStoneType: "",
    message: "",
    subscribeToMailing: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/send-email/customRing", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        message: formData.message,
        phone: formData.phone,
        centreStoneType: formData.centreStoneType,
      });

      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit the form. Please try again later.");
    } finally {
      setLoading(false);
      setData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        centreStoneType: "",
        message: "",
        subscribeToMailing: false,
      });
    }
  };

  return (
    <section className="bg-[#F8F8F8] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl text-gray-800 font-light mb-4">
            Start the Process
          </h2>
          <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-6"></div>
          <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
            Fill out the form below and one of our custom ring experts will be
            in touch with you.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FIRST NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Your first name"
                required
                className="w-full px-4 text-gray-700 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B1C9B9] focus:border-transparent placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LAST NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Your last name"
                required
                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B1C9B9] focus:border-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Email and Phone Number Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EMAIL <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your email"
                required
                className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B1C9B9] focus:border-transparent placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PHONE NUMBER (OPTIONAL)
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone number"
                className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B1C9B9] focus:border-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Centre Stone Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Centre Stone Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {[
                { value: "moissanite", label: "Moissanite" },
                { value: "lab-grown-diamond", label: "Lab grown diamond" },
                { value: "choose-later", label: "Choose later" },
                { value: "other", label: "Other" },
              ].map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={option.value}
                    name="centreStoneType"
                    value={option.value}
                    checked={formData.centreStoneType === option.value}
                    onChange={handleInputChange}
                    required
                    className="w-4 h-4 text-gray-700 border-gray-300 focus:ring-[#B1C9B9] focus:ring-2"
                  />
                  <label
                    htmlFor={option.value}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MESSAGE <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us more about your ring!"
              required
              rows={6}
              className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B1C9B9] focus:border-transparent placeholder-gray-400 resize-none"
            />
          </div>

          {/* Subscribe Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="subscribeToMailing"
              name="subscribeToMailing"
              checked={formData.subscribeToMailing}
              onChange={handleInputChange}
              className="w-4 h-4 text-gray-700 border-gray-300 rounded focus:ring-[#B1C9B9] focus:ring-2 mt-0.5"
            />
            <label
              htmlFor="subscribeToMailing"
              className="text-sm text-gray-700"
            >
              Subscribe to our mailing list
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            {loading ? (
              <button
                type="button"
                className="bg-[#25603B] hover:bg-[#1e4e2f] text-white px-8 py-3 text-md font-semibold transition duration-200 uppercase tracking-wide"
              >
                Sending...
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-[#25603B] hover:bg-[#1e4e2f] text-white px-8 py-3 text-md font-semibold transition duration-200 uppercase tracking-wide"
              >
                SUBMIT
              </button>
            )}
          </div>

          {/* reCAPTCHA Notice */}
          <div className="text-center text-xs text-gray-500 mt-4">
            This site is protected by reCAPTCHA. The{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Google Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            apply.
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartProcessForm;
