import React from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const ShopAllJewelryCard = ({ product }) => {
  // Placeholder data for the selectors - as requested by design to "match" the screenshot
  // functionalities will be mocked for UI
  const shapes = [
    { name: "Round", icon: "●" }, // Replace with actual SVGs later if available
    { name: "Oval", icon: "⬭" },
    { name: "Cushion", icon: "▢" },
    { name: "Emerald", icon: "▭" },
    { name: "Pear", icon: "⬡" }, // approximation
  ];

  return (
    <div className="flex flex-col gap-2 p-2 group hover:bg-gray-50/50 transition-colors rounded-none">
      {/* 1. Image Area (Gray background placeholder as requested) */}
      <div className="relative aspect-square bg-[#f7f7f7] flex items-center justify-center overflow-hidden">
        {/* Placeholder or Product Image */}
        {product.image?.[0] ? (
            <img 
                src={product.image[0]} 
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
            />
        ) : (
            <div className="text-gray-300">Image Placeholder</div>
        )}
      </div>

      {/* 2. Title */}
      <h3 className="text-sm font-light text-gray-900 mt-2 font-gintoNord">
        {product.name || "Product Name"}
      </h3>

      {/* 3. Price */}
      <p className="text-sm font-semibold text-gray-900 font-gintoNormal">
        ${product.price || "0.00"}
      </p>

      {/* 4. Selectors Rows (Mocked for UI as per "Vera" design) */}
      
      {/* Shape Selector */}
      <div className="flex items-center mt-1">
        <span className="text-xs text-gray-500 font-medium w-12 shrink-0">Shape</span>
        <div className="flex items-center gap-3 overflow-hidden">
           {/* Mock shapes */}
           <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-500 cursor-pointer hover:border-black">R</div>
           <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] text-black cursor-pointer font-bold bg-white">O</div>
           <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-500 cursor-pointer hover:border-black">C</div>
           <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-500 cursor-pointer hover:border-black">E</div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto cursor-pointer" />
      </div>

      {/* Metal Selector */}
      <div className="flex items-center mt-2">
        <span className="text-xs text-gray-500 font-medium w-12 shrink-0">Metal</span>
        <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-200 cursor-pointer border border-transparent hover:border-gray-400"></div>
            <div className="w-auto px-1 h-5 rounded-sm bg-[#E5D3A8] border border-gray-300 flex items-center justify-center text-[9px] font-bold text-black ring-1 ring-offset-1 ring-gray-400 cursor-pointer">14K</div>
            <div className="w-5 h-5 rounded-full bg-[#E6B99D] cursor-pointer border border-transparent hover:border-gray-400"></div>
            <div className="w-5 h-5 rounded-full bg-[#f0f0f0] cursor-pointer border border-transparent hover:border-gray-400"></div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto cursor-pointer" />
      </div>

      {/* Carat Selector */}
      <div className="flex items-center mt-2">
        <span className="text-xs text-gray-500 font-medium w-12 shrink-0">Carat</span>
        <div className="flex items-center gap-1">
            <ChevronLeft className="w-3 h-3 text-gray-400 cursor-pointer" />
            <div className="border border-black px-2 py-0.5 text-xs font-medium min-w-[30px] text-center bg-white cursor-pointer">2</div>
            <div className=" text-gray-500 px-1 text-xs cursor-pointer hover:text-black">2½</div>
            <div className=" text-gray-500 px-1 text-xs cursor-pointer hover:text-black">3</div>
            {/* <div className=" text-gray-500 px-1 text-xs cursor-pointer hover:text-black">3½</div> */}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto cursor-pointer" />
      </div>

    </div>
  );
};

export default ShopAllJewelryCard;
