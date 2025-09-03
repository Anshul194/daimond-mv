"use client";

import { useEffect, useRef } from 'react';

export default function VideoHeroSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Force play the video
      videoRef.current.play().catch(error => {
        console.log("Auto-play prevented:", error);
      });
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/ring-making.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-start">
        {/* Main Heading */}
        <h1 className="text-white text-4xl md:text-3xl lg:text-4xl font-light  tracking-wide">
          Your story, our craft.
        </h1>
        
        {/* Call to Action Button */}
        <button className="group flex items-center space-x-3 bg-transparent  text-white px-8 py-3 text-[10px] font-medium tracking-wider uppercase cursor-pointer transition-all duration-300">
          <span>EXPLORE CUSTOM RINGS</span>
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 8l4 4m0 0l-4 4m4-4H3" 
            />
          </svg>
        </button>
      </div>
    </section>
  );
}