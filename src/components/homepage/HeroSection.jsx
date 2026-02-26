import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";

const HeroSection = () => {
  const [banners, setBanners] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const heroRef = useRef(null);
  const textRef = useRef(null);
  const leftImageRef = useRef(null);
  const rightImageRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banner?status=active');
        const data = await response.json();
        if (data.success && data.data.docs.length > 0) {
          setBanners(data.data.docs);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out", duration: 2.5 }
      });

      // Split Screen Luxury Reveal
      tl.fromTo(leftImageRef.current,
        { scale: 1.4, xPercent: -10, filter: "blur(10px)" },
        { scale: 1.05, xPercent: 0, filter: "blur(0px)", duration: 3 }
      );

      if (rightImageRef.current) {
        tl.fromTo(rightImageRef.current,
          { scale: 1.4, xPercent: 10, filter: "blur(10px)" },
          { scale: 1, xPercent: 0, filter: "blur(0px)", duration: 3 },
          "<"
        );
      }

      // Staggered luxury text reveal with skew
      tl.fromTo(".reveal-content > *",
        { y: 100, opacity: 0, skewY: 5 },
        { y: 0, opacity: 1, skewY: 0, stagger: 0.2, duration: 1.8, ease: "power4.out" },
        "-=2.2"
      );

      // Subtle mouse-tracking parallax for PC
      const handleMouseMove = (e) => {
        if (window.innerWidth < 1024) return;

        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to(leftImageRef.current, {
          x: xPos,
          y: yPos,
          duration: 1.5,
          ease: "power2.out"
        });

        if (rightImageRef.current) {
          gsap.to(rightImageRef.current, {
            x: -xPos * 0.8,
            y: -yPos * 0.8,
            duration: 1.5,
            ease: "power2.out"
          });
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  if (loading) return <div className="w-full h-[85vh] lg:h-[90vh] bg-black/5 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-[#00736C] border-t-transparent rounded-full animate-spin"></div>
  </div>;

  const currentBanner = banners.length > 0 ? banners[0] : {
    title: "Make a <br /> <span class=\"italic\">statement.</span>",
    subtitle: "Exquisite engagement rings crafted for your forever.",
    image: "/images/left-banner.webp",
    rightImage: "/images/right-banner.webp",
    label: "9,642 Trusted Reviews",
    buttonPrimaryText: "EXPLORE ENGAGEMENT",
    buttonPrimaryLink: "/engagement-rings/build-ring",
    buttonSecondaryText: "JEWELRY",
    buttonSecondaryLink: "/shop-all-jewelry"
  };

  return (
    <div ref={heroRef} className="w-full h-[85vh] lg:h-[90vh] flex overflow-hidden">
      {/* Left Panel - Main Hero */}
      <div className="relative w-full lg:w-1/2 overflow-hidden h-full">
        {/* Background Image */}
        <div ref={leftImageRef} className="absolute inset-0 w-full h-full">
          <Image
            src={currentBanner.image}
            alt="Engagement Ring Hero"
            fill
            className="object-cover scale-105"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-center h-full px-8 md:px-12 lg:px-20 max-w-2xl bg-gradient-to-r from-black/50 to-transparent reveal-content">

          <div className="mb-6">
            {/* Google Reviews Badge - Static */}
            <div className="mb-6 inline-block">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-white/90">
                    9,642 Trusted Reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Main Heading - Static */}
            <h1
              className="text-4xl md:text-5xl lg:text-7xl !font-light font-arizona !text-white leading-[1.1] mb-4 drop-shadow-lg"
            >
              Make a <br /> <span className="italic">statement.</span>
            </h1>

            {/* Subheading - Static */}
            <p className="text-lg md:text-xl !text-white/90 font-gintoNormal max-w-sm font-light leading-relaxed drop-shadow-md">
              Exquisite engagement rings crafted for your forever.
            </p>
          </div>

          {/* CTA Buttons - Static */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/engagement-rings/build-ring">
              <button className="bg-[#00736C] w-full !h-[65px] sm:w-[200px] hover:bg-[#005F5B] text-white py-4 px-8 text-xs font-semibold tracking-widest transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl uppercase">
                EXPLORE ENGAGEMENT
              </button>
            </Link>
            <Link href="/shop-all-jewelry">
              <button className="border !h-[65px] border-white/50 backdrop-blur-sm w-full sm:w-[150px] hover:bg-white/10 text-white py-4 px-8 text-xs font-semibold tracking-widest transition-all duration-300 transform hover:translate-y-[-2px] uppercase">
                JEWELRY
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Ring Collection */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden h-full">
        {/* Background Image */}
        <div ref={rightImageRef} className="absolute inset-0 w-full h-full">
          <Image
            src={currentBanner.rightImage || "/images/right-banner.webp"}
            alt="Ring Collection"
            fill
            className="object-cover"
          />
          {/* Subtle overlay to blend */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
