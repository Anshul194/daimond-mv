"use client";

import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
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

const FilterAttributeImage = ({ src, alt, className }) => {
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

  if (hasError || !currentSrc) return null;

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      style={{ filter: currentSrc.toLowerCase().endsWith('.svg') ? 'brightness(0)' : 'none' }}
    />
  );
};

const FilterModal = ({ isOpen, onClose, onApplyFilters, selectedCategory, totalItems = 0, appliedFilters = {}, excludeCategoryIds = [], includeCategoryIds = [], inline = false }) => {
  const [selectedShape, setSelectedShape] = useState(appliedFilters.shape || "");
  const [selectedMetal, setSelectedMetal] = useState(appliedFilters.metal || "");
  const [selectedStones, setSelectedStones] = useState(appliedFilters.stones || []);
  const [priceRange, setPriceRange] = useState({
    min: appliedFilters.priceMin !== undefined ? appliedFilters.priceMin : 0,
    max: appliedFilters.priceMax !== undefined ? appliedFilters.priceMax : 200000
  });
  const [selectedCarats, setSelectedCarats] = useState(appliedFilters.carats || []);

  const [shapeData, setShapeData] = useState([]);
  const [metalData, setMetalData] = useState([]);
  const [stoneData, setStoneData] = useState([]);
  const [caratData, setCaratData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredCount, setFilteredCount] = useState(totalItems);
  const [loadingCount, setLoadingCount] = useState(false);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/filters/config");
      const { data } = response.data;

      const mapTerms = (terms) => {
        if (!terms || !Array.isArray(terms)) return [];
        return terms.map((t) => ({
          value: t.value || t.name || t,
          name: t.name || t.value || t,
          _id: t._id || t.id || null,
          image: t.image || t.icon || t.imageUrl || ""
        }));
      };

      setShapeData(mapTerms(data.shapes));
      setMetalData(mapTerms(data.metals));
      setCaratData(mapTerms(data.carats));

      const mappedStones = mapTerms(data.stones);
      setStoneData(mappedStones.length > 0 ? mappedStones : [
        { value: "Diamond", name: "Diamond" },
        { value: "Color Diamond", name: "Color Diamond" },
        { value: "Gemstone", name: "Gemstone" }
      ]);
    } catch (error) {
      console.error("Error fetching filter config:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedShape(appliedFilters.shape || "");
      setSelectedMetal(appliedFilters.metal || "");
      setSelectedStones(appliedFilters.stones || []);
      setPriceRange({
        min: appliedFilters.priceMin !== undefined ? appliedFilters.priceMin : 0,
        max: appliedFilters.priceMax !== undefined ? appliedFilters.priceMax : 200000
      });
      setSelectedCarats(appliedFilters.carats || []);
      setFilteredCount(totalItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, JSON.stringify(appliedFilters), totalItems]);

  const fetchFilteredCount = async () => {
    setLoadingCount(true);
    try {
      const params = new URLSearchParams();

      const attributeFilter = [];
      if (selectedShape) attributeFilter.push(selectedShape);
      if (selectedMetal) attributeFilter.push(selectedMetal);
      if (selectedStones && selectedStones.length > 0) attributeFilter.push(...selectedStones);

      if (includeCategoryIds && includeCategoryIds.length > 0) {
        params.append("include_category_ids", includeCategoryIds.join(","));
      } else if (selectedCategory) {
        params.append("include_category_ids", selectedCategory);
      }

      if (excludeCategoryIds && excludeCategoryIds.length > 0) {
        params.append("exclude_category_ids", excludeCategoryIds.join(","));
      }

      if (attributeFilter.length > 0) {
        params.append("attribute_filters", attributeFilter.join(","));
      }

      if (priceRange.min > 0) params.append("price_min", priceRange.min);
      if (priceRange.max < 200000) params.append("price_max", priceRange.max);

      if (selectedCarats && selectedCarats.length > 0) attributeFilter.push(...selectedCarats);

      params.append("in_stock", "yes");

      const response = await axiosInstance.get("/api/product", { params });

      const count = response.data?.body?.data?.total ||
        response.data?.body?.total ||
        response.data?.data?.total ||
        0;

      setFilteredCount(count);
    } catch (error) {
      console.error("Error fetching filtered count:", error);
      setFilteredCount(totalItems);
    } finally {
      setLoadingCount(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAttributes();
      if (!inline) document.body.style.overflow = 'hidden';
    } else {
      if (!inline) document.body.style.overflow = '';
    }

    return () => {
      if (!inline) document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedCategory, inline]);

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        fetchFilteredCount();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedShape, selectedMetal, selectedStones, priceRange, selectedCarats, selectedCategory]);

  const handleStoneToggle = (stone) => {
    setSelectedStones((prev) =>
      prev.includes(stone)
        ? prev.filter((s) => s !== stone)
        : [...prev, stone]
    );
  };

  const handleReset = () => {
    setSelectedShape("");
    setSelectedMetal("");
    setSelectedStones([]);
    setPriceRange({ min: 0, max: 200000 });
    setCaratRange([]);
  };

  const handleApply = () => {
    const filters = {
      shape: selectedShape,
      metal: selectedMetal,
      stones: selectedStones,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      carats: selectedCarats,
    };
    onApplyFilters(filters);
    onClose();
  };

  const getTotalFilters = () => {
    let count = 0;
    if (selectedShape) count++;
    if (selectedMetal) count++;
    if (selectedStones.length > 0) count++;
    if (priceRange.min > 0 || priceRange.max < 200000) count++;
    if (selectedCarats.length > 0) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className={`${inline ? 'w-full bg-white mb-8' : 'fixed inset-0 bg-white z-[100] overflow-y-auto'} flex flex-col font-gintoNord selection:bg-black selection:text-white`}>
      {/* Header */}
      <div className={`${inline ? 'px-0 py-4 border-none' : 'sticky top-0 bg-white border-b border-gray-100 px-6 md:px-12 py-6'} flex items-center justify-between z-10`}>
        {inline ? null : (
          <div className="flex items-center gap-8">
            <h2 className="text-2xl md:text-3xl font-arizona font-light tracking-tight text-black">Filters</h2>
            <button
              onClick={handleReset}
              className="text-xs md:text-sm text-gray-500 hover:text-black font-medium tracking-widest uppercase transition-colors"
            >
              Clear All {getTotalFilters() > 0 && `(${getTotalFilters()})`}
            </button>
          </div>
        )}

        {inline ? (
          <div className="w-full flex justify-end gap-6 mb-4">
            <button
              onClick={handleReset}
              className="text-sm text-black hover:opacity-70 font-bold tracking-[0.1em] uppercase transition-opacity underline underline-offset-8"
            >
              RESET
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-50 rounded-full transition-all group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-black" />
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-50 rounded-full transition-all group"
          >
            <X className="w-6 h-6 text-gray-400 group-hover:text-black" />
          </button>
        )}
      </div>

      {/* Filter Content */}
      <div className={`flex-1 w-full ${inline ? 'px-0 py-6' : 'max-w-[1400px] mx-auto px-6 md:px-12 py-12'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Shape Filter */}
          {shapeData.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-black uppercase tracking-wider">Shape</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {shapeData.map((shape, index) => {
                  const shapeImage = shape.image || getShapeImage(shape.value);
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedShape(selectedShape === shape.value ? "" : shape.value)}
                      className="flex items-center gap-3 group text-left py-1"
                    >
                      <div className={`w-5 h-5 flex-shrink-0 border flex items-center justify-center transition-colors rounded ${selectedShape === shape.value ? 'bg-black border-black' : 'border-gray-300'
                        }`}>
                        {selectedShape === shape.value && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <div className="flex items-center gap-2">
                        {shapeImage && (
                          <FilterAttributeImage
                            src={shapeImage}
                            alt={shape.value}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span className={`text-base font-medium uppercase tracking-tight ${selectedShape === shape.value ? 'text-black font-bold' : 'text-black'}`}>
                          {shape.value}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metal Filter */}
          {metalData.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-black uppercase tracking-wider">Metal</h3>
              <div className="space-y-3">
                {metalData.map((metal, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMetal(selectedMetal === metal.value ? "" : metal.value)}
                    className="flex items-center gap-3 group w-full text-left py-1"
                  >
                    <div className={`w-5 h-5 flex-shrink-0 border flex items-center justify-center transition-colors rounded ${selectedMetal === metal.value ? 'bg-black border-black' : 'border-gray-300'
                      }`}>
                      {selectedMetal === metal.value && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border border-gray-200"
                        style={{
                          backgroundColor:
                            metal.value?.toLowerCase().includes("yellow") ? "#F5E6C8" :
                              metal.value?.toLowerCase().includes("rose") ? "#EAC8B9" :
                                metal.value?.toLowerCase().includes("white") ? "#F0F0F0" :
                                  metal.value?.toLowerCase().includes("platinum") ? "#E5E4E2" : "#F5F5F5"
                        }}
                      />
                      <span className="text-base font-medium text-black uppercase tracking-tight">{metal.value}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stone Filter */}
          {stoneData.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-black uppercase tracking-wider">Stone</h3>
              <div className="space-y-3">
                {stoneData.map((stone, index) => (
                  <button
                    key={index}
                    onClick={() => handleStoneToggle(stone.value)}
                    className="flex items-center gap-3 group w-full text-left py-1"
                  >
                    <div className={`w-5 h-5 flex-shrink-0 border flex items-center justify-center transition-colors rounded ${selectedStones.includes(stone.value) ? 'bg-black border-black' : 'border-gray-300'
                      }`}>
                      {selectedStones.includes(stone.value) && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-base font-medium text-black uppercase tracking-tight">{stone.value}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price & Carat Ranges */}
          <div className="space-y-8">
            {/* Price Range */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-black uppercase tracking-wider">Price</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={`$${priceRange.min.toLocaleString()}`}
                      readOnly
                      className="w-full px-3 py-3 border-2 border-black text-lg font-bold text-black focus:outline-none bg-white"
                    />
                  </div>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={`$${priceRange.max.toLocaleString()}`}
                      readOnly
                      className="w-full px-3 py-3 border-2 border-black text-lg font-bold text-black text-right focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="relative h-1 px-1 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Math.min(parseInt(e.target.value), priceRange.max) })}
                    className="absolute inset-0 w-full h-1 bg-transparent appearance-none pointer-events-none z-20 top-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-black"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Math.max(parseInt(e.target.value), priceRange.min) })}
                    className="absolute inset-0 w-full h-1 bg-transparent appearance-none pointer-events-none z-20 top-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-black"
                  />
                  <div className="absolute inset-x-0 top-0 h-1 bg-gray-200 rounded-full" />
                  <div
                    className="absolute top-0 h-1 bg-black rounded-full"
                    style={{
                      left: `${(priceRange.min / 200000) * 100}%`,
                      width: `${((priceRange.max - priceRange.min) / 200000) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Carat Filter */}
            {caratData.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-black uppercase tracking-wider">Carat</h3>
                <div className="space-y-3">
                  {caratData.map((carat, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedCarats((prev) =>
                          prev.includes(carat.value)
                            ? prev.filter((c) => c !== carat.value)
                            : [...prev, carat.value]
                        );
                      }}
                      className="flex items-center gap-3 group w-full text-left py-1"
                    >
                      <div className={`w-5 h-5 flex-shrink-0 border flex items-center justify-center transition-colors rounded ${selectedCarats.includes(carat.value) ? 'bg-black border-black' : 'border-gray-300'
                        }`}>
                        {selectedCarats.includes(carat.value) && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-base font-medium text-black uppercase tracking-tight">{carat.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer sticky action */}
      <div className={`${inline ? 'mt-8 flex justify-center' : 'sticky bottom-0 bg-white border-t border-gray-100 py-6 md:py-8 px-6 flex justify-center z-10'}`}>
        <button
          onClick={handleApply}
          disabled={loadingCount}
          className={`${inline ? 'w-auto px-16 border border-black text-black bg-white hover:bg-black hover:text-white' : 'w-full max-w-2xl bg-black text-white hover:bg-gray-900'} py-4 md:py-4 rounded-none font-bold text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loadingCount ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Updating...</span>
            </div>
          ) : (
            `View Results (${filteredCount > 0 ? filteredCount.toLocaleString() : "0"})`
          )}
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
