"use client";

import { useState } from "react";
import { Mail, ArrowRight, Lock, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, sendOtp, verifyOtp } from "@/store/slices/auth";
import { toast } from "react-toastify";

export default function ElegantRingLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      const result = await dispatch(sendOtp(email));
      console.log("OTP send result:", result);
      if (result.payload.success) {
        setIsOtpSent(true);
        toast.success("OTP sent to your email!");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.log("Error sending OTP:", error);
      toast.error("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const dispatch = useDispatch();
  const handleVerifyOtp = async () => {
    if (!otp) return;
    setIsLoading(true);
    try {
      const result = await dispatch(verifyOtp({ email, otp }));
      console.log("OTP verification result:", result);
      if (result.error) {
        toast.error("OTP verification failed. Please try again.");
      } else {
        await dispatch(fetchCurrentUser());
        window.location.href = "/";
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      toast.error("Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setIsOtpSent(false);
    setOtp("");
  };

  return (
    <div
      className="min-h-fit flex justify-center"
      style={{ backgroundColor: "#FEFAF5" }}
    >
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between p-16 w-full">
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-extralight text-gray-900 tracking-wide">
                  Exquisite Craftsmanship
                </h1>
                <p className="text-gray-600 font-light text-lg max-w-md mx-auto leading-relaxed">
                  Each piece tells a story of timeless elegance and unparalleled
                  artistry
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          {!isOtpSent ? (
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-light tracking-wider text-gray-900">
                    LUMIÈRE
                  </span>
                </div>
                <h2 className="text-3xl font-extralight text-gray-900 tracking-wide">
                  Welcome
                </h2>
                <p className="text-gray-500 font-light">
                  Enter your email to continue
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-4 pr-12 bg-transparent border-0 border-b-2 border-gray-200 focus:border-gray-900 focus:ring-0 text-gray-900 placeholder-gray-400 transition-all duration-300 font-light"
                    />
                    <Mail className="absolute right-4 top-4 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={isLoading || !email}
                  className="w-full bg-gray-900 text-white py-4 rounded-none font-light text-sm tracking-wider uppercase hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                  <Lock className="w-8 h-8 text-gray-600" />
                </div>
                <h2 className="text-3xl font-extralight text-gray-900 tracking-wide">
                  Verification
                </h2>
                <p className="text-gray-500 font-light text-sm">
                  Enter the code sent to
                  <br />
                  <span className="text-gray-700 font-medium">{email}</span>
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-gray-900 focus:ring-0 text-gray-900 placeholder-gray-400 transition-all duration-300 font-light text-center text-2xl tracking-widest"
                    maxLength="6"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-gray-900 text-white py-4 rounded-none font-light text-sm tracking-wider uppercase hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Verify"
                    )}
                  </button>

                  <button
                    onClick={handleBack}
                    className="w-full text-gray-600 py-3 font-light text-sm tracking-wide hover:text-gray-900 transition-colors"
                  >
                    ← Back
                  </button>
                </div>

                <div className="text-center">
                  <button className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors tracking-wide">
                    Resend code
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400 tracking-wide leading-relaxed">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
