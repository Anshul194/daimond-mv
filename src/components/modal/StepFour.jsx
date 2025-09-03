"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const TimelineSelector = ({ selectedOptions, onOptionChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const timelineOptions = [
    {
      id: "standard",
      name: "September 22, 2025",
      description: "Standard delivery",
      price: null,
    },
    {
      id: "priority-1",
      name: "September 15, 2025",
      description: "Priority crafting",
      price: "+$150",
    },
    {
      id: "priority-2",
      name: "September 8, 2025",
      description: "Rush delivery",
      price: "+$300",
    },
    {
      id: "priority-3",
      name: "September 1, 2025",
      description: "Express crafting",
      price: "+$500",
    },
  ];

  const handleSelect = (option) => {
    onOptionChange("completionDate", option.name);
    setIsOpen(false);
  };

  return (
    <div className="mb-2">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-green-500 text-[10px] font-semibold font-arizona mb-2">
          STEP FOUR
        </div>
        <h2 className="text-xl text-gray-800 mb-1 font-arizona">
          Timeline.{" "}
          <span className="text-gray-400 font-arizona">Some Things Can't Wait.</span>
        </h2>
        <p className="text-gray-600 text-sm">
          If you require your ring sooner, we have priority crafting options available. Select these options from the dropdown below.
        </p>
      </div>

      {/* Timeline Selector */}
      <div className="relative flex justify-between items-center gap-4">
        <div className="flex items-center mb-2 md:mb-0">
          <span className="text-[10px] font-gintoNord font-semibold text-gray-700 mr-2">
            COMPLETION DATE
          </span>
          <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-white">
            ?
          </div>
        </div>

        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-3/4 max-w-[290px] border border-gray-600 px-4 py-2 flex items-center justify-between hover:bg-green-100 transition-colors"
        >
          <span className="text-gray-700 font-gintoNormal text-[10px] font-medium">
            {selectedOptions.completionDate}
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
            {timelineOptions.map((option) => {
              const isSelected = selectedOptions.completionDate === option.name;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 relative ${
                    isSelected ? "bg-green-50" : ""
                  }`}
                >
                  {/* Green Selection Line */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                  )}

                  {/* Date and Description */}
                  <div className="flex-1 text-left">
                    <div className="text-gray-800 font-medium text-sm">
                      {option.name}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {option.description}
                    </div>
                  </div>

                  {/* Price */}
                  {option.price && (
                    <div className="text-green-600 font-medium text-sm">
                      {option.price}
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

const TimelineSelectorDemo = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    completionDate: "September 22, 2025",
  });

  const handleOptionChange = (option, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  return (
    <div className="max-w-md mx-auto h-fit p-2 px-4 mt-4 bg-white">
      <TimelineSelector
        selectedOptions={selectedOptions}
        onOptionChange={handleOptionChange}
      />
    </div>
  );
};

export default TimelineSelectorDemo;