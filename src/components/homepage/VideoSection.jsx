"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '../TransitionLink';

gsap.registerPlugin(ScrollTrigger);

export default function VideoHeroSection() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Auto-play prevented:", error);
      });
    }

    const ctx = gsap.context(() => {
      // Scroll-driven: slide up from Y + expand 80% → 100%, rounded → square
      gsap.fromTo(
        wrapperRef.current,
        { width: '80%', borderRadius: '24px', y: 120 },
        {
          width: '100%',
          borderRadius: '0px',
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'center center',
            scrub: 1.2,
          },
        }
      );

      // Parallax effect for video
      gsap.fromTo(
        videoRef.current,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // Text reveal
      gsap.fromTo(
        textRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-visible"
    >
      {/* Expanding wrapper */}
      <div
        ref={wrapperRef}
        className="relative overflow-hidden h-full"
        style={{ width: '80%', borderRadius: '24px' }}
      >
        {/* Video Background */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-110"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/ring-making.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Content Container */}
        <div
          ref={textRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center"
        >
          <h2 className="text-white text-4xl md:text-5xl lg:text-7xl !text-white font-arizona tracking-wide mb-8 leading-tight">
            Your story, <span className="italic">our craft.</span>
          </h2>

          <TransitionLink
            href="/custom-made-engagement-rings"
            className="group flex items-center space-x-4 bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 text-xs font-medium tracking-[0.2em] uppercase cursor-pointer hover:bg-white hover:text-[#00736C] transition-all duration-500 rounded-sm"
          >
            <span>EXPLORE CUSTOM RINGS</span>
            <svg
              className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}