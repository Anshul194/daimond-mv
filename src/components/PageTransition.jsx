"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition() {
  const curtainRef = useRef(null);
  const diamondRef = useRef(null);
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    // Reset visibility if path changes but we weren't animating
    if (!isAnimating.current) {
      gsap.set(curtainRef.current, { yPercent: -100 });
      return;
    }

    let revealed = false;
    const revealPage = () => {
      if (revealed) return;
      revealed = true;
      
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating.current = false;
            // Hide diamond after transition
            gsap.set(diamondRef.current, { opacity: 0 });
          },
        });

        tl.to(curtainRef.current, {
          yPercent: 100,
          duration: 0.75,
          ease: "expo.inOut",
        });
      });
    };

    // Wait for the page to signal it's ready, or timeout after 1.5s for static pages
    const timeoutId = setTimeout(revealPage, 1500);
    
    const handleDataReady = () => {
      clearTimeout(timeoutId);
      // Give a tiny buffer for the DOM to settle
      setTimeout(revealPage, 100);
    };

    window.addEventListener("__page-data-ready", handleDataReady);
    
    // Add a pulsing scale to the diamond while waiting
    gsap.to(diamondRef.current, {
      scale: 1.2,
      opacity: 1,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    return () => {
      window.removeEventListener("__page-data-ready", handleDataReady);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  // On link click — we need to cover the page BEFORE navigation starts.
  // We do this by listening for Next.js router events via a custom event
  // fired from usePageTransitionTrigger (see below in the hook).
  useEffect(() => {
    const handleStart = () => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          curtainRef.current,
          { yPercent: -100 },
          { yPercent: 0, duration: 0.55, ease: "expo.inOut" }
        );
        
        // Ensure diamond is visible and spinning during enter
        gsap.fromTo(diamondRef.current, 
          { rotation: 0, scale: 0.8, opacity: 0 },
          { rotation: 360, scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
      });
    };

    window.addEventListener("__page-transition-start", handleStart);
    return () =>
      window.removeEventListener("__page-transition-start", handleStart);
  }, []);

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translateY(-100%)",
        pointerEvents: "none",
      }}
    >
      {/* Animated diamond spinner */}
      <div ref={diamondRef} style={{ opacity: 0 }}>
        <svg
          width="50"
          height="50"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="32,4 60,24 32,60 4,24"
            fill="none"
            stroke="#00736C"
            strokeWidth="1.5"
          />
          <polygon
            points="32,4 60,24 32,32 4,24"
            fill="rgba(0,115,108,0.2)"
            stroke="#00736C"
            strokeWidth="0.8"
            opacity="0.8"
          />
          <line
            x1="4"
            y1="24"
            x2="60"
            y2="24"
            stroke="#00736C"
            strokeWidth="0.8"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Thin accent line at bottom of curtain */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(to right, transparent, #00736C, transparent)",
        }}
      />
    </div>
  );
}
