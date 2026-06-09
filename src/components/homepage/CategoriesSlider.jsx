"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice"; // Adjust path as needed
import Link from "next/link";

const SliderBoxTwo = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const dispatch = useDispatch();
  const {
    data: categories = [],
    status,
    error,
  } = useSelector((state) => state.category);
  {
    {
      console.log(categories);
    }
  }

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

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
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateItemsPerView, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [updateItemsPerView]);

  const maxSlides = Math.max(0, categories.length - itemsPerView);

  // Autoplay: advance slides automatically, pause on hover or drag
  useEffect(() => {
    if (maxSlides <= 0) return;
    if (isPaused || isDragging) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, isDragging, maxSlides]);

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
          Shop By Category
        </h1>
        <p className="text-gray-600 text-[10px]">
          {status === "failed"
            ? typeof error === "string"
              ? error
              : error?.message || "An unknown error occurred"
            : "Explore engagement rings, women's wedding rings, men's wedding rings, and fine jewellery."}
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div
          ref={sliderRef}
          className={`flex transition-transform duration-500 ease-in-out ${isDragging ? "cursor-grabbing" : "cursor-grab"
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
          {status === "loading"
            ? Array.from({ length: itemsPerView }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${slideWidth}%` }}
                >
                  <div className="group cursor-pointer">
                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-6 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))
            : categories.length > 0
              ? categories.map((style) => (
                  <Link
                    key={style.name}
                    href={`/${style.slug}`}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${slideWidth}%` }}
                  >
                    <div className="group cursor-pointer">
                      <div className="aspect-[4/5] bg-gray-50 overflow-hidden mb-6 relative transition-transform duration-300 ease-in-out hover:scale-105">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${style.image})`,
                            backgroundPosition: "center center",
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-start gap-4">
                        <h3 className="text-[10px] font-semibold text-gray-900 font-gintoNord tracking-wide uppercase">
                          {style.name}
                        </h3>
                        <svg
                          className="w-5 h-4 text-gray-600 group-hover:translate-x-1 transition-transform duration-300"
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
                          <line
                            x1="0"
                            y1="12"
                            x2="15"
                            y2="12"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))
              : Array.from({ length: itemsPerView }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${slideWidth}%` }}
                  >
                    <div className="group cursor-pointer">
                      <div className="aspect-[4/5] bg-gray-50 overflow-hidden mb-6 relative" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
        </div>

        {!(status === "loading" || status === "failed") && categories.length > 0 && currentSlide < maxSlides && (
          <button
            onClick={nextSlide}
            className="absolute right-5 top-2/4 transform -translate-y-2/3 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 z-10"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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
        )}

        {!(status === "loading" || status === "failed") && categories.length > 0 && currentSlide > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-5 top-2/4 transform -translate-y-2/3 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 z-10"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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
        )}
      </div>
    </div>
  );
};

export default SliderBoxTwo;
