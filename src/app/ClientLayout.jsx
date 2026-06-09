'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ReactLenis, useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = dynamic(() => import("@/components/Navbar"));
const Footer = dynamic(() => import("@/components/Footer"));
const PageLoader = dynamic(() => import("@/components/PageLoader"), { ssr: false });
const PageTransition = dynamic(() => import("@/components/PageTransition"), { ssr: false });
const ToastContainer = dynamic(() => import("react-toastify").then(m => m.ToastContainer), { ssr: false });

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
      <PageLoader onComplete={handleLoaderComplete} />
      <PageTransition />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true, wheelMultiplier: 0.8 }}>
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
