"use client";

import React from 'react';

const Features = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* First Row - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Quality Craftsmanship */}
        <div className="text-left p-4 flex flex-col h-full bg-[#f4efe9]">
          <div className="mb-6">
            <img 
              src="/images/featOne.png" 
              alt="Quality Craftsmanship" 
              className="w-full h-64 object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-4 font-gintoNord">
            QUALITY<br />CRAFTSMANSHIP
          </h3>
          <p className="text-[10px] text-gray-600 mb-6 leading-4 font-gintoNormal flex-grow">
            Every Ardor piece is carefully handcrafted by skilled artisans who combine traditional techniques with modern precision. From the first sketch to the final polish, every detail is perfected to create jewellery designed to be treasured for generations.
          </p>
          <button className="text-sm font-medium text-gray-800 uppercase tracking-wider hover:text-gray-600 transition-colors text-start font-gintoNord mt-auto">
            LEARN MORE →
          </button>
        </div>

        {/* Premium Materials */}
        <div className="text-left p-4 flex flex-col h-full bg-[#f4efe9]">
          <div className="mb-6">
            <img 
              src="/images/featTwo.png" 
              alt="Premium Materials" 
              className="w-full h-64 object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-4 font-gintoNord">
            PREMIUM MATERIALS
          </h3>
          <p className="text-[10px] text-gray-600 mb-6 leading-4 font-gintoNormal flex-grow">
            Exceptional jewellery begins with exceptional materials. We carefully source premium metals and responsibly selected gemstones to ensure every creation offers remarkable brilliance, lasting durability, and timeless elegance you'll enjoy for years.
          </p>
          <button className="text-sm font-medium text-gray-800 uppercase tracking-wider hover:text-gray-600 transition-colors text-start font-gintoNord mt-auto">
            LEARN MORE →
          </button>
        </div>

        {/* Customisable Design */}
        <div className="text-left p-4 flex flex-col h-full bg-[#f4efe9]">
          <div className="mb-6">
            <img 
              src="/images/featThree.png" 
              alt="Customisable Design" 
              className="w-full h-64 object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-4 font-gintoNord">
            CUSTOMISABLE<br />DESIGN
          </h3>
          <p className="text-[10px] text-gray-600 mb-6 leading-4 font-gintoNormal flex-grow">
            Your jewellery should be as unique as your story. Collaborate with our designers to personalise every detail—from stone selection to setting and finish—creating a one-of-a-kind piece that reflects your individual style.
          </p>
          <button className="text-sm font-medium text-gray-800 uppercase tracking-wider hover:text-gray-600 transition-colors text-start font-gintoNord mt-auto">
            LEARN MORE →
          </button>
        </div>
      </div>

      {/* Second Row - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Responsible Sourcing */}
        <div className="text-left flex flex-col h-full p-4 bg-[#f4efe9]">
          <div className="mb-6">
            <img 
              src="/images/featFour.png" 
              alt="Responsible Sourcing" 
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-4 font-gintoNord">
            RESPONSIBLE SOURCING
          </h3>
          <p className="text-[10px] text-gray-600 mb-6 leading-4 font-gintoNormal flex-grow">
            We believe luxury should be created with care and integrity. Our commitment to ethical sourcing and responsible craftsmanship ensures every piece is produced with respect for both people and the environment.
          </p>
          <button className="text-sm font-medium text-gray-800 uppercase tracking-wider hover:text-gray-600 transition-colors text-start font-gintoNord mt-auto">
            LEARN MORE →
          </button>
        </div>

        {/* Lifetime Care */}
        <div className="text-left flex flex-col h-full p-4 bg-[#f4efe9]">
          <div className="mb-6">
            <img 
              src="/images/featFive.png" 
              alt="Lifetime Care" 
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-4 font-gintoNord">
            LIFETIME CARE
          </h3>
          <p className="text-[10px] text-gray-600 mb-6 leading-4 font-gintoNormal flex-grow">
            Our relationship continues long after your purchase. We provide professional cleaning, inspections, resizing, and maintenance services to help preserve the beauty, brilliance, and sentimental value of your jewellery for years ahead.
          </p>
          <button className="text-sm font-medium text-gray-800 uppercase tracking-wider hover:text-gray-600 transition-colors text-start font-gintoNord mt-auto">
            LEARN MORE →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;