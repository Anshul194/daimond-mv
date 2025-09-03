'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Collections = ({ className = "" }) => {
  const [activeCollection, setActiveCollection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  const collections = [
    {
      name: 'READY-TO-SHIP',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
    },
    {
      name: 'STATEMENT',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
    },
    {
      name: 'MINIMAL',
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop',
    },
    {
      name: 'STACKER',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop',
    },
    {
      name: 'BEZEL',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop',
    },
    {
      name: 'EAST-WEST',
      image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=600&fit=crop',
    },
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveCollection((prev) => (prev + 1) % collections.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveCollection((prev) => (prev - 1 + collections.length) % collections.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Enhanced touch/drag handlers
  const handleDragStart = (clientX) => {
    if (isAnimating) return;
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || isAnimating) return;
    
    const offset = clientX - dragStart;
    // Limit drag offset to prevent over-dragging
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

  // Touch events
  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse events for desktop drag
  const handleMouseDown = (e) => {
    if (isMobile) return;
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isMobile) return;
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    if (isMobile) return;
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    handleDragEnd();
  };

  // Get the indices for previous, current, and next images
  const getPrevIndex = () => (activeCollection - 1 + collections.length) % collections.length;
  const getNextIndex = () => (activeCollection + 1) % collections.length;

  return (
    <div className={`${isMobile ? 'flex flex-col' : `flex ${className}`} h-fit bg-white `}>
      {isMobile ? (
        // Mobile Layout
        <>
          {/* Mobile Header */}
          <div className="bg px-6 py-8 text-center flex-shrink-0">
            <h2 className="text-white text-sm font-medium font-gintoNormal tracking-widest mb-4">
              RING COLLECTIONS
            </h2>
            <h3 className="text-white text-2xl font-light tracking-wider">
              {collections[activeCollection].name}
            </h3>
          </div>

          {/* Mobile Image Carousel with Smooth Stack Effect */}
          <div 
            ref={containerRef}
            className="bg relative h-fit py-12 overflow-hidden select-none lg:flex-1"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            <div className="flex items-center justify-center h-fit px-4">
              <div className="relative w-full max-w-xs h-[400px]">
                
                {/* Previous Image (Left) */}
                <div 
                  className={`absolute left-0 top-1/2 w-56 h-full transition-all ease-out ${
                    isDragging ? 'duration-0' : 'duration-600'
                  }`}
                  style={{
                    transform: `translateY(-50%) translateX(${-15 + (dragOffset * 0.2)}px) scale(0.8)`,
                    opacity: 0.6,
                    zIndex: 1,
                  }}
                  onClick={() => !isDragging && !isAnimating && prevSlide()}
                >
                  <div className="w-full h-full overflow-hidden shadow-lg">
                    <img
                      src={collections[getPrevIndex()].image}
                      alt={collections[getPrevIndex()].name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Current Image (Center) */}
                <div 
                  className={`absolute left-1/2 top-1/2 w-64 h-full transition-all ease-out ${
                    isDragging ? 'duration-0' : 'duration-600'
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${dragOffset}px) scale(${1 - Math.abs(dragOffset) * 0.002})`,
                    opacity: 1,
                    zIndex: 10,
                  }}
                >
                  <div className="w-full h-full  overflow-hidden shadow-2xl">
                    <img
                      src={collections[activeCollection].image}
                      alt={collections[activeCollection].name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Next Image (Right) */}
                <div 
                  className={`absolute right-0 top-1/2 w-56 h-full transition-all ease-out ${
                    isDragging ? 'duration-0' : 'duration-600'
                  }`}
                  style={{
                    transform: `translateY(-50%) translateX(${15 + (dragOffset * 0.2)}px) scale(0.8)`,
                    opacity: 0.6,
                    zIndex: 1,
                  }}
                  onClick={() => !isDragging && !isAnimating && nextSlide()}
                >
                  <div className="w-full h-full overflow-hidden shadow-lg">
                    <img
                      src={collections[getNextIndex()].image}
                      alt={collections[getNextIndex()].name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Desktop Layout - 50/50 split
        <>
          {/* Left side - Images (50% width) */}
          <div className="w-1/2 relative bg-gray-50 overflow-hidden select-none">
            <div className="h-full w-full flex items-center justify-center">
              <img
                src={collections[activeCollection].image}
                alt={collections[activeCollection].name}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                draggable={false}
              />
            </div>
          </div>

          {/* Right side - Navigation (50% width) */}
          <div className="w-1/2 bg flex flex-col justify-center items-center px-8 py-12">
            <div className="text-center space-y-2 max-w-md">
              <h2 className="text-white text-sm font-light font-gintoNord tracking-widest mb-8">
                RING COLLECTIONS
              </h2>
              
              <nav className="space-y-6">
                {collections.map((collection, index) => (
                  <div key={index} className="relative">
                    <button
                      className={`text-white text-2xl font-light font-arizona tracking-wider transition-all duration-300 block w-full text-center ${
                        index === activeCollection 
                          ? 'opacity-100 text-white scale-110' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setActiveCollection(index)}
                      onMouseEnter={() => !isAnimating && setActiveCollection(index)}
                      disabled={isAnimating}
                    >
                      {collection.name}
                    </button>
                
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Collections;