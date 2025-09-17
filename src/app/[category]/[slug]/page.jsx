"use client";

import React, { useEffect, useState, useRef } from "react";

import Link from "next/link";
import Difference from "@/components/modal/Difference";
import Features from "@/components/modal/Features";
import ModalReviews from "@/components/modal/ModalReviews";
import ModalCertified from "@/components/modal/ModalCertified";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/axiosConfig/axiosInstance";
import { useParams } from "next/navigation";
import StepOne from "@/components/modal/StepOne";
import StepTwo from "@/components/modal/StepTwo";
import StepThree from "@/components/modal/StepThree";
import StepFour from "@/components/modal/StepFour";
import { addCart, fetchCart } from "@/store/slices/cart";
import md5 from "md5";
import { clearState, resetData } from "@/store/slices/product";
import { fetchSizes } from "@/store/slices/size";
import { toast } from "react-toastify";
import { ArrowLeft, ChevronDown } from "lucide-react";

const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
// Image Slider Component
const ImageSlider = ({ images, currentIndex, onIndexChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    onIndexChange((currentIndex + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    onIndexChange((currentIndex - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleDragStart = (clientX) => {
    if (isAnimating) return;
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || isAnimating) return;
    const offset = clientX - dragStart;
    const maxOffset = 100;
    const limitedOffset = Math.max(-maxOffset, Math.min(maxOffset, offset));
    setDragOffset(limitedOffset);
  };

  const handleDragEnd = () => {
    if (!isDragging || isAnimating) return;
    const threshold = 50;

    if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  };
  const handleTouchEnd = () => handleDragEnd();
  const handleMouseDown = (e) => handleDragStart(e.clientX);
  const handleMouseMove = (e) => handleDragMove(e.clientX);
  const handleMouseUp = () => handleDragEnd();
  const handleMouseLeave = () => handleDragEnd();

  const getPrevIndex = () => (currentIndex - 1 + images.length) % images.length;
  const getNextIndex = () => (currentIndex + 1) % images.length;

  return (
    <div className="relative w-full h-full  select-none">
      <div
        ref={containerRef}
        className="relative h-full flex items-center justify-center "
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ touchAction: "pan-y" }}
      >
        <div className="relative w-full max-w-sm h-96 lg:h-[450px]">
          {/* Previous Image */}
          <div
            className={`absolute -left-8 top-1/2 w-60 h-full transition-all ease-out ${
              isDragging ? "duration-0" : "duration-600"
            }`}
            style={{
              transform: `translateY(-50%) translateX(${
                -15 + dragOffset * 0.2
              }px) scale(0.8)`,
              opacity: 0.6,
              zIndex: 1,
            }}
            onClick={() => !isDragging && !isAnimating && prevSlide()}
          >
            <div className="w-full h-full overflow-hidden shadow-lg bg-white">
              <img
                src={images[getPrevIndex()]}
                alt={images[getPrevIndex()]?.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* Current Image */}
          <div
            className={`absolute left-1/2 top-1/2 w-[22rem] h-full transition-all shadow-md ease-out ${
              isDragging ? "duration-0" : "duration-600"
            }`}
            style={{
              transform: `translate(-50%, -50%) translateX(${dragOffset}px) scale(${
                1 - Math.abs(dragOffset) * 0.002
              })`,
              opacity: 1,
              zIndex: 10,
            }}
          >
            <div className="w-full h-full overflow-hidden shadow-2xl bg-white">
              <img
                src={images[currentIndex]}
                alt={images[currentIndex]?.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* Next Image */}
          <div
            className={`absolute -right-8 top-1/2 w-64 h-full transition-all ease-out ${
              isDragging ? "duration-0" : "duration-600"
            }`}
            style={{
              transform: `translateY(-50%) translateX(${
                15 + dragOffset * 0.2
              }px) scale(0.8)`,
              opacity: 0.6,
              zIndex: 1,
            }}
            onClick={() => !isDragging && !isAnimating && nextSlide()}
          >
            <div className="w-full h-full overflow-hidden shadow-lg bg-white">
              <img
                src={images[getNextIndex()]}
                alt={images[getNextIndex()]?.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows for Desktop */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white/90 p-2 rounded-full shadow-lg transition-all disabled:opacity-50 hidden md:block"
      >
        <svg
          className="w-5 h-5 text-gray-800"
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
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white/90 p-2 rounded-full shadow-lg transition-all disabled:opacity-50 hidden md:block"
      >
        <svg
          className="w-5 h-5 text-gray-800"
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

      {/* Bottom Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-gray-800"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => !isAnimating && onIndexChange(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Thumbnail Navigation Component
const ThumbnailNavigation = ({ images, currentIndex, onIndexChange }) => {
  return (
    <div className="absolute w-2/3 max-sm:w-full max-sm:-bottom-32 -bottom-28 pt-6  left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center  gap-2  p-2 rounded-lg">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onIndexChange(index)}
          className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
            index === currentIndex
              ? "border-green-500 scale-110"
              : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <img
            src={image}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
};

// Product Options Component
const ProductOptions = ({
  selectedOptions,
  onOptionChange,
  availableOptions,
}) => {
  const { sizes } = useSelector((state) => state.size);
  console.log("Available sizes:", availableOptions);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sizes || sizes.length === 0) {
      dispatch(fetchSizes());
    }
  }, []);
  return (
    <div className="max-w-md mx-auto space-y-6 bg-white p-6 ">
      <div className="text-center mb-6">
        <div className="text-green-500 text-[10px] font-semibold font-arizona mb-2">
          STEP ONE
        </div>
        <h2 className="text-2xl text-gray-800 mb-1">
          Earrings.{" "}
          <span className="text-gray-400 font-arizona">Make It Yours.</span>
        </h2>
        <p className="text-gray-600 text-sm">Select a precious metal.</p>
      </div>

      {/* Metal Type */}
      <div className="space-y-2 grid grid-cols-3 gap-4">
        <div className="flex text-gray-700 items-center gap-2 mb-2">
          <span className="text-[10px] uppercase font-gintoNord font-semibold text-gray-700 mr-2 w-20">
            Metal Type
          </span>
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
          className="w-full col-span-2 border border-gray-300 px-3 py-2 text-[10px] flex items-center justify-between hover:bg-gray-50 transition-colors text-left text-gray-700"
          value={selectedOptions.metalType}
          onChange={(e) => onOptionChange("metalType", e.target.value)}
        >
          {availableOptions &&
            availableOptions.length > 0 &&
            availableOptions?.map((option, index) => (
              <option
                className="text-gray-700 font-gintoNormal text-[10px] font-medium"
                key={index}
                value={option.color._id}
              >
                {option.color.value}
              </option>
            ))}
        </select>
      </div>

      {/* Size */}

      <div className="space-y-2 grid grid-cols-3 gap-4">
        <div className="flex text-gray-700 items-center gap-2 mb-2">
          <span className="text-[10px] uppercase font-gintoNord font-semibold text-gray-700 mr-2 w-20">
            Size
          </span>
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
          className={`w-full col-span-2 border border-gray-300 px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors text-left ${
            selectedOptions.ringSize === "" ? "text-red-500" : "text-gray-700"
          }`}
          value={selectedOptions.ringSize}
          onChange={(e) => onOptionChange("ringSize", e.target.value)}
        >
          <option className="">Select Ring Size</option>

          {sizes?.map((size, index) => (
            <option
              className="text-gray-700 font-gintoNormal text-[10px] font-medium"
              key={index}
              value={size._id}
            >
              {size.size_code}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input type="checkbox" id="help-select" className="rounded" />
        <label htmlFor="help-select" className="text-sm text-gray-600">
          Help me to select later
        </label>
      </div>
    </div>
  );
};

// Modal Header Component
const ModalHeader = ({ onClose }) => {
  return (
    <div className="text-white p-2 flex h-16 items-center justify-between">
      <button
        onClick={onClose}
        className="flex bg-[#346441] px-4 py-3 items-center gap-2 text-white text-[10px] hover:text-gray-200 transition-colors"
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
  );
};

// Product Details Component
const ProductDetails = ({
  productData,
  selectedOptions,
  onOptionChange,
  availableOptions,
  handelAddToCart,
  handelSelectDiamond,
  productPrice,
  selectedDiamond,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearState()); // Fetch cart items on mount
    dispatch(fetchCart()); // Fetch cart items on mount
  }, []);
  const {
    data: cartItems,
    loading,
    error,
  } = useSelector((state) => state.cart);
  const isOnCart = cartItems?.some(
    (item) => item.pid_id === productData?.product?._id
  );
  console.log(productData);
  console.log("Cart items:", cartItems);

  if (!productData) {
    return (
      <div className="w-full md:w-1/2 p-6 overflow-y-auto flex items-center justify-center">
        <p className="text-gray-600">No product data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 max-sm:px-4 pb-6 overflow-y-auto">
      <div className="w-fit flex items-center gap-2 pr-3 py-2 rounded-lg">
        <svg
          className="w-4 h-4 text-blue-600"
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
            <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <span className="text-[10px] text-gray-600">
          {productData.reviewCount || 9727}
        </span>
      </div>
      <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-2 font-arizona">
        {productData?.name}
      </h1>

      <div className="text-xl font-medium text-gray-800 mb-4">
        {currencySymbol}
        {productData?.price?.toFixed(2) || "00.00"}
      </div>

      <p className="text-gray-600 font-gintoNormal leading-5 mb-8">
        {productData.description ||
          "Sweet and simple, our Emilia earring is a staple piece of fine jewellery. Perfect for any occasion, Emilia’s subtle sparkle and practical basket setting will add a touch of glamour to any outfit. Featuring six beautiful eagle-tipped claws, our Emilia earrings delicately hold a stunning Round Cut stone in each ear."}
      </p>

      <ProductOptions
        selectedOptions={selectedOptions}
        onOptionChange={onOptionChange}
        availableOptions={availableOptions}
      />

      {/* <StepOne /> */}
      <StepTwo
        handelSelectDiamond={handelSelectDiamond}
        selectedDiamond={selectedDiamond}
      />
      <StepThree
      />
      <StepFour
      />

      <div className="grid grid-cols-2 gap-6 mb-6 mt-6">
                {/* Lifetime Warranty */}
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[9px] font-semibold font-gintoNord text-gray-800 uppercase tracking-wider mb-1">
                      LIFETIME WARRANTY
                    </h3>
                  </div>
                </div>
      
                {/* Free Resizing */}
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[9px] font-semibold font-gintoNord text-gray-800 uppercase tracking-wider mb-1">
                      FREE RESIZING
                    </h3>
                  </div>
                </div>
      
                {/* Express & Insured Shipping */}
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M16 3h5v5M4 20 21 3m0 16v-5h-5M8 20H3v-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[9px] font-semibold font-gintoNord text-gray-800 uppercase tracking-wider mb-1">
                      EXPRESS & INSURED SHIPPING
                    </h3>
                  </div>
                </div>
      
                {/* Shipped Discretely */}
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[9px] font-semibold font-gintoNord text-gray-800 uppercase tracking-wider mb-1">
                      SHIPPED DISCRETELY
                    </h3>
                  </div>
                </div>
      
                {/* Finance Available */}
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[9px] font-semibold font-gintoNord text-gray-800 uppercase tracking-wider mb-1">
                      FINANCE AVAILABLE
                    </h3>
                  </div>
                </div>
      
                {/* In-House Jewellers */}
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[9px] font-semibold font-gintoNord text-gray-800 uppercase tracking-wider mb-1">
                      IN-HOUSE JEWELLERS
                    </h3>
                  </div>
                </div>
              </div>
      
              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button className="flex-1 border font-gintoNord border-green-700 py-2 px-4 text-[10px] font-semibold text-green-700 uppercase tracking-wider hover:bg-gray-50 transition-colors">
                  SEND A HINT
                </button>
                <button className="flex-1 border font-gintoNord border-green-700 py-2 px-4 text-[10px] font-semibold text-green-700 uppercase tracking-wider hover:bg-gray-50 transition-colors">
                  MAKE AN ENQUIRY
                </button>
              </div>
      
              {/* Shipping Information */}
              <div className="mb-6">
                <button className="w-full flex items-center justify-between py-3 border-t border-gray-200 text-left">
                  <span className="text-[10px] font-medium text-gray-800 uppercase tracking-wider">
                    SHIPPING INFORMATION
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
      
              {/* Social Share Buttons */}
              <div className="flex gap-4 justify-center">
                <button className="flex items-center px-4 py-2 text-[10px] font-medium text-gray-600 hover:text-gray-800 transition-colors">
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  Share
                </button>
                <button className="flex items-center px-4 py-2 text-[10px] font-medium text-gray-600 hover:text-gray-800 transition-colors">
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Tweet
                </button>
                <button className="flex items-center px-4 py-2 text-[10px] font-medium text-gray-600 hover:text-gray-800 transition-colors">
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.739.1.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                  Pin it
                </button>
              </div>

      <div className="mb-4 max-w-md mx-auto">
        {/* <Link href={`/cart`} className="w-full"> */}
        {isOnCart ? (
          <button
            onClick={handelAddToCart}
            className={`w-full cursor-pointer  mt-4 py-4 px-4 text-sm font-medium uppercase tracking-wider transition-colors  btn text-white hover:bg-green-700`}
          >
            ALREADY ADDED ON CART
          </button>
        ) : (
          <button
            onClick={handelAddToCart}
            className={`w-full cursor-pointer  mt-4 py-4 px-4 text-sm font-medium uppercase tracking-wider transition-colors  btn text-white hover:bg-green-700`}
          >
            ADD TO CART | {currencySymbol}
            {selectedDiamond
              ? (selectedDiamond.net + productPrice).toFixed(2)
              : productPrice || "00"}
          </button>
        )}
        {/* </Link> */}
      </div>
    </div>
  );
};

// Main Product Modal Component
const ProductModal = ({ onClose, loading }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const params = useParams();
  const { slug, category } = params;

  const [productData, setProductData] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [selectedDiamond, setSelectedDiamond] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [variantId, setVariantId] = useState("");
  const cartItems = useSelector((state) => state.cart.data);

  const { sizes } = useSelector((state) => state.size);

  const getData = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/product/${category}/${slug}`
      );
      console.log("Product data fetched:", response.data.body.data.product);

      setProductData(response.data.body.data.product);
      setProductPrice(response.data.body.data.product.price);
      setSelectedOptions({
        metalType:
          response?.data?.body?.data?.product?.inventory?.inventory_details[0]
            ?.color._id,
        ringSize: sizes[0]?._id || "",
      });
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("Selected options changed:", selectedOptions);
    const filteredMetals = productData?.inventory?.inventory_details.filter(
      (metal) =>
        metal.color?._id === selectedOptions?.metalType &&
        metal.size?._id === selectedOptions?.ringSize
    );

    if (filteredMetals?.length > 0) {
      const selectedMetal = filteredMetals[0];
      setProductPrice(selectedMetal.additional_price);
      setVariantId(selectedMetal._id);
    } else {
      setProductPrice(productData?.price);
      setVariantId("");
    }
  }, [selectedOptions]);
  // Handle escape key and body overflow

  const handelAddToCart = async () => {
    console.log("Adding to cart with product data:", productData);
    console.log("Selected options:", selectedOptions);

    if (
      !productData ||
      !selectedOptions.ringSize ||
      !selectedOptions.metalType
    ) {
      toast.error(
        "Please select ring size and metal type before adding to cart"
      );
      console.error("Product data or selected options are missing");
      return;
    }

    const sizeData = sizes.filter(
      (size) => size._id === selectedOptions.ringSize
    )[0];
    const metalTypeData = productData.inventory.inventory_details.filter(
      (metal) => metal.color._id === selectedOptions.metalType
    )[0];

    try {
      const data = {
        quantity: 1,
        pid_id: productData._id,
        pid_name: productData.name,
        pid_image: productData.image[0] || "",
        pid_price: productPrice || productData.price,
        selectedOptions: {
          ringSize: sizeData,
          metalType: metalTypeData,
        },
        selectedDiamond: selectedDiamond,
      };
      await dispatch(addCart(data));
      window.location.pathname = "/cart"; // Redirect to cart page
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const isOnCart = cartItems?.some(
    (item) => item.pid_id === productData?.product?._id
  );

  // Update selected options when productData changes
  useEffect(() => {
    if (productData?.options) {
      setSelectedOptions({
        bandWidth: productData.available_attributes.bandWidths?.[0] || "1.8mm",
        meleeStones:
          productData.available_attributes.meleeStones?.[0] || "Moissanite",
        metalType:
          productData.available_attributes?.["METAL TYPE"]?.[0] ||
          "18k Yellow Gold",
        ringSize: "",
      });
    }
  }, [productData]);

  const handleOptionChange = (option, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handelSelectDiamond = (diamond) => {
    console.log("Selected diamond:", diamond);
    setSelectedDiamond(diamond);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-cream/10 bg-opacity-50 backdrop-blur-sm" />
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {" "}
      <div className=" z-50">
        <div
          className="relative bg-cream/10 bg-opacity-50 backdrop-blur-sm"
          onClick={handleOverlayClick}
        />

        <div className="md:block relative w-full px-40 max-sm:px-4 max-sm:pb-10 pb-40 h-fit  md:mx-auto bg-[#fefaf5] shadow-xl overflow-scroll">
          <ModalHeader onClose={onClose} />

          <div
            className="flex flex-col md:flex-row overflow-hidden h-fit"
            style={{ height: "calc(100% - 64px)" }}
          >
            <div className="w-full mt-2 md:w-1/2 h-full max-sm:mb-40 relative">
              <ImageSlider
                images={productData?.image || []}
                currentIndex={currentImageIndex}
                onIndexChange={setCurrentImageIndex}
              />

              <ThumbnailNavigation
                images={productData?.image || []}
                currentIndex={currentImageIndex}
                onIndexChange={setCurrentImageIndex}
              />
            </div>

            <ProductDetails
              productData={productData}
              productPrice={productPrice}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
              availableOptions={productData?.inventory?.inventory_details || {}}
              handelAddToCart={handelAddToCart}
              handelSelectDiamond={handelSelectDiamond}
              selectedDiamond={selectedDiamond}
            />
          </div>
          <Difference />
          <Features />
          <ModalReviews />
          <ModalCertified />
          {/* <ModalFaq /> */}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-[#f0f0f0] py-3 border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="hidden md:flex flex-col items-start text-sm">
                <div className="flex items-center space-x-2">
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium text-[10px] font-gintoNormal">
                    FREE EXPRESS SHIPPING
                  </span>
                </div>
                <div className="flex items-center space-x-2">
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium text-[10px] font-gintoNormal">
                    DISCREET PACKAGING
                  </span>
                </div>
                <div className="flex items-center space-x-2">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium text-[10px] font-gintoNormal">
                    ESTIMATED COMPLETION DATE:
                  </span>
                  <span className="text-gray-700 text-[10px] font-gintoNormal">
                    {productData?.estimatedCompletionDate || "AUGUST 13, 2025"}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                </div>
              </div>

              {/* <button
              onClick={() => handelAddToCart()}
              className="bg-green-100 hover:bg-green-200 font-gintoNord text-[10px] w-full md:max-w-[300px] text-gray-800 font-medium px-6 py-2 rounded border border-gray-300 transition-colors"
            >
              ADD TO CART | {currencySymbol}
              {productPrice || "$2,450.00"}
            </button> */}

              {/* <Link href={`/cart`}  className="w-fit"> */}
              {isOnCart ? (
                <button
                  onClick={handelAddToCart}
                  className="bg-green-100 hover:bg-green-200 font-gintoNord text-[10px] w-full md:max-w-[300px] text-gray-800 font-medium px-10 py-2 rounded border border-gray-300 transition-colors"
                >
                  ALREADY ADDED ON CART
                </button>
              ) : (
                <button
                  onClick={handelAddToCart}
                  className="bg-green-100 hover:bg-green-200 font-gintoNord text-[10px] w-full md:max-w-[300px] text-gray-800 font-medium px-10 py-2 rounded border border-gray-300 transition-colors"
                >
                  ADD TO CART | {currencySymbol}
                  {selectedDiamond
                    ? (selectedDiamond.net + productPrice).toFixed(2)
                    : productPrice?.toFixed(2) || "00.00"}
                </button>
              )}
              {/* </Link> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
