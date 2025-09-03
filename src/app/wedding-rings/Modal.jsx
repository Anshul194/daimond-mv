"use client";

import React, { useState } from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  title = null,
  size = "medium",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
  productData = null, // New prop for product-specific modal
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({
    bandWidth: "1.8mm",
    meleeStones: "Moissanite",
    metalType: "18k Yellow Gold",
    ringSize: "",
  });

  // Don't render if not open
  if (!isOpen) return null;

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  // React.useEffect(() => {
  //   const handleEscape = (e) => {
  //     if (e.key === 'Escape') {
  //       onClose();
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener('keydown', handleEscape);
  //     document.body.style.overflow = 'hidden';
  //   }

  //   return () => {
  //     document.removeEventListener('keydown', handleEscape);
  //     document.body.style.overflow = 'unset';
  //   };
  // }, [isOpen, onClose]);

  // Sample product images for demonstration
  const productImages = [
    { type: "main", thumb: true },
    { type: "video", thumb: true },
    { type: "variant1", thumb: true },
    { type: "variant2", thumb: true },
    { type: "variant3", thumb: true },
    { type: "variant4", thumb: true },
    { type: "lifestyle1", thumb: true },
    { type: "lifestyle2", thumb: true },
    { type: "lifestyle3", thumb: true },
    { type: "lifestyle4", thumb: true },
  ];

  const handleOptionChange = (option, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  // If productData is provided, render product modal
  if (productData) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Dark background overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleOverlayClick}
        />

        {/* Modal content - Full screen on mobile, large on desktop */}
        <div className="relative w-full h-full md:w-[90vw] md:h-[90vh] md:mx-auto md:my-[5vh] bg-white md:rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#346441] text-white p-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
              BACK TO RINGS
            </button>

            <div className="flex items-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Left side - Images */}
            <div className="w-full md:w-1/2 p-6 bg-gray-50">
              {/* Google Reviews */}
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">9727 reviews</span>
              </div>

              {/* Main product image */}
              <div className="bg-white rounded-lg mb-4 aspect-square flex items-center justify-center relative">
                <div className="w-64 h-64 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center">
                  <div className="w-48 h-48 border-8 border-yellow-400 rounded-full bg-white/50 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full border-4 border-yellow-500"></div>
                  </div>
                </div>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === 0 ? "bg-gray-800" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail gallery */}
              <div className="grid grid-cols-6 gap-2">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`aspect-square bg-white rounded border-2 cursor-pointer hover:border-gray-400 transition-colors ${
                      index === 0 ? "border-gray-800" : "border-gray-200"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    {index === 1 ? (
                      // Video thumbnail
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded relative">
                        <svg
                          className="w-6 h-6 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    ) : (
                      // Ring thumbnail
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-yellow-400 rounded-full bg-white/50"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Product details */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto">
              <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-2">
                {productData.name} – Two Third Pavé Wedding Ring
              </h1>

              <div className="text-xl font-medium text-gray-800 mb-4">
                {productData.price}
              </div>

              <p className="text-gray-600 mb-8">
                {productData.name} is an exquisite pavé wedding ring with round
                cut stones extending along two thirds of the band.
              </p>

              {/* Step One */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium">
                    STEP ONE
                  </span>
                </div>

                <h2 className="text-xl mb-2">
                  Ring. <span className="text-gray-500">Make It Yours.</span>
                </h2>

                <p className="text-gray-600 mb-6">
                  Select a precious metal, melee stones, band width and the ring
                  size, if known.
                </p>

                {/* Band Width */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="font-medium text-gray-700">
                      BAND WIDTH
                    </label>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                    value={selectedOptions.bandWidth}
                    onChange={(e) =>
                      handleOptionChange("bandWidth", e.target.value)
                    }
                  >
                    <option value="1.8mm">1.8mm</option>
                    <option value="2.0mm">2.0mm</option>
                    <option value="2.2mm">2.2mm</option>
                  </select>
                </div>

                {/* Melee Stones */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="font-medium text-gray-700">
                      MELEE STONES
                    </label>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                    value={selectedOptions.meleeStones}
                    onChange={(e) =>
                      handleOptionChange("meleeStones", e.target.value)
                    }
                  >
                    <option value="Moissanite">Moissanite</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Lab Diamond">Lab Diamond</option>
                  </select>
                </div>

                {/* Metal Type */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="font-medium text-gray-700">
                      METAL TYPE
                    </label>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                    value={selectedOptions.metalType}
                    onChange={(e) =>
                      handleOptionChange("metalType", e.target.value)
                    }
                  >
                    <option value="18k Yellow Gold">18k Yellow Gold</option>
                    <option value="18k White Gold">18k White Gold</option>
                    <option value="18k Rose Gold">18k Rose Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>

                {/* Ring Size */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="font-medium text-gray-700">
                      RING SIZE
                    </label>
                    <span className="text-red-500">*</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md bg-white text-red-500"
                    value={selectedOptions.ringSize}
                    onChange={(e) =>
                      handleOptionChange("ringSize", e.target.value)
                    }
                  >
                    <option value="">Select a ring size</option>
                    <option value="5">5</option>
                    <option value="5.5">5.5</option>
                    <option value="6">6</option>
                    <option value="6.5">6.5</option>
                    <option value="7">7</option>
                    <option value="7.5">7.5</option>
                    <option value="8">8</option>
                  </select>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="help-select"
                      className="rounded"
                    />
                    <label
                      htmlFor="help-select"
                      className="text-sm text-gray-600"
                    >
                      Help me to select later
                    </label>
                  </div>
                </div>

                {/* Resizing info */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">RESIZING</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    This ring can be resized up to 2.5 sizes up or 2 sizes down
                    (once made in your selected size)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default modal layout (original)
  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-2xl",
    full: "max-w-full mx-4",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleOverlayClick}
      />

      <div
        className={`
        relative bg-white rounded-lg shadow-xl transform transition-all duration-300
        ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden
        ${className}
      `}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            )}

            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="p-4 overflow-y-auto max-h-full">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
