"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition() {
  const curtainRef = useRef(null);
  const diamondRef = useRef(null);
  const pathname = usePathname();
  const timeoutRef = useRef(null);
  const animatingRef = useRef(false);

  // Hide curtain on pathname change (navigation completed)
  useEffect(() => {
    if (!animatingRef.current) return;
    animatingRef.current = false;

    clearTimeout(timeoutRef.current);

    const ctx = gsap.context(() => {
      gsap.to(curtainRef.current, {
        yPercent: -100,
        duration: 0.5,
        ease: "expo.inOut",
        onComplete: () => gsap.set(diamondRef.current, { opacity: 0 }),
      });
    });

    return () => ctx.revert();
  }, [pathname]);

  // Show curtain on transition start
  useEffect(() => {
    const handleStart = () => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          curtainRef.current,
          { yPercent: -100 },
          { yPercent: 0, duration: 0.4, ease: "expo.inOut" }
        );
        gsap.fromTo(diamondRef.current,
          { rotation: 0, scale: 0.8, opacity: 0 },
          { rotation: 360, scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
        );
      });
    };

    window.addEventListener("__page-transition-start", handleStart);
    return () => window.removeEventListener("__page-transition-start", handleStart);
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
      <div ref={diamondRef} style={{ opacity: 0 }}>
        <svg width="50" height="50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="32,4 60,24 32,60 4,24" fill="none" stroke="#00736C" strokeWidth="1.5" />
          <polygon points="32,4 60,24 32,32 4,24" fill="rgba(0,115,108,0.2)" stroke="#00736C" strokeWidth="0.8" opacity="0.8" />
          <line x1="4" y1="24" x2="60" y2="24" stroke="#00736C" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}
