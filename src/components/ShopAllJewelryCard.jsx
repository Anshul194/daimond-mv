"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "@/axiosConfig/axiosInstance";

const SHAPE_IMAGE_MAP = {
  "round": "/images/shapes/round.svg",
  "oval": "/images/shapes/oval.svg",
  "cushion": "/images/shapes/cushion.svg",
  "emerald": "/images/shapes/emerald.svg",
  "pear": "/images/shapes/pear.svg",
  "princess": "/images/shapes/princess.svg",
  "radiant": "/images/shapes/radiant.svg",
  "asscher": "/images/shapes/asscher.svg",
  "marquise": "/images/shapes/marquise.svg",
  //  "heart": "/attribute-images/heartshape.jpg",
  "heart": "/images/shapes/heart.svg",
  "elongated_cushion": "/images/shapes/elongated_cushion.svg",
  "elongated_hexagon": "/images/shapes/elongated_hexagon.svg",
};

const getShapeImage = (shapeName) => {
  if (!shapeName) return null;
  const name = shapeName.toString().toLowerCase();
  for (const [key, path] of Object.entries(SHAPE_IMAGE_MAP)) {
    if (name.includes(key)) return path;
  }
  return null;
};

const ShopAllJewelryCard = ({ product }) => {
  const [shapes, setShapes] = useState([]);
  const [metals, setMetals] = useState([]);
  const [carats, setCarats] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(0); // Default to first item
  const [selectedMetalIndex, setSelectedMetalIndex] = useState(1); // Default to second item (14K)
  const [selectedCaratIndex, setSelectedCaratIndex] = useState(0); // Default to first item
  const [shapePage, setShapePage] = useState(0);
  const [metalPage, setMetalPage] = useState(0);
  const [caratPage, setCaratPage] = useState(0);
  const [imageErrors, setImageErrors] = useState({}); // Track which images failed to load

  // Use refs to prevent duplicate API calls
  const fetchRef = useRef(false);
  const abortControllerRef = useRef(null);

  // Extract stable primitive values for dependencies to prevent infinite loops
  const productId = useMemo(() => product?._id ? String(product._id) : null, [product?._id]);
  const categoryIdValue = useMemo(() =>
    product?.category_id?._id
      ? String(product.category_id._id)
      : (product?.category_id ? String(product.category_id) : null),
    [product?.category_id?._id, product?.category_id]
  );

  // Fetch product attributes dynamically
  useEffect(() => {
    const fetchAttributes = async () => {
      // Prevent duplicate calls
      if (fetchRef.current) return;
      fetchRef.current = true;

      try {
        const productData = product?.body?.data || product?.data || product;
        const inventoryDetails = productData?.inventory?.inventory_details || [];

        // 1. Prepare base attributes (fallback)
        let finalShapes = [];
        let finalMetals = [];
        let finalCarats = [];

        // 2. Fetch Global Attributes from Admin
        const attributeTitles = ["Shape", "Metal Type", "carat"];
        const responses = await Promise.all(
          attributeTitles.map((title) => {
            // Fetch by title only to get both category-specific AND global attributes
            const url = `/api/productattribute?filters=${encodeURIComponent(JSON.stringify({ "title": title }))}`;
            return axiosInstance.get(url, { signal: abortControllerRef.current?.signal }).catch(() => null);
          })
        );

        // Parse global responses and prioritize based on category
        const getBestAttributeMatch = (response) => {
          const allAttrs = response?.data?.data?.data || response?.data?.body?.data || [];
          if (allAttrs.length === 0) return [];

          // 1. Try to find match for current category
          if (categoryIdValue) {
            const categoryMatch = allAttrs.find(a =>
              (a.category_id?._id || a.category_id) === categoryIdValue
            );
            if (categoryMatch) return categoryMatch.terms || [];
          }

          // 2. Fallback to global (null category)
          const globalMatch = allAttrs.find(a => !a.category_id);
          if (globalMatch) return globalMatch.terms || [];

          // 3. Fallback to first one found if no matches
          return allAttrs[0]?.terms || [];
        };

        const globalShapes = getBestAttributeMatch(responses[0]);
        const globalMetals = getBestAttributeMatch(responses[1]);
        const globalCarats = getBestAttributeMatch(responses[2]);

        finalShapes = globalShapes.map(t => ({ ...t, value: t.value || t.name, name: t.name || t.value, image: t.image || t.icon }));
        finalMetals = globalMetals.map(t => ({ ...t, value: t.value || t.name, name: t.name || t.value }));
        finalCarats = globalCarats.map(t => ({ ...t, value: t.value || t.name, name: t.name || t.value, numericValue: parseFloat(t.value || 0) }));

        // 3. Extract product-specific attributes and merge if needed
        const productShapeMap = new Map();
        const productMetalMap = new Map();
        const productCaratMap = new Map();

        inventoryDetails.forEach(detail => {
          (detail.attributes || []).forEach(attr => {
            const name = (attr.attribute_name || "").toLowerCase();
            const val = attr.attribute_value || "";
            if (!val) return;

            if (name.includes("shape")) productShapeMap.set(val, { value: val, name: val, image: attr.image || detail.image?.[0] });
            else if (name.includes("metal") || name.includes("color")) productMetalMap.set(val, { value: val, name: val });
            else if (name.includes("carat")) productCaratMap.set(val, { value: val, name: val, numericValue: parseFloat(val) || 0 });
          });
        });

        // 4. Merge Logic: Priority -> Global/Category Attributes (for full list) then Product-Specific (for images/extra values)
        // If we have global/category data, we use that as the primary list as requested "load dynamic from admin"
        if (finalShapes.length === 0) finalShapes = Array.from(productShapeMap.values());
        if (finalMetals.length === 0) finalMetals = Array.from(productMetalMap.values());
        if (finalCarats.length === 0) finalCarats = Array.from(productCaratMap.values());

        // Sort carats numerically
        finalCarats.sort((a, b) => a.numericValue - b.numericValue);

        setShapes(finalShapes);
        setMetals(finalMetals);
        setCarats(finalCarats);

      } catch (error) {
        if (error.name !== 'AbortError') console.error("Error fetching product attributes:", error);
      } finally {
        fetchRef.current = false;
      }
    };

    fetchAttributes();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      fetchRef.current = false;
    };
  }, [productId, categoryIdValue]);

  // Paginate shapes
  const shapesPerPage = 5;
  const currentShapes = shapes.length > 0 ? shapes : Object.keys(SHAPE_IMAGE_MAP).map(key => ({ value: key, name: key }));
  const shapeStartIndex = shapePage * shapesPerPage;
  const displayedShapes = currentShapes.slice(shapeStartIndex, shapeStartIndex + shapesPerPage);
  const hasPrevShapes = shapePage > 0;
  const hasNextShapes = shapeStartIndex + shapesPerPage < currentShapes.length;

  const handleShapePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasPrevShapes) {
      setShapePage(shapePage - 1);
      setSelectedShapeIndex(0);
    }
  };

  const handleShapeNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasNextShapes) {
      setShapePage(shapePage + 1);
      setSelectedShapeIndex(0);
    }
  };

  // Paginate metals
  const metalsPerPage = 4;
  const currentMetals = metals.length > 0 ? metals : [
    { value: "Platinum", name: "PL" },
    { value: "Yellow Gold", name: "YG" },
    { value: "Rose Gold", name: "RG" },
    { value: "14K Gold", name: "14K" }
  ];
  const metalStartIndex = metalPage * metalsPerPage;
  const displayedMetals = currentMetals.slice(metalStartIndex, metalStartIndex + metalsPerPage);
  const hasPrevMetals = metalPage > 0;
  const hasNextMetals = metalStartIndex + metalsPerPage < currentMetals.length;

  const handleMetalPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasPrevMetals) {
      setMetalPage(metalPage - 1);
      setSelectedMetalIndex(0);
    }
  };

  const handleMetalNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasNextMetals) {
      setMetalPage(metalPage + 1);
      setSelectedMetalIndex(0);
    }
  };

  // Get first letter of shape name for display
  const getShapeInitial = (shapeName) => {
    if (!shapeName) return "";
    const name = shapeName.toString().toUpperCase();
    if (name.includes("ROUND")) return "R";
    if (name.includes("OVAL")) return "O";
    if (name.includes("CUSHION")) return "C";
    if (name.includes("EMERALD")) return "E";
    if (name.includes("PEAR")) return "P";
    if (name.includes("PRINCESS")) return "P";
    if (name.includes("RADIANT")) return "R";
    return name.charAt(0);
  };

  // Get metal display text (like "PL", "14K", etc.)
  const getMetalDisplayText = (metalValue) => {
    if (!metalValue) return "";
    const metal = metalValue.toString().toLowerCase();

    // Check for platinum
    if (metal.includes("platinum") || metal.includes("pl")) return "PL";

    // Check for karat values
    const karatMatch = metal.match(/(\d+)\s*k/);
    if (karatMatch) return `${karatMatch[1]}K`;

    // Check for specific metal types
    if (metal.includes("14k") || metal.includes("14 k")) return "14K";
    if (metal.includes("18k") || metal.includes("18 k")) return "18K";
    if (metal.includes("22k") || metal.includes("22 k")) return "22K";

    // Return first 2-3 characters uppercase
    return metal.substring(0, 3).toUpperCase();
  };

  // Get metal color based on metal type (for non-text metals)
  const getMetalColor = (metalValue) => {
    if (!metalValue) return "#e5e5e5";
    const metal = metalValue.toString().toLowerCase();
    if (metal.includes("yellow") || metal.includes("gold")) return "#E5D3A8";
    if (metal.includes("rose")) return "#E6B99D";
    if (metal.includes("white") || metal.includes("platinum") || metal.includes("sterling")) return "#e5e5e5";
    return "#e5e5e5";
  };

  // Check if metal should be displayed as text (most metals should show text)
  const isMetalText = (metalValue) => {
    if (!metalValue) return false;
    const metal = metalValue.toString().toLowerCase();
    // Show text for karat values, platinum, or if it's short enough
    return metal.includes("k") ||
      metal.includes("karat") ||
      metal.includes("platinum") ||
      metal.includes("pl") ||
      metal.length <= 10;
  };

  // Paginate carats (show 4 at a time to match design)
  const caratsPerPage = 4;
  const startIndex = caratPage * caratsPerPage;
  const displayedCarats = carats.slice(startIndex, startIndex + caratsPerPage);
  const hasPrevCarats = caratPage > 0;
  const hasNextCarats = startIndex + caratsPerPage < carats.length;

  const handleCaratPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasPrevCarats) {
      setCaratPage(caratPage - 1);
      setSelectedCaratIndex(0); // Reset to first item when changing page
    }
  };

  const handleCaratNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasNextCarats) {
      setCaratPage(caratPage + 1);
      setSelectedCaratIndex(0); // Reset to first item when changing page
    }
  };

  const AttributeImage = ({ src, alt, className }) => {
    const [currentSrc, setCurrentSrc] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [retryStage, setRetryStage] = useState(0); // 0: Initial/Local, 1: Live, 2: Admin

    useEffect(() => {
      if (!src) return;

      // Determine initial source
      let initialUrl = src;
      if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('blob:')) {
        // Use relative path for local images to work across different ports/hosts
        initialUrl = src.startsWith('/') ? src : `/${src}`;
      }
      setCurrentSrc(initialUrl);
      setHasError(false);
      setRetryStage(0);
    }, [src]);

    const handleError = () => {
      const rawPath = src;
      if (!rawPath) return;

      if (retryStage === 0) {
        // Try Live Domain
        const cleanPath = rawPath.startsWith('http') ? rawPath.split('/').pop() : rawPath;
        setCurrentSrc(`https://diamond.nexprism.in/${cleanPath.replace(/^\//, "")}`);
        setRetryStage(1);
      } else if (retryStage === 1) {
        // Try Admin Domain
        const cleanPath = rawPath.startsWith('http') ? rawPath.split('/').pop() : rawPath;
        setCurrentSrc(`https://diamondadmin.nexprism.in/${cleanPath.replace(/^\//, "")}`);
        setRetryStage(2);
      } else {
        setHasError(true);
      }
    };

    if (hasError || !currentSrc) {
      return (
        <span className="text-[10px] text-gray-700 font-medium">
          {alt}
        </span>
      );
    }

    return (
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        style={{
          filter: (currentSrc || src)?.toLowerCase().endsWith('.svg') ? 'brightness(0)' : 'none',
          imageRendering: 'crisp-edges'
        }}
        onError={handleError}
      />
    );
  };

  return (
    <div className="flex flex-col gap-2 p-2 group hover:bg-gray-50/50 transition-colors rounded-none">
      {/* 1. Image Area (Gray background placeholder as requested) */}
      <div className="relative aspect-square bg-[#FAFAFA] flex items-center justify-center overflow-hidden border border-gray-50 group-hover:border-gray-200 transition-all duration-500">
        {/* Placeholder or Product Image */}
        {product.image?.[0] ? (
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-gray-200 uppercase tracking-widest text-[10px]">Image Placeholder</div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-all duration-500" />
      </div>

      {/* 2. Title */}
      <h3 className="text-[11px] md:text-xs font-medium text-gray-500 mt-4 font-gintoNord tracking-[0.15em] uppercase truncate">
        {product.name || "UNNAMED PIECE"}
      </h3>

      {/* 3. Price */}
      <p className="text-sm md:text-base font-light text-black mt-1 font-arizona tracking-tight">
        ${product.price ? parseFloat(product.price).toLocaleString() : "0.00"}
      </p>

      {/* 4. Selectors Rows (Mocked for UI as per "Vera" design) */}

      {/* Shape Selector */}
      <div className="flex items-center mt-1">
        <span className="text-xs text-gray-500 font-medium w-12 shrink-0">Shape</span>
        <div className="flex items-center gap-1 flex-1">
          <ChevronLeft
            className={`w-4 h-4 cursor-pointer ${hasPrevShapes ? 'text-gray-400 hover:text-gray-600' : 'text-gray-200 cursor-default'}`}
            onClick={hasPrevShapes ? handleShapePrev : undefined}
          />
          <div className="flex items-center gap-2 overflow-hidden flex-1 justify-between">
            {displayedShapes.map((shape, index) => {
              const shapeValue = shape.value || shape.name || "";
              const shapeInitial = getShapeInitial(shapeValue);
              const isSelected = selectedShapeIndex === index;
              const shapeImage = shape.image;

              return (
                <div
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedShapeIndex(index);
                  }}
                  className={`w-6 h-6 md:w-7 md:h-7 border flex items-center justify-center cursor-pointer transition-all duration-300 ${isSelected
                    ? "border-black shadow-sm"
                    : "border-gray-100 hover:border-gray-300 grayscale opacity-40 hover:opacity-100 hover:grayscale-0"
                    }`}
                  title={shapeValue}
                >
                  {shapeImage || getShapeImage(shapeValue) ? (
                    <AttributeImage
                      src={shapeImage || getShapeImage(shapeValue)}
                      alt={shapeInitial}
                      className="w-full h-full object-contain p-1.5"
                    />
                  ) : (
                    <span className="text-[10px] text-gray-700 font-medium">
                      {shapeInitial}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <ChevronRight
            className={`w-4 h-4 cursor-pointer ${hasNextShapes ? 'text-gray-400 hover:text-gray-600' : 'text-gray-200 cursor-default'}`}
            onClick={hasNextShapes ? handleShapeNext : undefined}
          />
        </div>
      </div>

      {/* Metal Selector */}
      <div className="flex items-center mt-2">
        <span className="text-xs text-gray-500 font-medium w-12 shrink-0">Metal</span>
        <div className="flex items-center gap-1 flex-1">
          <ChevronLeft
            className={`w-3.5 h-3.5 cursor-pointer ${hasPrevMetals ? 'text-gray-400 hover:text-gray-600' : 'text-gray-200 cursor-default'}`}
            onClick={hasPrevMetals ? handleMetalPrev : undefined}
          />
          <div className="flex items-center gap-2 flex-1 justify-between overflow-hidden h-7 px-0.5">
            {displayedMetals.map((metal, index) => {
              const metalValue = metal.value || metal.name || "";
              const isSelected = selectedMetalIndex === index;
              const metalColor = getMetalColor(metalValue);
              const showAsText = isMetalText(metalValue);
              const displayText = getMetalDisplayText(metalValue);
              const metalImage = metal.image;

              return (
                <div
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedMetalIndex(index);
                  }}
                  className={`cursor-pointer transition-all duration-300 relative shrink-0 p-[2px] ${isSelected ? "border border-gray-400" : "border border-transparent"}`}
                  title={metalValue}
                >
                  <div
                    className={`w-8 h-5 flex items-center justify-center text-[8px] font-bold tracking-tighter overflow-hidden`}
                    style={!metalImage ? {
                      backgroundColor: metalColor,
                      backgroundImage: metalValue.toLowerCase().includes('yellow') ? 'linear-gradient(135deg, #E5D3A8 0%, #D4C197 100%)' :
                        metalValue.toLowerCase().includes('rose') ? 'linear-gradient(135deg, #E6B99D 0%, #D5A88C 100%)' :
                          'linear-gradient(135deg, #F0F0F0 0%, #E5E5E5 100%)'
                    } : {}}
                  >
                    {metalImage ? (
                      <AttributeImage
                        src={metalImage}
                        alt={displayText}
                        className="w-full h-full object-cover"
                      />
                    ) : showAsText ? (
                      <span className="whitespace-nowrap uppercase text-gray-700">
                        {displayText}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          <ChevronRight
            className={`w-3.5 h-3.5 cursor-pointer ${hasNextMetals ? 'text-gray-400 hover:text-gray-600' : 'text-gray-200 cursor-default'}`}
            onClick={hasNextMetals ? handleMetalNext : undefined}
          />
        </div>
      </div>

      {/* Carat Selector */}
      < div className="flex items-center mt-2" >
        <span className="text-xs text-gray-500 font-medium w-12 shrink-0">Carat</span>
        <div className="flex items-center gap-1">
          <ChevronLeft
            className={`w-3 h-3 cursor-pointer ${hasPrevCarats ? 'text-gray-400 hover:text-gray-600' : 'text-gray-300'}`}
            onClick={hasPrevCarats ? handleCaratPrev : undefined}
          />
          {displayedCarats.length > 0 ? (
            displayedCarats.map((carat, index) => {
              const caratValue = carat.value || carat.name || "";
              // Format display value to handle fractions
              let displayValue = carat.numericValue?.toString() || caratValue;

              // Convert decimals to fractions
              const numValue = parseFloat(displayValue);
              if (!isNaN(numValue)) {
                if (numValue === 0.5) displayValue = "1/2";
                else if (numValue === 1) displayValue = "1";
                else if (numValue === 1.5) displayValue = "1 1/2";
                else if (numValue === 2) displayValue = "2";
                else if (numValue === 2.5) displayValue = "2½";
                else if (numValue === 3) displayValue = "3";
                else if (numValue === 3.5) displayValue = "3½";
                else {
                  // Handle other decimal values
                  const whole = Math.floor(numValue);
                  const fraction = numValue - whole;
                  if (fraction === 0.5) {
                    displayValue = whole > 0 ? `${whole} 1/2` : "1/2";
                  } else {
                    displayValue = numValue.toString();
                  }
                }
              }

              // Check if value already contains fraction notation
              if (caratValue.includes("/") || caratValue.includes("½")) {
                displayValue = caratValue;
              }

              const actualIndex = startIndex + index;
              const isSelected = selectedCaratIndex === index;

              return (
                <div
                  key={actualIndex}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedCaratIndex(index);
                  }}
                  className={`text-[10px] cursor-pointer transition-all uppercase tracking-widest min-w-[20px] flex items-center justify-center h-6 ${isSelected
                    ? "text-black font-bold border border-black px-1.5"
                    : "text-gray-400 hover:text-black px-1.5"
                    }`}
                  title={caratValue}
                >
                  {displayValue}
                </div>
              );
            })
          ) : (
            // Fallback to default static carats if no data
            <>
              {["1/2", "1", "1 1/2", "2"].map((val, idx) => (
                <div
                  key={idx}
                  className={`text-[10px] cursor-pointer transition-all uppercase tracking-widest min-w-[20px] flex items-center justify-center h-6 ${val === "2" ? "text-black font-bold border border-black px-1.5" : "text-gray-400 hover:text-black px-1.5"}`}
                >
                  {val}
                </div>
              ))}
            </>
          )}
          <ChevronRight
            className={`w-4 h-4 ml-auto cursor-pointer ${hasNextCarats ? 'text-gray-400 hover:text-gray-600' : 'text-gray-300'}`}
            onClick={hasNextCarats ? handleCaratNext : undefined}
          />
        </div>
      </div >

    </div >
  );
};

export default ShopAllJewelryCard;
