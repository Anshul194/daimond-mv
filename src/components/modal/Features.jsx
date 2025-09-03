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
              src="/images/featOne.webp" 
              alt="Quality Craftsmanship" 
              className="w-full h-40 object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-4 font-gintoNord">
            QUALITY<br />CRAFTSMANSHIP
          </h3>
          <p className="text-[10px] text-gray-600 mb-6 leading-4 font-gintoNormal flex-grow">
            You can rest assured knowing your engagement ring is brought to life by expert hands to last a lifetime and beyond. From the initial design to the final polish, our artisans employ their expertise to create a ring that will stand the test of time heirloom for generations to come.
          </p>
          <button className="text-sm font-medium text-gray-800 uppercase tracking-wider hover:text-gray-600 transition-colors text-start font-gintoNord mt-auto">
            LEARN MORE →
          </button>
        </div>

        {/* Premium Materials */}
        <div className="text-left p-4 flex flex-col h-full bg-[#f4efe9]">
          <div className="mb-6">
            <img 
              src="/images/featTwo.webp" 
              alt="Premium Materials" 
              className="w-full h-40 object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-4 font-gintoNord">
            PREMIUM MATERIALS
          </h3>
          <p className="text-[10px] text-gray-600 mb-6 leading-4 font-gintoNormal flex-grow">
            Our dedication to quality is uncompromising. Every ring stands the test of time, maintaining its lustre as we never follow our our bands or resort to lower-purity alloys. You're investing in durability, strength, and beauty.
          </p>
          <button className="text-sm font-medium text-gray-800 uppercase tracking-wider hover:text-gray-600 transition-colors text-start font-gintoNord mt-auto">
            LEARN MORE →
          </button>
        </div>

        {/* Customisable Design */}
        <div className="text-left p-4 flex flex-col h-full bg-[#f4efe9]">
          <div className="mb-6">
            <img 
              src="/images/featThree.webp" 
              alt="Customisable Design" 
              className="w-full h-40 object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-4 font-gintoNord">
            CUSTOMISABLE<br />DESIGN
          </h3>
          <p className="text-[10px] text-gray-600 mb-6 leading-4 font-gintoNormal flex-grow">
            Your love story is unique, and we believe your engagement ring should reflect that. Enjoy an unparalleled experience as you take the reins in creating a one-of-a-kind symbol of your love. Our experts will work with you to bring your vision to life.
          </p>
          <button className="text-sm font-medium text-gray-800 uppercase tracking-wider hover:text-gray-600 transition-colors text-start font-gintoNord mt-auto">
            LEARN MORE →
          </button>
        </div>
      </div>

      {/* Second Row - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sustainable Practices */}
        <div className="text-left flex flex-col h-full p-4 bg-[#f4efe9]">
          <div className="mb-6">
            <img 
              src="/images/FeatFour.webp" 
              alt="Sustainable Practices" 
              className="w-full h-40 object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-4 font-gintoNord">
            SUSTAINABLE PRACTICES
          </h3>
          <p className="text-[10px] text-gray-600 mb-6 leading-4 font-gintoNormal flex-grow">
            While not affiliated with the numerous harms of mining, Cullen Jewellery recognises that energy is required to create lab-grown gemstones. We actively offset our emissions and neutral in environmental responsibility through diverse initiatives, building a better planet for all.
          </p>
          <button className="text-sm font-medium text-gray-800 uppercase tracking-wider hover:text-gray-600 transition-colors text-start font-gintoNord mt-auto">
            LEARN MORE →
          </button>
        </div>

        {/* Philanthropic Initiatives */}
        <div className="text-left flex flex-col h-full p-4 bg-[#f4efe9]">
          <div className="mb-6">
            <img 
              src="/images/featOne.webp" 
              alt="Philanthropic Initiatives" 
              className="w-full h-40 object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider mb-4 font-gintoNord">
            PHILANTHROPIC INITIATIVES
          </h3>
          <p className="text-[10px] text-gray-600 mb-6 leading-4 font-gintoNormal flex-grow">
            As a family business, Cullen Jewellery deeply empathises with the communities impacted by traditional mining practices. Our philanthropic initiatives reimagine industry norms and create brighter futures for those living within them.
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