"use client";

import React, { useState, useEffect } from 'react';
import FilterSection from '../FilterSection';
import Modal from '../../../components/modal/Modal'; // Import the Modal component
import RingsGrid from '../../../components/RingGrid'; // Import the RingsGrid component
import ProductPageFaq from '@/components/ProductPageFaq';

const Women = () => {
  const [selectedGender, setSelectedGender] = useState('WOMEN');
  const [selectedStyle, setSelectedStyle] = useState('CURVED');
  const [selectedMetals, setSelectedMetals] = useState(['PLATINUM']);
  
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

  // Handle gender change
  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    if (gender === 'WOMEN') {
      setSelectedStyle('CURVED');
      setSelectedMetals(['PLATINUM']);
    } else {
      setSelectedStyle('CLASSIC');
      setSelectedMetals(['PLATINUM']);
    }
  };

  // Handle style change
  const handleStyleChange = (styleId) => {
    setSelectedStyle(styleId);
  };

  // Handle metal selection
  const handleMetalSelect = (metalId) => {
    if (selectedGender === 'WOMEN') {
      setSelectedMetals([metalId]);
    } else {
      setSelectedMetals(prev => {
        if (prev.includes(metalId)) {
          return prev.filter(id => id !== metalId);
        } else {
          return [...prev, metalId];
        }
      });
    }
  };

  // Handle select all metals
  const handleSelectAllMetals = () => {
    const womenMetalTypes = ['PLATINUM', '18K_YELLOW_GOLD', '18K_ROSE_GOLD', '18K_WHITE_GOLD'];
    const menMetalTypes = ['PLATINUM', 'YELLOW_GOLD', 'ROSE_GOLD', 'WHITE_GOLD', 'TITANIUM', 'TANTALUM', 'CARBON_FIBRE'];
    const allMetalIds = selectedGender === 'WOMEN' ? womenMetalTypes : menMetalTypes;
    setSelectedMetals(allMetalIds);
  };

  // Handle reset metals
  const handleResetMetals = () => {
    setSelectedMetals([]);
  };

  // Handle ring click to open modal
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
    <div>
      {/* Hero Section */}
      <div className="relative h-64 w-full">
        <div className="absolute inset-0">
          <img 
            src="https://cdn.shopify.com/s/files/1/0644/3067/0060/files/Banner_-_Wedding_Ring_-_womens_-_desktop_2000x2000.jpg?v=1741931280"
            alt="Wedding rings"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-transparent"></div>
        
        <div className="relative z-10 flex items-center justify-center h-64 w-full">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-arizona font-light">
              Wedding Rings for {selectedGender === 'WOMEN' ? 'Women' : 'Men'}
            </h1>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <FilterSection 
        selectedGender={selectedGender}
        selectedStyle={selectedStyle}
        selectedMetals={selectedMetals}
        onGenderChange={handleGenderChange}
        onStyleChange={handleStyleChange}
        onMetalSelect={handleMetalSelect}
        onSelectAllMetals={handleSelectAllMetals}
        onResetMetals={handleResetMetals}
      />

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
        <ProductPageFaq/>

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
  );
};

export default Women;