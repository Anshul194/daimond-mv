"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import ProcessSection from './ProcessSection';
import StartProcessForm from "./StartProcessform";
import FAQComponent from "./FAQComponent";

// Then add it to your main component:
<ProcessSection />

const SliderBoxTwo = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef(null);

  // Sample categories data with 8 images
  const categories = [
    {
      slug: "engagement-rings",
      image: "/serviceRings/ring-one.webp"
    },
    {
      slug: "wedding-bands",
      image: "/serviceRings/ring-two.webp"
    },
    {
      slug: "diamond-rings",
      image: "/serviceRings/ring-three.webp"
    },
    {
      slug: "gold-jewelry",
      image: "/serviceRings/ring-four.webp"
    },
    {
      slug: "necklaces",
      image: "/serviceRings/ring-five.webp"
    },
    {
      slug: "earrings",
      image: "/serviceRings/ring-six.webp"
    },
    {
      slug: "bracelets",
      image: "/serviceRings/ring-seven.webp"
    },
    {
      slug: "fine-jewelry",
      image: "/serviceRings/ring-eight.webp"
    }
  ];

  // Debounced resize handler for items per view
  const updateItemsPerView = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setItemsPerView(3); // lg: show 3
    } else if (width >= 768) {
      setItemsPerView(2); // md: show 2
    } else {
      setItemsPerView(1); // sm: show 1
    }
  }, []);

  useEffect(() => {
    updateItemsPerView();
    const handleResize = () => {
      // Simple debounce
      let timeout;
      clearTimeout(timeout);
      timeout = setTimeout(updateItemsPerView, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateItemsPerView]);

  const maxSlides = Math.max(0, categories.length - itemsPerView);

  const nextSlide = useCallback(() => {
    if (currentSlide < maxSlides) {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, maxSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  const slideWidth = useMemo(() => 100 / itemsPerView, [itemsPerView]);

  // Mouse drag handlers
  const handleMouseDown = useCallback(
    (e) => {
      setIsDragging(true);
      setStartX(e.pageX - sliderRef.current.offsetLeft);
      setScrollLeft(currentSlide);
      e.preventDefault();
    },
    [currentSlide]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - sliderRef.current.offsetLeft;
      const walk = (x - startX) * 0.5; // Adjust sensitivity
      const newSlide = Math.round(scrollLeft - walk / 100);
      const clampedSlide = Math.max(0, Math.min(maxSlides, newSlide));
      setCurrentSlide(clampedSlide);
    },
    [isDragging, startX, scrollLeft, maxSlides]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback(
    (e) => {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setScrollLeft(currentSlide);
    },
    [currentSlide]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const x = e.touches[0].clientX;
      const walk = (x - startX) * 0.5; // Adjust sensitivity
      const newSlide = Math.round(scrollLeft - walk / 100);
      const clampedSlide = Math.max(0, Math.min(maxSlides, newSlide));
      setCurrentSlide(clampedSlide);
    },
    [isDragging, startX, scrollLeft, maxSlides]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-4">
          Our Portfolio
        </h1>
        <p className="text-gray-600 text-[10px]">
          View our customised design gallery.
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-lg ${
            currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          disabled={currentSlide === maxSlides}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-lg ${
            currentSlide === maxSlides ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div
          ref={sliderRef}
          className={`flex transition-transform duration-500 ease-in-out ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            transform: `translateX(-${currentSlide * slideWidth}%)`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {categories.map((style) => (
            <Link
              key={style.name}
              href={`/${style.slug}`}
              className="flex-shrink-0 px-4"
              style={{ width: `${slideWidth}%` }}
            >
              <div className="group cursor-pointer">
                {/* Ring Image Container */}
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden mb-6 relative transition-transform duration-300 ease-in-out hover:scale-105">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${style.image})`,
                      backgroundPosition: "center center",
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <div className="absolute inset-0">
          <img 
            src="https://cdn.shopify.com/s/files/1/0644/3067/0060/files/ImageBanner_web_2000x2000.png?v=1745460814"
            alt="Wedding rings"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-transparent"></div>
      </div>

      {/* Slider Section */}
      <SliderBoxTwo />

      {/* Our Approach Section */}
      <section className="bg-[#F4F4F4] py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl text-gray-800 mb-8 font-arizona font-light">
            Our Approach
          </h2>
          
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p className="text-md font-arizona font-light">
              An engagement ring is a personal promise of love and commitment. Your design is an expression and symbol of your story.
            </p>
            
            <p className="text-md font-arizona font-light">
              With this in mind, we believe the design process should be a personal one - a collaboration between you and our design team from start to finish.
            </p>
            
            <p className="text-md font-arizona font-light">
              Consultations are complimentary and there are never any customisation fees. Our engagement ring specialists work with you to bring your piece to life.
            </p>
          </div>
        </div>
      </section>

    {/* YouTube Video Section */}
    <section className="w-full h-screen flex items-center justify-center bg-black">
        <div className="w-full h-full">
            <iframe src="https://www.youtube.com/embed/r7P08zf1h4w" title="Your Story, Our Craft." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" class="svelte-1g2jw83" className="!h-full !w-full"></iframe>
        </div>
    </section>

    <ProcessSection />
    <StartProcessForm />

     <section className="py-16 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-800 mb-4 font-arizona font-light">
            Expert Guidance
          </h2>
          <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-6"></div>
          <p className="text-gray-600 text-sm font-arizona font-light">
            Empowering you with insights for selecting and acquiring the ideal ring.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group cursor-pointer">
            <div className="aspect-[2/2] bg-gray-100 overflow-hidden mb-6 relative">
              <img
                src="/serviceRings/ring-one.webp"
                alt="Custom engagement ring with pink stones"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-800 font-arizona tracking-wide uppercase">
                HOW MUCH DOES IT COST TO MAKE A CUSTOM ENGAGEMENT RING
              </h3>
              <svg
                className="w-5 h-5 text-gray-600 ml-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group cursor-pointer">
            <div className="aspect-[2/2] bg-gray-100 overflow-hidden mb-6 relative">
              <img
                src="/serviceRings/ring-two.webp"
                alt="Custom wedding bands"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-800 font-arizona tracking-wide uppercase">
                OUR FAVOURITE WAYS TO CUSTOMISE MEN&apos;S WEDDING BANDS
              </h3>
              <svg
                className="w-5 h-5 text-gray-600 ml-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group cursor-pointer">
            <div className="aspect-[2/2] bg-gray-100 overflow-hidden mb-6 relative">
              <img
                src="/serviceRings/ring-three.webp"
                alt="Custom engagement ring design process"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-800 font-arizona tracking-wide uppercase">
                THE CUSTOM ENGAGEMENT RING DESIGN PROCESS
              </h3>
              <svg
                className="w-5 h-5 text-gray-600 ml-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
    <FAQComponent/>
    </div>
  );
};

export default Page;