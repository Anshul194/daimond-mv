"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart } from "lucide-react";
import ShowDiamond from "./ShowDiamond";
import axiosInstance from "@/axiosConfig/axiosInstance";

const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

const StepTwo = ({ handelSelectDiamond, selectedDiamond }) => {
  const [leftStoneOptions, setLeftStoneOptions] = useState({
    clarity: "",
    // carat: "2.00-2.24ct",
    color: "",
  });
  const [diamondData, setDiamondData] = useState([]);
  const [showDiamond, setShowDiamond] = useState(false);
  const modalRef = useRef(null);

  const [rightStoneOptions, setRightStoneOptions] = useState({
    stoneType: "Lab Grown Diamond",
    clarity: "VS1",
    carat: "2.00-2.24ct",
    colour: "E",
    cut: "Excellent",
  });

  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownOptions = {
    stoneType: ["Lab Grown Diamond", "Natural Diamond", "Moissanite"],
    clarity: ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"],
    carat: [
      "1.00-1.24ct",
      "1.25-1.49ct",
      "1.50-1.74ct",
      "1.75-1.99ct",
      "2.00-2.24ct",
      "2.25-2.49ct",
    ],
    color: ["D", "E", "F", "G", "H", "I", "J"],
    cut: ["Excellent", "Very Good", "Good", "Fair"],
  };

  // Check if all required fields are filled
  const areAllFieldsFilled = () => {
    const requiredFields = ["stoneType", "clarity", "carat", "colour", "cut"];
    const leftFilled = requiredFields.every((field) => leftStoneOptions[field]);
    const rightFilled = requiredFields.every(
      (field) => rightStoneOptions[field]
    );
    return leftFilled && rightFilled;
  };

  const handleDropdownToggle = (field, stone) => {
    const key = `${stone}-${field}`;
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleOptionSelect = (field, value, stone) => {
    if (stone === "left") {
      setLeftStoneOptions((prev) => ({ ...prev, [field]: value }));
    } else {
      setRightStoneOptions((prev) => ({ ...prev, [field]: value }));
    }
    setOpenDropdown(null);
  };

  const renderDropdown = (field, stone, options) => {
    const currentOptions =
      stone === "left" ? leftStoneOptions : rightStoneOptions;
    const isOpen = openDropdown === `${stone}-${field}`;

    return (
      <div className="relative">
        <button
          onClick={() => handleDropdownToggle(field, stone)}
          className="w-full border border-gray-300 px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
        >
          <span
            className={` ${
              currentOptions[field] === "" ? "text-red-500" : "text-gray-700"
            } font-gintoNormal text-[10px] font-medium`}
          >
            {currentOptions[field] === ""
              ? "Select an option"
              : currentOptions[field]}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-10 max-h-40 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(field, option, stone)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-700 text-[10px] font-medium">
                  {option}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStoneSelector = (stone, options) => (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Heart className="w-4 h-4 text-gray-400 mr-2" />
        <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wider">
          Choose Your Stone
        </h3>
      </div>

      <div className="space-y-3">
        {Object.entries({
          CLARITY: "clarity",
          // CARAT: "carat",
          COLOR: "color",
        }).map(([label, field]) => (
          <div key={field} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-[10px] uppercase font-gintoNord font-semibold text-gray-700 mr-2 w-20">
                {label}
              </span>
              <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-white">
                ?
              </div>
            </div>
            <div className="w-3/5">
              {renderDropdown(field, stone, dropdownOptions[field])}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `api/diamond/import?searchFields=${JSON.stringify(
            leftStoneOptions
          )}&limit=2`
        );
        console.log(
          "Response from diamond import API:",
          response.data.body.data.docs
        );

        setDiamondData(response.data.body.data.docs);
      } catch (error) {
        console.error("Error fetching diamond data:", error);
      }
    };

    fetchData();
  }, [leftStoneOptions]);

  const selectedDim = (data) => {
    handelSelectDiamond(data);
  };

  useEffect(() => {
    setShowDiamond(false);
  }, [selectedDiamond]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowDiamond(false);
      }
    }

    if (showDiamond) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDiamond]);

  console.log("slectedDiamond in StepTwo:", selectedDiamond);
  return (
    <>
      <ShowDiamond
        isVisible={showDiamond}
        onClose={() => setShowDiamond(false)}
        filters={leftStoneOptions}
        handelSelectDiamond={selectedDim}
        ref={modalRef}
      />

      <div className="max-w-md mx-auto h-fit p-2 px-4 bg-white mt-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-green-500 text-[10px] font-semibold font-arizona mb-2">
            STEP TWO
          </div>
          <h2 className="text-2xl text-gray-800 mb-1">
            Gemstone.{" "}
            <span className="text-gray-400 font-arizona">
              Centre Of Attention.
            </span>
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Select your stone preferences below and we will curate recommended
            gemstones for you.
          </p>
        </div>

        {/* Left Stone Selector */}
        {!selectedDiamond && renderStoneSelector("left", leftStoneOptions)}

        {/* Recommended Options */}
        <div className="mb-8">
          {!selectedDiamond && (
            <h3 className="text-center text-sm font-medium text-gray-800 uppercase tracking-wider mb-4">
              Recommended Options
            </h3>
          )}

          {selectedDiamond ? (
            <div className="flex bg-white gap-4  w-full">
              <div className="relative w-1/2 bg-black/10 mb-3 aspect-square overflow-hidden ">
                <Heart className="absolute top-2 right-2 w-4 h-4 text-gray-300" />
                <iframe
                  src={selectedDiamond?.video}
                  title={`Video for ${selectedDiamond?._id}`}
                  className="w-full h-full aspect-square overflow-hidden"
                  allowFullScreen
                ></iframe>
              </div>
              <div className=" w-1/2 text-gray-800 ">
                <h2>Selected centre Stone</h2>
                <div className="text-lg  font-medium text-gray-800 ">
                  {selectedDiamond?.weight.toFixed(2)}w -{" "}
                  {selectedDiamond?.color} - {selectedDiamond?.clarity}
                </div>
                <div className="text-[10px] text-gray-500 mb-2">
                  {selectedDiamond?.measurements}
                </div>
                <div className="text-sm w-full font-semibold text-gray-800">
                  {currencySymbol}
                  {selectedDiamond?.net}
                </div>
                <div>
                  <h2>Sku : {selectedDiamond?.net}</h2>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 justify-center mb-4">
              {" "}
              {/* Stone 1 */}
              <div
                onClick={() => selectedDim(diamondData[0])}
                className="relative bg-white  w-1/2"
              >
                <Heart className="absolute top-2 right-2 w-4 h-4 text-gray-300" />
                <div className="bg-black/10 mb-3 aspect-square overflow-hidden w-full">
                  <iframe
                    src={diamondData[0]?.video}
                    title={`Video for ${diamondData[0]?._id}`}
                    className="w-full h-full aspect-square overflow-hidden"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="text-center">
                  <div className="text-lg  font-medium text-gray-800 ">
                    {diamondData[0]?.weight.toFixed(2)}w -{" "}
                    {diamondData[0]?.color} - {diamondData[0]?.clarity}
                  </div>
                  <div className="text-[10px] text-gray-500 mb-2">
                    {diamondData[0]?.measurements}
                  </div>
                  <div className="text-sm w-full font-semibold text-gray-800">
                    {currencySymbol}
                    {diamondData[0]?.net}
                  </div>
                </div>
              </div>
              {/* Stone 2 */}
              <div
                onClick={() => selectedDim(diamondData[0])}
                className="relative bg-white  w-1/2"
              >
                <Heart className="absolute top-2 right-2 w-4 h-4 text-gray-300" />
                <div className="bg-black/10 mb-3 aspect-square overflow-hidden w-full">
                  <iframe
                    src={diamondData[1]?.video}
                    title={`Video for ${diamondData[1]?._id}`}
                    className="w-full h-full aspect-square overflow-hidden"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="text-center">
                  <div className="text-lg  font-medium text-gray-800 ">
                    {diamondData[1]?.weight.toFixed(2)}w -{" "}
                    {diamondData[1]?.color} - {diamondData[1]?.clarity}
                  </div>
                  <div className="text-[10px] text-gray-500 mb-2">
                    {diamondData[1]?.measurements}
                  </div>
                  <div className="text-sm w-full font-semibold text-gray-800">
                    {currencySymbol}
                    {diamondData[1]?.net}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View More Options Button */}
          <div className="text-center">
            <button
              onClick={() => {
                setShowDiamond(true);
                handelSelectDiamond(null);
              }}
              className="btn hover:bg-green-900 text-white text-[10px] font-bold px-8 py-3 font-arizona transition-colors"
            >
              VIEW MORE OPTIONS
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}

        {/* Estimated Completion Date */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-5 h-5 border border-gray-400 rounded mr-3 flex items-center justify-center">
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-[10px] font-medium text-gray-800 uppercase tracking-wider">
              ESTIMATED COMPLETION DATE:
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-[10px]  font-medium text-gray-800 mr-2">
              AUGUST 15, 2025
            </span>
            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-white">
              ?
            </div>
          </div>
        </div>

        {/* Features Grid */}
        {/* <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[10px] font-medium text-gray-800 uppercase tracking-wider mb-1">
                LIFETIME WARRANTY
              </h3>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-medium text-gray-800 uppercase tracking-wider mb-1">
                FREE RESIZING
              </h3>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M16 3h5v5M4 20 21 3m0 16v-5h-5M8 20H3v-5" />
              </svg>
            </div>
            <div>
              <h3 className="text-[10px] font-medium text-gray-800 uppercase tracking-wider mb-1">
                EXPRESS & INSURED SHIPPING
              </h3>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[10px] font-medium text-gray-800 uppercase tracking-wider mb-1">
                SHIPPED DISCRETELY
              </h3>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-[10px] font-medium text-gray-800 uppercase tracking-wider mb-1">
                FINANCE AVAILABLE
              </h3>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h3 className="text-[10px] font-medium text-gray-800 uppercase tracking-wider mb-1">
                IN-HOUSE JEWELLERS
              </h3>
            </div>
          </div>
        </div> */}

        {/* Action Buttons */}
        {/* <div className="flex gap-4 mb-6">
          <button className="flex-1 border border-green-700 py-2 px-4 text-[10px] font-medium text-green-700 uppercase tracking-wider hover:bg-gray-50 transition-colors">
            SEND A HINT
          </button>
          <button className="flex-1 border border-green-700 py-2 px-4 text-[10px] font-medium text-green-700 uppercase tracking-wider hover:bg-gray-50 transition-colors">
            MAKE AN ENQUIRY
          </button>
        </div> */}

        {/* Shipping Information */}
        {/* <div className="mb-6">
          <button className="w-full flex items-center justify-between py-3 border-t border-gray-200 text-left">
            <span className="text-[10px] font-medium text-gray-800 uppercase tracking-wider">
              SHIPPING INFORMATION
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div> */}

        {/* Social Share Buttons */}
        {/* <div className="flex gap-4 justify-center">
          <button className="flex items-center px-4 py-2 text-[10px] font-medium text-gray-600 hover:text-gray-800 transition-colors">
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
            Share
          </button>
          <button className="flex items-center px-4 py-2 text-[10px] font-medium text-gray-600 hover:text-gray-800 transition-colors">
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            Tweet
          </button>
          <button className="flex items-center px-4 py-2 text-[10px] font-medium text-gray-600 hover:text-gray-800 transition-colors">
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.739.1.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
            </svg>
            Pin it
          </button>
        </div> */}
      </div>
    </>
  );
};

export default StepTwo;
