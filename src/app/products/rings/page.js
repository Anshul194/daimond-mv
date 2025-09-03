"use client";

import React, { useEffect, useState } from "react";
import ProductCardGrid from "../ProductGrid";
import RingsGrid from "@/components/RingGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByAttribute } from "@/store/slices/product";
import ProductModal from "@/components/modal/Modal";

const Rings = () => {
  const [hoveredRing, setHoveredRing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRing, setSelectedRing] = useState(null);

  const handleRingClick = (ring, index) => {
    console.log("Ring clicked:", ring); // Debug log
    setSelectedRing({ ...ring, index });
    setIsModalOpen(true);
  };

  const dispatch = useDispatch();
  const {
    items: ringsData,
    loading,
    error,
  } = useSelector((state) => state.product);

  // State for sort option (optional, for UI consistency)
  const [sortOption, setSortOption] = useState("Recommended");

  // Fetch rings by attribute on component mount
  useEffect(() => {
    dispatch(
      fetchProductsByAttribute({
        attributeName: "Style",
        attributeValue: "Engagement",
        page: 1,
        limit: 10,
      })
    );
  }, [dispatch]);

  return (
    <div>
      <div className="relative h-[400px] w-full">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://cdn.shopify.com/s/files/1/0644/3067/0060/files/Banner-FashionRings_2000x2000.jpg?v=1711354234"
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
              Rings
            </h1>
            <p className="text-sm md:text-sm lg:text-sm font-normal">
              Fine rings for every occasion.
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
              <span className="text-sm text-gray-600">
                Show lifestyle photos
              </span>
            </div>
          </div>
        </div>

        {/* Rings grid - 5 in a row */}
        <div className=" mx-auto">
          <RingsGrid rings={ringsData} onRingClick={handleRingClick} />
        </div>

        {/* Modal for ring details */}
        <ProductModal
          isOpen={isModalOpen}
          // onClose={() => setIsModalOpen(false)}
          title={selectedRing ? selectedRing?.name : ""}
          size={selectedRing?.size}
          productData={selectedRing} // New prop for product-specific modal
        />
      </div>
    </div>
  );
};

export default Rings;
