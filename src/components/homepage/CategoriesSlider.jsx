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

  const dispatch = useDispatch();
  const {
    data: categories,
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

  // Render loading or error state
  if (status === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-4">
          Shop By Category
        </h1>
        <p className="text-gray-600 text-[10px]">
          Explore engagement rings, women's wedding rings, men's wedding rings,
          and fine jewellery.
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden">
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
          onMouseUp={handleMouseUp} // Fixed typo from handleMouseUap
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

                {/* Style Name */}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderBoxTwo;
