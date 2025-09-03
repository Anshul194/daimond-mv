"use client";

import React, { useState } from 'react'
import ProductCardGrid from '../ProductGrid';
import RingsGrid from '@/components/RingGrid';

const Bracelet = () => {
  const [hoveredRing, setHoveredRing] = useState(null);
  const rings = [
    { name: "ASHTON", price: "STARTING 950 USD" ,images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]},
    { name: "MOANA", price: "STARTING 1,096 USD" ,images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]},
    { name: "ANGELINA", price: "STARTING 1,788 USD" ,images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]},
    { name: "GIGI", price: "STARTING 1,788 USD" ,images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]},
    { name: "OCEA", price: "STARTING 757 USD" ,images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]},
    { name: "SOPHIA", price: "STARTING 1,200 USD",images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"] },
    { name: "LUNA", price: "STARTING 890 USD" ,images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]},
    { name: "ARIA", price: "STARTING 1,450 USD" ,images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]},
    { name: "NOVA", price: "STARTING 2,100 USD" ,images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]},
    { name: "MAYA", price: "STARTING 1,680 USD" ,images: ["/images/demoprod/cover.webp", "/images/demoprod/slideone.webp", "/images/demoprod/slidetwo.webp"]}
  ];

    const handleRingClick = (ring, index) => {
    console.log('Ring clicked:', ring); // Debug log
    setSelectedRing({ ...ring, index });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="relative h-[400px] w-full">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="https://cdn.shopify.com/s/files/1/0644/3067/0060/files/Bracelet_Banner_1_2000x2000.jpg?v=1748393094"
            alt="Woman showing rings"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-transparent"></div>
        
        {/* Text overlay */}
        <div className="relative z-10 flex items-center justify-center h-[400px] w-full ">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-arizona font-light">
              Bracelets
            </h1>
            <p className="text-sm md:text-sm max-w-lg lg:text-sm font-normal">
              Our stylish tennis bracelets are a stunning addition to any outfit. Exquisitely crafted with meticulous attention to detail, our bracelets are the perfect gift for any special occasion.
            </p>
          </div>
        </div>
      </div>

      {/* Header section with sort */}
      <div className="bg-white py-8 px-4">
        <div className="max-w-full 2xl:max-w-[1700px] mx-auto mb-8">
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

        {/* Rings grid - 5 in a row */}
        <div className=" mx-auto">
          <RingsGrid rings={rings} onRingClick={handleRingClick} />
        </div>
      </div>
    </div>
  )
}

export default Bracelet