"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, Lock, Sparkles, ChevronLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser, sendOtp, verifyOtp } from "@/store/slices/auth";
import { toast } from "react-toastify";
import { gsap } from "gsap";
import Image from "next/image";
import ArdorLogo from "@/public/image/cropped-website-logo-1.png";
import Link from "next/link";

export default function ElegantLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef(null);
  const leftSideRef = useRef(null);
  const formCardRef = useRef(null);
  const titleRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const diamondRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    // Entrance Animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

      tl.fromTo(leftSideRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1 })
        .fromTo(formCardRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.8")
        .fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=1")
        .fromTo(inputRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=1")
        .fromTo(buttonRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=1");
      // .fromTo(diamondRef.current, { scale: 0, rotate: -45 }, { scale: 1, rotate: 0, duration: 1.5, ease: "back.out(1.7)" }, "-=1.2");


      // Background floating elements
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

  useEffect(() => {
    if (isOtpSent) {
      gsap.fromTo(".otp-state",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
      );
    }
  }, [isOtpSent]);

  const handleSendOtp = async () => {
    if (!email) return;
    setIsLoading(true);

    // Subtle button click animation
    gsap.to(buttonRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

    try {
      const result = await dispatch(sendOtp(email));

      if (result.payload?.success) {
        // Transition animation to OTP state
        const tl = gsap.timeline();
        tl.to(".login-initial-state", { x: -30, opacity: 0, duration: 0.4, ease: "power2.in", onComplete: () => setIsOtpSent(true) });
      } else {
        toast.error(typeof result.payload === 'string' ? result.payload : "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setIsLoading(true);
    try {
      const result = await dispatch(verifyOtp({ email, otp }));
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
    const tl = gsap.timeline();
    tl.to(".otp-state", { x: 30, opacity: 0, duration: 0.4, ease: "power2.in" })
      .call(() => {
        setIsOtpSent(false);
        setOtp("");
      });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FEFAF5]">
      {/* Decorative Background Elements */}
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

        {/* Left Side: Visual/Branding */}
        <div ref={leftSideRef} className="hidden lg:block space-y-8">
          {/* <Link href="/" className="inline-block">
            <div ref={diamondRef} className="transition-transform duration-500 hover:scale-105">
              <Image
                src={ArdorLogo}
                alt="Ardor Diamonds"
                width={180}
                height={70}
                className="object-contain"
                priority
              />
            </div>
          </Link> */}

          <div className="space-y-6">
            <h1 className="text-6xl font-extralight text-gray-900 leading-tight">
              Timeless <br />
              <span className="italic font-arizona text-[#00736C]">Elegance</span> <br />
              Awaits You
            </h1>
            <p className="text-gray-500 font-light text-lg max-w-sm leading-relaxed">
              Step into a world where craftsmanship meets brilliance. Access your exclusive jewelry collection.
            </p>
          </div>

          <div className="flex items-center space-x-8 pt-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FEFAF5] bg-gray-200" />
              ))}
            </div>
            <span className="text-sm text-gray-400 font-light">Joined by 10k+ collectors</span>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div ref={formCardRef} className="w-full max-w-md mx-auto">
          <div className="bg-white/70 backdrop-blur-xl p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 relative overflow-hidden group">

            {/* Glossy Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {!isOtpSent ? (
              <div className="login-initial-state space-y-8 relative">
                <div className="lg:hidden flex justify-center mb-6">
                  <Image
                    src={ArdorLogo}
                    alt="Ardor Diamonds"
                    width={140}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <div ref={titleRef} className="space-y-3">
                  <h2 className="text-3xl font-extralight text-gray-900 tracking-tight">Sign In</h2>
                  <p className="text-gray-500 font-light text-sm">Enter your registered email to receive a secure code.</p>
                </div>

                <div className="space-y-6">
                  <div ref={inputRef} className="group/input space-y-2">
                    <label className="text-[10px] font-gintoNord tracking-widest text-gray-400 uppercase group-focus-within/input:text-[#00736C] transition-colors">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="elegance@example.com"
                        className="w-full px-0 py-4 bg-transparent border-0 border-b border-gray-100 focus:border-[#00736C] focus:ring-0 text-gray-900 placeholder-gray-300 transition-all duration-500 font-light"
                      />
                      <Mail className="absolute right-0 top-4 h-4 w-4 text-gray-300 group-focus-within/input:text-[#00736C] transition-colors" />
                    </div>
                    <div className="flex justify-end pt-1">
                      <Link href="/forgot-password" size="sm" className="text-[10px] text-gray-400 hover:text-[#00736C] transition-colors font-gintoNord tracking-wider">
                        FORGOT PASSWORD?
                      </Link>
                    </div>
                  </div>

                  <button
                    ref={buttonRef}
                    onClick={handleSendOtp}
                    disabled={isLoading || !email}
                    className="group/btn w-full relative overflow-hidden bg-gray-900 text-white py-5 font-gintoNord text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      <span className="inline-flex items-center text-white">
                        Request Access
                        <ArrowRight className="ml-3 w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1" />
                      </span>
                    )}
                  </button>

                  <div className="pt-4 text-center">
                    <p className="text-xs text-gray-400 font-light">
                      Don't have an account?{" "}
                      <Link href="/signup" className="text-[#00736C] font-normal hover:underline transition-all">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="otp-state space-y-8 relative shadow-none opacity-0">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handleBack} className="text-gray-400 hover:text-gray-900 transition-colors flex items-center text-[10px] font-gintoNord tracking-wider">
                    <ChevronLeft className="w-4 h-4 mr-1" /> BACK
                  </button>
                  <Lock className="w-5 h-5 text-[#00736C]" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-extralight text-gray-900 tracking-tight">Verify Identity</h2>
                  <p className="text-gray-500 font-light text-sm">
                    A code was sent to <span className="text-gray-900 font-medium">{email}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center space-x-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="otp-field flex-1 h-14 bg-gray-50 text-2xl font-light text-center flex items-center justify-center border-b-2 border-gray-100 focus-within:border-[#00736C] focus-within:bg-white transition-all duration-300">
                        {otp[i] || ""}
                      </div>
                    ))}
                    {/* Hidden input for better accessibility/handling */}
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
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-[#00736C] text-white py-5 font-gintoNord text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#005a54] shadow-lg shadow-[#00736C]/20 disabled:opacity-30"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      "Complete Entry"
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button className="text-[10px] font-gintoNord tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                      RESEND CODE IN 00:59
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="mt-8 text-[10px] text-center text-gray-400 font-gintoNord tracking-[0.2em] uppercase opacity-50">
            Secure Enterprise Gateway
          </p>
        </div>
      </div>
    </div>
  );
}
