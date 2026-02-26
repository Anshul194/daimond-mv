'use client';

import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import Footer from "@/components/Footer";
import Navbar from "../components/Navbar";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Bridge component: runs inside ReactLenis context, feeds scroll to ScrollTrigger
function LenisScrollTriggerBridge() {
  useLenis((lenis) => {
    ScrollTrigger.update();
  });
  return null;
}

export default function ClientLayout({ children }) {
  useEffect(() => {
    gsap.config({ nullTargetWarn: false });
    // After hydration, recalculate all trigger positions
    ScrollTrigger.refresh();
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <LenisScrollTriggerBridge />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </ReactLenis>
  );
}
