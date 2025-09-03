"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const MetalSelector = ({ selectedOptions, onOptionChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const metalOptions = [
    {
      id: "yellow-gold",
      name: "18k Yellow Gold",
      image: "💍", // Using emoji as placeholder
      price: null,
    },
    {
      id: "platinum",
      name: "Platinum",
      image: "💎",
      price: "+141 USD",
    },
    {
      id: "rose-gold",
      name: "18k Rose Gold",
      image: "🌹",
      price: null,
    },
    {
      id: "white-gold",
      name: "18k White Gold",
      image: "⚪",
      price: null,
    },
  ];

  const handleSelect = (metal) => {
    onOptionChange("metalType", metal.name);
    setIsOpen(false);
  };

  return (
    <div className="mb-2">
      {/* Header */}
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

      {/* Metal Type Selector */}
      <div className="relative flex justify-between">
        <div className="flex items-center mb-2">
          <span className="text-[10px] font-gintoNord font-medium text-gray-700 mr-2">
            METAL TYPE
          </span>
          <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-white">
            ?
          </div>
        </div>

        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-3/4 max-w-[290px] border border-gray-600  px-4 py-2 flex items-center justify-between hover:bg-green-100 transition-colors"
        >
          <span className="text-gray-700 font-gintoNormal text-[10px] font-medium">
            {selectedOptions.metalType}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            {metalOptions.map((metal) => {
              const isSelected = selectedOptions.metalType === metal.name;
              return (
                <button
                  key={metal.id}
                  onClick={() => handleSelect(metal)}
                  className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 relative ${
                    isSelected ? "bg-green-50" : ""
                  }`}
                >
                  {/* Green Selection Line */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                  )}

                  {/* Metal Image */}
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-4 text-xl">
                    {metal.image}
                  </div>

                  {/* Metal Name */}
                  <div className="flex-1 text-left">
                    <span className="text-gray-800 font-medium">
                      {metal.name}
                    </span>
                  </div>

                  {/* Price */}
                  {metal.price && (
                    <div className="text-green-600 font-medium text-sm">
                      {metal.price}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const MetalSelectorDemo = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    metalType: "18k Yellow Gold",
  });

  const handleOptionChange = (option, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  return (
    <div className="max-w-md mx-auto h-fit p-2 px-4 mt-4 bg-white">
      <MetalSelector
        selectedOptions={selectedOptions}
        onOptionChange={handleOptionChange}
      />
    </div>
  );
};

export default MetalSelectorDemo;
