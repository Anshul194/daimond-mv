"use client";

import React, { useEffect, useState, useRef } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import Difference from './Difference';
import Features from './Features';
import ModalReviews from './ModalReviews';
import ModalCertified from './ModalCertified';
import ModalFaq from './ModalFaq';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, selectProductById, selectProductLoadingState, clearProductError } from '../../store/slices/product';
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
    <div className="relative w-full h-full overflow-hidden select-none">
      <div 
        ref={containerRef}
        className="relative h-full flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="relative w-full max-w-sm h-[450px]">
        {/* <div className="relative w-full max-w-sm h-96"> */}
          {/* Previous Image */}
          <div 
            className={`absolute left-0 top-1/2 w-64 h-full transition-all ease-out ${
              isDragging ? 'duration-0' : 'duration-600'
            }`}
            style={{
              transform: `translateY(-50%) translateX(${-15 + (dragOffset * 0.2)}px) scale(0.8)`,
              opacity: 0.6,
              zIndex: 1,
            }}
            onClick={() => !isDragging && !isAnimating && prevSlide()}
          >
            <div className="w-full h-full overflow-hidden shadow-lg rounded-lg bg-white">
              <img
                src={images[getPrevIndex()].url}
                alt={images[getPrevIndex()].alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* Current Image */}
          <div 
            className={`absolute left-1/2 top-1/2 w-72 h-full transition-all ease-out ${
              isDragging ? 'duration-0' : 'duration-600'
            }`}
            style={{
              transform: `translate(-50%, -50%) translateX(${dragOffset}px) scale(${1 - Math.abs(dragOffset) * 0.002})`,
              opacity: 1,
              zIndex: 10,
            }}
          >
            <div className="w-full h-full overflow-hidden shadow-2xl rounded-lg bg-white">
              <img
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* Next Image */}
          <div 
            className={`absolute right-0 top-1/2 w-64 h-full transition-all ease-out ${
              isDragging ? 'duration-0' : 'duration-600'
            }`}
            style={{
              transform: `translateY(-50%) translateX(${15 + (dragOffset * 0.2)}px) scale(0.8)`,
              opacity: 0.6,
              zIndex: 1,
            }}
            onClick={() => !isDragging && !isAnimating && nextSlide()}
          >
            <div className="w-full h-full overflow-hidden shadow-lg rounded-lg bg-white">
              <img
                src={images[getNextIndex()].url}
                alt={images[getNextIndex()].alt}
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
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 top四大/2 transform -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white/90 p-2 rounded-full shadow-lg transition-all disabled:opacity-50 hidden md:block"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bottom Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'
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
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onIndexChange(index)}
          className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
            index === currentIndex
              ? 'border-green-500 scale-110'
              : 'border-gray-200 hover:border-gray-400'
          }`}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
};

// Product Options Component
const ProductOptions = ({ selectedOptions, onOptionChange, availableOptions }) => {
  return (
    <div className="space-y-6">
      {/* Band Width */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-medium text-gray-700">BAND WIDTH</label>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <select 
          className="w-full p-3 border border-gray-300 rounded-md bg-white"
          value={selectedOptions.bandWidth}
          onChange={(e) => onOptionChange('bandWidth', e.target.value)}
        >
          {(availableOptions?.bandWidths || ['1.8mm', '2.0mm', '2.2mm']).map((width) => (
            <option key={width} value={width}>{width}</option>
          ))}
        </select>
      </div>

      {/* Melee Stones */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-medium text-gray-700">MELEE STONES</label>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <select 
          className="w-full p-3 border border-gray-300 rounded-md bg-white"
          value={selectedOptions.meleeStones}
          onChange={(e) => onOptionChange('meleeStones', e.target.value)}
        >
          {(availableOptions?.meleeStones || ['Moissanite', 'Diamond', 'Lab Diamond']).map((stone) => (
            <option key={stone} value={stone}>{stone}</option>
          ))}
        </select>
      </div>

      {/* Metal Type */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-medium text-gray-700">METAL TYPE</label>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <select 
          className="w-full p-3 border border-gray-300 rounded-md bg-white"
          value={selectedOptions.metalType}
          onChange={(e) => onOptionChange('metalType', e.target.value)}
        >
          {(availableOptions?.metalTypes || ['18k Yellow Gold', '18k White Gold', '18k Rose Gold', 'Platinum']).map((metal) => (
            <option key={metal} value={metal}>{metal}</option>
          ))}
        </select>
      </div>

      {/* Ring Size */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-medium text-gray-700">RING SIZE</label>
          <span className="text-red-500">*</span>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <select 
          className="w-full p-3 border border-gray-300 rounded-md bg-white text-red-500"
          value={selectedOptions.ringSize}
          onChange={(e) => onOptionChange('ringSize', e.target.value)}
        >
          <option value="">Select a ring size</option>
          {(availableOptions?.ringSizes || ['5', '5.5', '6', '6.5', '7', '7.5', '8']).map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="help-select" className="rounded" />
          <label htmlFor="help-select" className="text-sm text-gray-600">
            Help me to select later
          </label>
        </div>
      </div>

      {/* Resizing Info */}
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-700">RESIZING</span>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-600">
          This ring can be resized up to 2.5 sizes up or 2 sizes down (once made in your selected size)
        </p>
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        BACK TO RINGS
      </button>
      
      <div className="flex items-center">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    </div>
  );
};

// Product Details Component
const ProductDetails = ({ productData, selectedOptions, onOptionChange, availableOptions }) => {
  if (!productData) {
    return (
      <div className="w-full md:w-1/2 p-6 overflow-y-auto flex items-center justify-center">
        <p className="text-gray-600">No product data available</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 p-6 overflow-y-auto">
      <div className="w-fit flex items-center gap-2 pr-3 py-2 rounded-lg">
        <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          ))}
        </div>
        <span className="text-[10px] text-gray-600">{productData.reviewCount || 9727}</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-2 font-arizona">
        {productData.name} – Two Third Pavé Wedding Ring
      </h1>
      
      <div className="text-xl font-medium text-gray-800 mb-4">
        {productData.price}
      </div>
      
      <p className="text-gray-600 font-gintoNormal leading-5 mb-8">
        {productData.description || 'Sweet and simple, our Emilia earring is a staple piece of fine jewellery. Perfect for any occasion, Emilia’s subtle sparkle and practical basket setting will add a touch of glamour to any outfit. Featuring six beautiful eagle-tipped claws, our Emilia earrings delicately hold a stunning Round Cut stone in each ear.'}
      </p>

      <ProductOptions 
        selectedOptions={selectedOptions} 
        onOptionChange={onOptionChange} 
        availableOptions={productData.options || {}}
      />
      
      <StepOne />
      <StepTwo />
    </div>
  );
};

// Main Product Modal Component
const ProductModal = ({ isOpen, onClose, productData, loading }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({
    bandWidth: productData?.options?.bandWidths?.[0] || '1.8mm',
    meleeStones: productData?.options?.meleeStones?.[0] || 'Moissanite',
    metalType: productData?.options?.metalTypes?.[0] || '18k Yellow Gold',
    ringSize: ''
  });

  // Handle escape key and body overflow
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Update selected options when productData changes
  useEffect(() => {
    if (productData?.options) {
      setSelectedOptions({
        bandWidth: productData.options.bandWidths?.[0] || '1.8mm',
        meleeStones: productData.options.meleeStones?.[0] || 'Moissanite',
        metalType: productData.options.metalTypes?.[0] || '18k Yellow Gold',
        ringSize: ''
      });
    }
  }, [productData]);

  if (!isOpen) return null;

  const productImages = productData?.images?.length > 0 ? productData.images : [
    {
      id: 0,
      url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
      alt: 'Main product view',
      type: 'main'
    },
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
      alt: 'Side view',
      type: 'side'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop',
      alt: 'Detail view',
      type: 'detail'
    }
  ];

  const handleOptionChange = (option, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-cream/10 bg-opacity-50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />
      
      <div className="md:block relative w-full md:max-w-full lg:max-w-[60vw] xl:max-w-[800px] h-screen md:h-[100vh] md:mx-auto bg-[#F2F2F2] shadow-xl overflow-scroll pb-32">
        <ModalHeader onClose={onClose} />

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-auto relative md:sticky md:top-0 md:self-start md:max-h-screen">
            <ImageSlider 
              images={productImages}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
            />
            
            <ThumbnailNavigation
              images={productImages}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
            />
          </div>

          <ProductDetails 
            productData={productData}
            selectedOptions={selectedOptions}
            onOptionChange={handleOptionChange}
            availableOptions={productData?.options || {}}
          />
        </div>
        <Difference />
        <Features />
        <ModalReviews />
        <ModalCertified />
        <ModalFaq />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#f0f0f0] py-3 border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex flex-col items-start text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-gray-700 font-medium text-[10px] font-gintoNormal">FREE EXPRESS SHIPPING</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span className="text-gray-700 font-medium text-[10px] font-gintoNormal">DISCREET PACKAGING</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700 font-medium text-[10px] font-gintoNormal">ESTIMATED COMPLETION DATE:</span>
                <span className="text-gray-700 text-[10px] font-gintoNormal">{productData?.estimatedCompletionDate || 'AUGUST 13, 2025'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <Link href="/cart">
              <button className="bg-green-100 hover:bg-green-200 font-gintoNord text-[10px] w-full md:max-w-[300px] text-gray-800 font-medium px-6 py-2 rounded border border-gray-300 transition-colors">
                ADD TO CART | {productData?.price || '$2,450.00'}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;