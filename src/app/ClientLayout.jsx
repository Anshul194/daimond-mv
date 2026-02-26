'use client';

import { useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import Footer from "@/components/Footer";
import Navbar from "../components/Navbar";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ClientLayout({ children }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Global GSAP defaults
    gsap.config({
      nullTargetWarn: false,
    });
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </ReactLenis>
  );
}
