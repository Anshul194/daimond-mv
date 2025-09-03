"use client";

import React, { useState } from "react";

const EngravingSelector = ({ selectedOptions, onOptionChange }) => {
  const [engravingText, setEngravingText] = useState(selectedOptions.engravingText || "");

  const handleTextChange = (e) => {
    const value = e.target.value;
    setEngravingText(value);
    onOptionChange("engravingText", value);
  };

  return (
    <div className="mb-2">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-green-500 text-[10px] font-semibold font-arizona mb-2">
          STEP THREE
        </div>
        <h2 className="text-xl text-gray-800 mb-1 font-arizona">
          Engraving.{" "}
          <span className="text-gray-400 font-arizona">A Personal Touch.</span>
        </h2>
        <p className="text-gray-600 text-sm">
          If you would like to add a personal message, type it in the box below and select your desired font.
        </p>
      </div>

      {/* Engraving Input */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center mb-2 md:mb-0">
          <span className="text-[10px] font-gintoNord font-semibold text-gray-700 mr-2">
            ENGRAVING
          </span>
          <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-white">
            ?
          </div>
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={engravingText}
          onChange={handleTextChange}
          placeholder="Engraving Text (+36.00 USD)"
          className="w-3/4 max-w-[290px] border border-gray-600 px-4 py-2 text-[10px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
        />
      </div>
    </div>
  );
};

const EngravingSelectorDemo = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    engravingText: "",
  });

  const handleOptionChange = (option, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  return (
    <div className="max-w-md mx-auto h-fit p-2 px-4 mt-4 bg-white">
      <EngravingSelector
        selectedOptions={selectedOptions}
        onOptionChange={handleOptionChange}
      />
    </div>
  );
};

export default EngravingSelectorDemo;