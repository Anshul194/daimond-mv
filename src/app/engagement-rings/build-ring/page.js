"use client";

import React, { useState, useEffect } from 'react'
import Filter from '../Filter';
import Modal from '../../../components/modal/Modal';
import RingsGrid from '../../../components/RingGrid';

const RingsBuild = () => {
  // Modal state - Initialize as closed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRing, setSelectedRing] = useState(null);
  
  // Reset modal state on component mount
  useEffect(() => {
    setIsModalOpen(false);
    setSelectedRing(null);
  }, []);

  const rings = [
    { 
      name: "ASHTON", 
      price: "STARTING 439 USD",
      images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]
    },
    { 
      name: "MOANA", 
      price: "STARTING 1,096 USD",
      images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]
    },
    { 
      name: "KAITLYN", 
      price: "STARTING 806 USD",
      images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]
    },
    { 
      name: "OCEA", 
      price: "STARTING 757 USD",
      images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]
    },
    { 
      name: "JOANNA", 
      price: "STARTING 877 USD",
      images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]
    },
    { 
      name: "LIANA", 
      price: "STARTING 912 USD",
      images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]
    },
    { 
      name: "ALEXANDRA", 
      price: "STARTING 1,958 USD",
      images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]
    },
    { 
      name: "LANA", 
      price: "STARTING 1,633 USD",
      images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]
    },
    { 
      name: "ARIZONA", 
      price: "STARTING 926 USD",
      images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]
    },
    { 
      name: "CHIARA", 
      price: "STARTING 954 USD",
      images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]
    }
  ];

  const handleRingClick = (ring, index) => {
    console.log('Ring clicked:', ring); // Debug log
    setSelectedRing({ ...ring, index });
    setIsModalOpen(true);
  };

  // Handle modal close - Enhanced with multiple cleanup methods
  const handleModalClose = () => {
    console.log('Modal closing'); // Debug log
    setIsModalOpen(false);
    setSelectedRing(null);
    
    // Additional cleanup - remove any body scroll lock
    document.body.style.overflow = 'unset';
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleModalClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/engagementBanner.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-5xl font-light font-arizona mb-2 tracking-wide">
              Platinum Engagement Rings
            </h1>
            <p className="text-lg md:text-sm font-gintoNord font-light">
              Brought to life by our in-house jewellers.
            </p>
          </div>
        </div>
      </div>

      {/* Content Below Banner */}
      <div className="max-w-4xl mx-auto px-6 py-6 text-center">
        <p className="text-gray-700 text-[10px] leading-relaxed font-gintoNord mb-2">
          Create your Platinum lab grown diamond, moissanite or lab grown sapphire engagement ring below .
        </p>
        <p className="text-gray-600 text-[10px] font-gintoNord">
          Looking to view our range in person? We are open by appointment. Please{' '}
          <span className="text-gray-800 font-medium border-b-2 hover:border-gray-800 pb-1 cursor-pointer hover:text-gray-600 transition-colors">
            make a booking here
          </span>
          .
        </p>
      </div>

      <Filter/>

      {/* Product Section */}
      <div className="bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-end items-center gap-4">
            <span className="text-sm text-gray-600">Sort:</span>
            <select className="text-sm border border-gray-300 rounded px-3 py-1">
              <option>Recommended</option>
            </select>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px]">✓</span>
              </div>
              <span className="text-sm text-gray-600">Show lifestyle photos</span>
            </div>
          </div>
        </div>

        {/* Rings Grid Component */}
        <RingsGrid rings={rings} onRingClick={handleRingClick} />
      </div>

      {/* Product Detail Modal - Only render when needed */}
      {selectedRing && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          productData={selectedRing}
          closeOnOverlayClick={true}
        />
      )}
    </div>
  )
}

export default RingsBuild