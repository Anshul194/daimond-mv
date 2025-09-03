"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const RingsGrid = ({
  rings,
  onRingClick,
  pagination,
  currentPage,
  onPageChange,
}) => {
  const [hoveredRing, setHoveredRing] = useState(null);
  const [imageIndices, setImageIndices] = useState({});
  const pathname = usePathname();
  // Get slider images (excluding cover image)
  const getSliderImages = (ringIndex) => {
    return rings?.[ringIndex]?.image?.slice(1) || []; // Remove first image (cover)
  };

  // Get current image index for a specific ring
  const getCurrentImageIndex = (ringIndex) => {
    return imageIndices?.[ringIndex] || 0;
  };

  // Update image index for a specific ring
  const updateImageIndex = (ringIndex, newIndex) => {
    setImageIndices((prev) => ({
      ...prev,
      [ringIndex]: newIndex,
    }));
  };

  // Handle image navigation
  const handlePrevImage = (e, ringIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const sliderImages = getSliderImages(ringIndex);
    const currentIndex = getCurrentImageIndex(ringIndex);
    const newIndex =
      currentIndex === 0 ? sliderImages.length - 1 : currentIndex - 1;
    updateImageIndex(ringIndex, newIndex);
  };

  const handleNextImage = (e, ringIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const sliderImages = getSliderImages(ringIndex);
    const currentIndex = getCurrentImageIndex(ringIndex);
    const newIndex =
      currentIndex === sliderImages.length - 1 ? 0 : currentIndex + 1;
    updateImageIndex(ringIndex, newIndex);
  };

  // Enhanced hover handlers with smooth transition
  const handleMouseEnter = (index) => {
    setHoveredRing(index);
    // Start from first slider image when hovering
    updateImageIndex(index, 0);
  };

  const handleMouseLeave = () => {
    setHoveredRing(null);
    // Reset all image indices when leaving hover
    setImageIndices({});
  };

  const handleRingClick = (ring, index) => {
    onRingClick(ring, index);
  };

  return (
    <div className="max-w-full 2xl:max-w-[1700px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 space-y-4 mb-12">
        {rings?.map((ring, index) => (
          <Link
            href={
              pathname.includes("new-arrivals")
                ? `${ring?.category_id?.slug}/${ring.slug}`
                : `${pathname}/${ring.slug}`
            }
            key={index}
          >
            <div
              className="bg-white rounded-lg cursor-pointer transition-shadow duration-200"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave()}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center mb-4 relative overflow-hidden">
                {/* Image with smooth transition */}
                <img
                  src={
                    hoveredRing === index
                      ? getSliderImages(index)?.[getCurrentImageIndex(index)]
                      : ring?.image?.[0]
                  }
                  alt={ring?.name}
                  className="w-full h-full object-cover transition-all duration-500 ease-in-out transform"
                  style={{
                    opacity: hoveredRing === index ? 1 : 1,
                    transform:
                      hoveredRing === index ? "scale(1.05)" : "scale(1)",
                  }}
                />

                {/* Slider controls - only show when hovered with smooth fade in */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    hoveredRing === index
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <button
                    className="absolute cursor-pointer left-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 transition-all duration-200 hover:scale-110"
                    onClick={(e) => handlePrevImage(e, index)}
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
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

                  <button
                    className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2  transition-all duration-200 hover:scale-110"
                    onClick={(e) => handleNextImage(e, index)}
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
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

                  {/* Image indicators with smooth animation */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {getSliderImages(index)?.map((_, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          getCurrentImageIndex(index) === imgIndex
                            ? "bg-white scale-125"
                            : "bg-white/50 scale-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="py-0 px-4 text-center">
                <h3 className="font-medium text-gray-800 text-lg font-arizona tracking-wide">
                  {ring.name}
                </h3>
                <p className="text-[10px] font-gintoNormal text-gray-600 ">
                  {ring.price}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {currentPage < pagination?.totalPages &&
        !pathname.includes("new-arrivals") && (
          <div className="flex justify-center mb-12">
            {" "}
            <button
              className="w-fit px-8 bg-[#236339] mx-auto text-white py-3  font-medium transition-all duration-300 hover:bg-gray-800"
              onClick={onPageChange}
            >
              Load More
            </button>
          </div>
        )}

      <div className="text-center">
        <div className="max-w-2xl text-black opacity-75 mx-auto pt-16">
          <div className="w-[120px] border-t-3 border-gray-900 mx-auto"></div>
          <p className="text-[10px] font-semibold text-center mb-3 pt-3">
            Cullen Jewellery offers the perfect range of engagement rings to
            complement your style. Our team can guide you through choosing the
            perfect platinum engagement ring with lab grown diamonds, moissanite
            or lab grown sapphires, along with classic options like sleek
            solitaires, alternative settings or halo designs, ensuring you find
            the perfect symbol of your love and commitment.
          </p>
          <p className="text-[10px] font-semibold text-center">
            Need help choosing your perfect engagement ring? Book a virtual or
            in-person appointment at our showroom to talk to one of our friendly
            engagement ring specialists.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RingsGrid;
