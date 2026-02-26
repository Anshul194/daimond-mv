"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function PageLoader({ onComplete }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const diamondRef = useRef(null);
  const lineTopRef = useRef(null);
  const lineBotRef = useRef(null);
  const progressRef = useRef(null);
  const progressBarRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Skip loader if user already visited (session-based)
    if (sessionStorage.getItem("__loader_done")) {
      setVisible(false);
      onComplete?.();
      return;
    }

    // Lock scroll while loading
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("__loader_done", "1");
          document.body.style.overflow = "";
          setVisible(false);
          onComplete?.();
        },
      });

      // Initial state
      gsap.set([logoRef.current, lineTopRef.current, lineBotRef.current], {
        opacity: 0,
      });
      gsap.set(diamondRef.current, { scale: 0, rotation: 45, opacity: 0 });
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left center" });

      // 1. Diamond pops in and rotates
      tl.to(diamondRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.4)",
      })
        // 2. Lines wipe in
        .to(
          [lineTopRef.current, lineBotRef.current],
          { opacity: 1, scaleX: 1, duration: 0.5, ease: "power3.out" },
          "-=0.3"
        )
        // 3. Logo text fades up
        .to(
          logoRef.current,
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
          "-=0.2"
        )
        // 4. Diamond subtle pulse loop x2
        .to(diamondRef.current, {
          scale: 1.08,
          duration: 0.35,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 3,
        })
        // 5. Progress bar fills
        .to(progressBarRef.current, {
          scaleX: 1,
          duration: 1.1,
          ease: "power1.inOut",
        })
        // 6. Whole overlay slides UP and out
        .to(
          overlayRef.current,
          {
            yPercent: -100,
            duration: 0.85,
            ease: "expo.inOut",
          },
          "+=0.15"
        );
    });

    return () => ctx.revert();
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
      }}
    >
      {/* Decorative top line */}
      <div
        ref={lineTopRef}
        style={{
          width: "120px",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, #00736C, transparent)",
          transform: "scaleX(0)",
          transformOrigin: "center",
          opacity: 0,
        }}
      />

      {/* Diamond SVG */}
      <svg
        ref={diamondRef}
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0 }}
      >
        {/* Outer diamond shape */}
        <polygon
          points="32,4 60,24 32,60 4,24"
          fill="none"
          stroke="#00736C"
          strokeWidth="1.5"
        />
        {/* Inner facet lines */}
        <polygon
          points="32,4 60,24 32,32 4,24"
          fill="rgba(0,115,108,0.15)"
          stroke="#00736C"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <polygon
          points="32,32 60,24 32,60 4,24"
          fill="rgba(0,115,108,0.08)"
          stroke="#00736C"
          strokeWidth="0.8"
          opacity="0.5"
        />
        <line x1="4" y1="24" x2="60" y2="24" stroke="#00736C" strokeWidth="0.8" opacity="0.6" />
        <line x1="32" y1="4" x2="32" y2="60" stroke="#00736C" strokeWidth="0.6" opacity="0.4" />
      </svg>

      {/* Brand wordmark */}
      <div
        ref={logoRef}
        style={{
          fontFamily: "'CullenGinto-Nord', serif",
          fontSize: "13px",
          letterSpacing: "0.4em",
          color: "#00736C",
          textTransform: "uppercase",
          opacity: 0,
          transform: "translateY(10px)",
        }}
      >
        Diamond
      </div>

      {/* Bottom line */}
      <div
        ref={lineBotRef}
        style={{
          width: "120px",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, #00736C, transparent)",
          transform: "scaleX(0)",
          transformOrigin: "center",
          opacity: 0,
        }}
      />

      {/* Progress bar */}
      <div
        ref={progressRef}
        style={{
          position: "absolute",
          bottom: "48px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "1px",
          background: "rgba(0,0,0,0.1)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, #00736C, #00b5aa)",
            transform: "scaleX(0)",
            transformOrigin: "left center",
            borderRadius: "999px",
          }}
        />
      </div>

      {/* Ambient corner dots */}
      {[
        { top: "24px", left: "24px" },
        { top: "24px", right: "24px" },
        { bottom: "24px", left: "24px" },
        { bottom: "24px", right: "24px" },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#00736C",
            opacity: 0.3,
            ...pos,
          }}
        />
      ))}
    </div>
  );
}
