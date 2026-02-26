"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, ArrowRight, Sparkles, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { gsap } from "gsap";
import Image from "next/image";
import ArdorLogo from "@/public/image/cropped-website-logo-1.png";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const containerRef = useRef(null);
  const leftSideRef = useRef(null);
  const formCardRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
      
      tl.fromTo(leftSideRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1 })
        .fromTo(formCardRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.8")
        .fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=1")
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

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    setIsLoading(true);
    gsap.to(buttonRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FEFAF5]">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="bg-sparkle absolute w-2 h-2 rounded-full bg-[#00736C]/10"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, filter: "blur(1px)" }}
          />
        ))}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#00736C]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        <div ref={leftSideRef} className="hidden lg:block space-y-8">
          {/* <Link href="/" className="inline-block">
            <div ref={logoRef} className="transition-transform duration-500 hover:scale-105">
              <Image src={ArdorLogo} alt="Ardor Diamonds" width={180} height={70} className="object-contain" priority />
            </div>
          </Link> */}
          
          <div className="space-y-6">
            <h1 className="text-6xl font-extralight text-gray-900 leading-tight">
              Restore Your <br /> 
              <span className="italic font-arizona text-[#00736C]">Radiance</span>
            </h1>
            <p className="text-gray-500 font-light text-lg max-w-sm leading-relaxed">
              Don't worry, even diamonds can sometimes lose their way. We'll help you get back to your collection.
            </p>
          </div>
        </div>

        <div ref={formCardRef} className="w-full max-w-md mx-auto">
          <div className="bg-white/70 backdrop-blur-xl p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 relative overflow-hidden group">
            
            <div className="space-y-8 relative">
              <div className="flex items-center justify-between mb-2">
                <Link href="/login" className="text-gray-400 hover:text-gray-900 transition-colors flex items-center text-[10px] font-gintoNord tracking-wider">
                  <ChevronLeft className="w-4 h-4 mr-1" /> BACK TO LOGIN
                </Link>
                <Link href="/" className="lg:hidden">
                  <Image src={ArdorLogo} alt="Ardor Diamonds" width={100} height={35} className="object-contain" />
                </Link>
              </div>

              {!isSubmitted ? (
                <>
                  <div ref={titleRef} className="space-y-3">
                    <h2 className="text-3xl font-extralight text-gray-900 tracking-tight">Recover Password</h2>
                    <p className="text-gray-500 font-light text-sm">Enter the email associated with your account.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="group/input space-y-2">
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
                    </div>

                    <button
                      ref={buttonRef}
                      onClick={handleSubmit}
                      disabled={isLoading || !email}
                      className="group/btn w-full relative overflow-hidden bg-gray-900 text-white py-5 font-gintoNord text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:bg-gray-800 disabled:opacity-30"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        <span className="inline-flex items-center text-white">
                          Send Reset Link 
                          <ArrowRight className="ml-3 w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1" />
                        </span>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-6 py-4">
                  <div className="w-20 h-20 bg-[#00736C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-10 h-10 text-[#00736C]" />
                  </div>
                  <h3 className="text-2xl font-extralight text-gray-900">Check Your Email</h3>
                  <p className="text-gray-500 font-light text-sm">
                    We've sent a recovery link to <br /><span className="text-gray-900 font-medium">{email}</span>
                  </p>
                  <button onClick={() => setIsSubmitted(false)} className="text-[10px] font-gintoNord tracking-widest text-gray-400 hover:text-gray-900 transition-colors uppercase pt-4">
                    Send again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
