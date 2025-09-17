"use client";

import {
  fetchBlogCategories,
  fetchSubCategoriesByCategoryId,
} from "@/store/slices/blogCategory";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Education = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef(null);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  // const ringStyles = [
  //   {
  //     name: "ENGAGEMENT RING ADVICE",
  //     image: "/images/home-slide-one/one.webp",
  //   },
  //   {
  //     name: "LAB GROWN DIAMOND ADVICE",
  //     image: "/images/home-slide-one/two.webp",
  //   },
  //   {
  //     name: "MOISSANITE ADVICE",
  //     image: "/images/home-slide-one/three.jpg",
  //   },
  // ];

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3); // lg: show 3
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2); // md: show 2
      } else {
        setItemsPerView(1); // sm: show 1
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxSlides = Math.max(0, data.length - itemsPerView);

  const nextSlide = () => {
    if (currentSlide < maxSlides) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const slideWidth = 100 / itemsPerView;

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(currentSlide);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 0.5; // Adjust sensitivity
    const newSlide = Math.round(scrollLeft - walk / 100);
    const clampedSlide = Math.max(0, Math.min(maxSlides, newSlide));
    setCurrentSlide(clampedSlide);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setScrollLeft(currentSlide);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].clientX;
    const walk = (x - startX) * 0.5; // Adjust sensitivity
    const newSlide = Math.round(scrollLeft - walk / 100);
    const clampedSlide = Math.max(0, Math.min(maxSlides, newSlide));
    setCurrentSlide(clampedSlide);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          fetchSubCategoriesByCategoryId("6878cbb596dfc8337a3359b4")
        );
        if (response.payload && Array.isArray(response.payload.data)) {
          setData(response.payload.data.reverse());
        } else if (Array.isArray(response.payload)) {
          setData(response.payload.reverse());
        } else {
          console.error("No data found in response:", response);
        }
      } catch (error) {
        console.error("Error fetching blog categories:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  console.log("Education data:", data);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 ">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-4">
          Education
        </h1>
        <p className="text-gray-600 text-[10px]">
          We provide industry-leading guidance on fine jewellery and in-depth
          education for lab grown diamonds and moissanite stones, along with the
          anatomy of an engagement ring.
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
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {data.map((style, index) => (
            <Link
              href={`/blogs/${style.BlogCategory._id}/${style._id}`}
              key={style._id}
              className="flex-shrink-0 px-2"
              style={{ width: `${slideWidth}%` }}
            >
              <div className="group cursor-pointer">
                {/* Ring Image Container */}
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden mb-6 relative transition-transform duration-300 ease-in-out hover:scale-[1.03]">
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
                  <h3 className="text-[10px] font-semibold font-gintoNord text-gray-900 tracking-wide uppercase">
                    {style.name}
                  </h3>
                  <svg
                    className="w-5 h-4 text-gray-600 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Arrow with tail */}
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

export default Education;
