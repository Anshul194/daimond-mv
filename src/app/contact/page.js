"use client";
import axiosInstance from "@/axiosConfig/axiosInstance";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [data, setData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    phone: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/send-email/contact", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        message: data.message,
        phone: data.phone,
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
        message: "",
        phone: "",
      });
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="relative h-[400px] w-full">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/getintouch.webp"
            width={400}
            height={400}
            alt="Woman showing rings"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/35 to-transparent"></div>

        {/* Text overlay */}
        <div className="relative z-10 flex items-center justify-center h-[400px] w-full ">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-arizona font-light">
              Need assistance?
            </h1>
            <p className="text-sm md:text-lg lg:text-lg font-normal">
              Send us your questions and we will get straight back to you.
            </p>
          </div>
        </div>
      </div>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/your-background-image.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
      </div>

      {/* Text overlay */}
      <div className="relative z-10 flex flex-col bg-white items-center justify-center min-h-screen px-4">
        {/* Contact Form */}
        <div className="w-full max-w-4xl pt-5 p-3 md:p-12 rounded-none">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* First Row - Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                  YOUR FIRST NAME <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={(e) =>
                    setData({ ...data, firstName: e.target.value })
                  }
                  placeholder="Your first name"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 text-gray-600 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                  YOUR LAST NAME <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={(e) =>
                    setData({ ...data, lastName: e.target.value })
                  }
                  placeholder="Your last name"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 text-gray-600 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Second Row - Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                  YOUR EMAIL <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 text-gray-600 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                  YOUR PHONE NUMBER (OPTIONAL)
                </label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 text-gray-600 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                MESSAGE <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                placeholder="Ask your questions"
                value={data.message}
                onChange={(e) => setData({ ...data, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 text-gray-600 placeholder-gray-400 resize-none"
              ></textarea>
            </div>

            {/* Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="subscribe"
                className="mt-1 h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="subscribe" className="text-gray-700 text-sm">
                Subscribe to our mailing list
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              {loading ? (
                <button
                  type="submit"
                  disabled
                  className="bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-8 uppercase tracking-wide transition-colors duration-200"
                >
                  Sending...
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-8 uppercase tracking-wide transition-colors duration-200"
                >
                  SUBMIT
                </button>
              )}
            </div>

            {/* reCAPTCHA Notice */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                This site is protected by reCAPTCHA. The{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Google Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                apply.
              </p>
            </div>
          </form>
        </div>

        {/* Contact Information Section */}
        <div className="w-full max-w-4xl w-full max-w-4xl pt-5 p-3 md:p-12 mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="flex space-x-4 items-center">
              <div className="w-6 h-6 mt-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[10px] font-gintoNord uppercase tracking-wide">
                  BOOK AN APPOINTMENT
                </p>
              </div>
            </div>

            <div className="flex space-x-4 items-center">
              <div className="w-6 h-6 mt-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium uppercase text-[10px] font-gintoNord tracking-wide">
                  CLIENT CARE HOURS:
                </p>
                <p className="font-medium  text-[10px] font-gintoNord mt-1 ">
                  WEEKDAYS 9AM – 5PM SATURDAY 8AM – 4PM
                </p>
              </div>
            </div>

            <div className="flex space-x-4 items-center">
              <div className="w-6 h-6 mt-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.53 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium uppercase  tracking-wide text-[10px] font-gintoNord">
                  VIEW FREQUENTLY ASKED QUESTIONS
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="flex space-x-4 items-center">
              <div className="w-6 h-6 mt-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[10px] font-gintoNord">
                  +61 1300 977 619
                </p>
              </div>
            </div>

            <div className="flex space-x-4 items-center">
              <div className="w-6 h-6 mt-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                >
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium uppercase tracking-wide text-sm">
                  LIVE CHAT
                </p>
              </div>
            </div>

            <div className="flex space-x-4 items-center ">
              <div className="w-6 h-6 mt-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[10px] font-gintoNord">
                  SALES@CULLENJEWELLERY.COM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
