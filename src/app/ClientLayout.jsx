'use client';

import { useEffect, useState } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import Footer from "@/components/Footer";
import Navbar from "../components/Navbar";
import PageLoader from "../components/PageLoader";
import PageTransition from "../components/PageTransition";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Bridge component: runs inside ReactLenis context, feeds scroll to ScrollTrigger
function LenisScrollTriggerBridge() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function ClientLayout({ children }) {
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    gsap.config({ nullTargetWarn: false });
    // Already visited this session → skip loader wait
    if (sessionStorage.getItem("__loader_done")) {
      setLoaderDone(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    setLoaderDone(true);
    ScrollTrigger.refresh();
  };

  return (
    <>
      {/* ── Initial page loader (plays once per session) ── */}
      <PageLoader onComplete={handleLoaderComplete} />

      {/* ── Route-change transition curtain ── */}
      <PageTransition />

      {/* ── Main app shell ── */}
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
        <LenisScrollTriggerBridge />
        <Navbar />
        <main
          style={{
            opacity: loaderDone ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {children}
        </main>
        <Footer />
      </ReactLenis>
    </>
  );
}
