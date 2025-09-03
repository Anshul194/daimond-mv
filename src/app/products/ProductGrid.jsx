"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../../src/components/modal/Modal'; 

const ProductCardGrid = ({ products }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Modal state - explicitly initialize as closed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = useCallback((product, index, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Product clicked:', product, 'Current modal state:', isModalOpen);
    
    // Set the selected product and open modal
    setSelectedProduct({ ...product, index });
    setIsModalOpen(true);
    
    console.log('Modal should open now');
  }, [isModalOpen]);

  // Handle modal close - with proper cleanup timing
  const handleModalClose = useCallback(() => {
    console.log('Modal closing, current state:', { isModalOpen, selectedProduct });
    
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    
    // Delay resetting selectedProduct to allow Modal to complete its closing process
    setTimeout(() => {
      setSelectedProduct(null);
      console.log('Modal state reset complete');
    }, 150); // Small delay to ensure Modal handles the close properly
    
  }, [isModalOpen, selectedProduct]);

  // Handle escape key with useCallback
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && isModalOpen) {
      console.log('Escape key pressed');
      handleModalClose();
    }
  }, [isModalOpen, handleModalClose]);

  // Handle escape key
  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, handleEscape]);

  const handleArrowClick = useCallback((event, direction, product, index) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Handle arrow navigation here
    console.log(`${direction} arrow clicked for product:`, product);
    // You can add logic to change product images here
  }, []);

  // Debug useEffect to track state changes
  useEffect(() => {
    console.log('Modal state changed:', { isModalOpen, selectedProduct: selectedProduct?.name });
  }, [isModalOpen, selectedProduct]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        {products.map((product, index) => (
          <div 
            key={`product-${index}-${product.name}`} 
            className="bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={(e) => handleProductClick(product, index, e)}
          >
            {/* Product image placeholder */}
            <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center mb-4 relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-yellow-400 rounded-full bg-white/50"></div>
              </div>
              
              {/* Navigation arrows - only show on hover */}
              {hoveredItem === index && (
                <>
                  {/* Left arrow */}
                  <button 
                    className="absolute cursor-pointer left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                    onClick={(e) => handleArrowClick(e, 'left', product, index)}
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Right arrow */}
                  <button 
                    className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                    onClick={(e) => handleArrowClick(e, 'right', product, index)}
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {/* Product details */}
            <div className="p-4 text-center">
              <h3 className="font-medium text-gray-800 mb-2 tracking-wide">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 font-light">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal - Only render when we have a selected product */}
      {selectedProduct && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          productData={selectedProduct}
          closeOnOverlayClick={true}
        />
      )}
    </>
  );
};

export default ProductCardGrid;