"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, User, Lock, Sparkles, ChevronLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { signup, sendOtp, verifyOtp } from "@/store/slices/auth";
import { toast } from "react-toastify";
import { gsap } from "gsap";
import Image from "next/image";
import ArdorLogo from "@/public/image/cropped-website-logo-1.png";
import Link from "next/link";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef(null);
  const leftSideRef = useRef(null);
  const formCardRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  const logoRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
      
      tl.fromTo(leftSideRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1 })
        .fromTo(formCardRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.8")
        .fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=1")
        .fromTo(".signup-input", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1 }, "-=0.8")
        .fromTo(buttonRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.6")
        .fromTo(logoRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "back.out(1.7)" }, "-=1.2");

      gsap.to(".bg-sparkle", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupInitiate = async () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    gsap.to(buttonRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

    try {
      const result = await dispatch(sendOtp(formData.email));
      if (result.payload?.success) {
        gsap.to(".signup-initial-state", { x: -30, opacity: 0, duration: 0.4, ease: "power2.in" })
          .eventCallback("onComplete", () => setIsOtpSent(true));
        toast.success("Verification code sent!");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSignup = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }
    setIsLoading(true);
    try {
      const verifyResult = await dispatch(verifyOtp({ email: formData.email, otp }));
      if (!verifyResult.error) {
        const signupResult = await dispatch(signup(formData));
        if (!signupResult.error) {
          toast.success("Account created successfully!");
          window.location.href = "/";
        } else {
          toast.error(signupResult.payload || "Registration failed");
        }
      } else {
        toast.error("Invalid verification code");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    gsap.to(".otp-state", { x: 30, opacity: 0, duration: 0.4, ease: "power2.in" })
      .eventCallback("onComplete", () => {
        setIsOtpSent(false);
        setOtp("");
      });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FEFAF5]">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="bg-sparkle absolute w-2 h-2 rounded-full bg-[#00736C]/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: "blur(1px)"
            }}
          />
        ))}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#00736C]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div ref={leftSideRef} className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl font-extralight text-gray-900 leading-tight">
              Begin Your <br /> 
              <span className="italic font-arizona text-[#00736C]">Radiant</span> <br />
              Journey
            </h1>
            <p className="text-gray-500 font-light text-lg max-w-sm leading-relaxed">
              Create an account to join our inner circle of fine jewelry collectors and receive exclusive updates.
            </p>
          </div>

          <div className="flex items-center space-x-8 pt-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FEFAF5] bg-gray-200" />
              ))}
            </div>
            <span className="text-sm text-gray-400 font-light">Join over 10,000 members</span>
          </div>
        </div>

        <div ref={formCardRef} className="w-full max-w-md mx-auto">
          <div className="bg-white/70 backdrop-blur-xl p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {!isOtpSent ? (
              <div className="signup-initial-state space-y-8 relative">
                <div ref={titleRef} className="space-y-3">
                  <div className="lg:hidden flex justify-center mb-6">
                    <Image src={ArdorLogo} alt="Ardor Diamonds" width={140} height={50} className="object-contain" />
                  </div>
                  <h2 className="text-3xl font-extralight text-gray-900 tracking-tight">Create Account</h2>
                  <p className="text-gray-500 font-light text-sm">Join the Ardor family to experience true brilliance.</p>
                </div>

                <div className="space-y-5">
                  <div className="signup-input group/input space-y-2">
                    <label className="text-[10px] font-gintoNord tracking-widest text-gray-400 uppercase group-focus-within/input:text-[#00736C] transition-colors">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-100 focus:border-[#00736C] focus:ring-0 text-gray-900 placeholder-gray-300 transition-all duration-500 font-light"
                      />
                      <User className="absolute right-0 top-3 h-4 w-4 text-gray-300 group-focus-within/input:text-[#00736C] transition-colors" />
                    </div>
                  </div>

                  <div className="signup-input group/input space-y-2">
                    <label className="text-[10px] font-gintoNord tracking-widest text-gray-400 uppercase group-focus-within/input:text-[#00736C] transition-colors">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="elegance@example.com"
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-100 focus:border-[#00736C] focus:ring-0 text-gray-900 placeholder-gray-300 transition-all duration-500 font-light"
                      />
                      <Mail className="absolute right-0 top-3 h-4 w-4 text-gray-300 group-focus-within/input:text-[#00736C] transition-colors" />
                    </div>
                  </div>

                  <div className="signup-input group/input space-y-2">
                    <label className="text-[10px] font-gintoNord tracking-widest text-gray-400 uppercase group-focus-within/input:text-[#00736C] transition-colors">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-100 focus:border-[#00736C] focus:ring-0 text-gray-900 placeholder-gray-300 transition-all duration-500 font-light"
                      />
                      <Lock className="absolute right-0 top-3 h-4 w-4 text-gray-300 group-focus-within/input:text-[#00736C] transition-colors" />
                    </div>
                  </div>

                  <button
                    ref={buttonRef}
                    onClick={handleSignupInitiate}
                    disabled={isLoading}
                    className="group/btn w-full relative overflow-hidden bg-gray-900 text-white py-5 mt-4 font-gintoNord text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:bg-gray-800 disabled:opacity-30"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      <span className="inline-flex items-center text-white">
                        Join Ardor 
                        <ArrowRight className="ml-3 w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1" />
                      </span>
                    )}
                  </button>
                </div>

                <div className="pt-6 text-center">
                  <p className="text-xs text-gray-400 font-light">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#00736C] font-normal hover:underline transition-all">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="otp-state space-y-8 relative">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handleBack} className="text-gray-400 hover:text-gray-900 transition-colors flex items-center text-[10px] font-gintoNord tracking-wider">
                    <ChevronLeft className="w-4 h-4 mr-1" /> BACK
                  </button>
                  <Lock className="w-5 h-5 text-[#00736C]" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-extralight text-gray-900 tracking-tight">Verify Email</h2>
                  <p className="text-gray-500 font-light text-sm">
                    A code was sent to <span className="text-gray-900 font-medium">{formData.email}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center space-x-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="otp-field flex-1 h-14 bg-gray-50 text-2xl font-light text-center flex items-center justify-center border-b-2 border-gray-100 focus-within:border-[#00736C] focus-within:bg-white transition-all duration-300">
                        {otp[i] || ""}
                      </div>
                    ))}
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="absolute inset-0 opacity-0 cursor-default w-full"
                      maxLength="6"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={handleVerifyAndSignup}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-[#00736C] text-white py-5 font-gintoNord text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#005a54] shadow-lg shadow-[#00736C]/20 disabled:opacity-30"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
