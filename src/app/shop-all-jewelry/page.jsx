"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchProductsByCategory, getMoreProducts } from "@/store/slices/product";
import RingsGrid from "@/components/RingGrid";
import ShopAllJewelryCard from "@/components/ShopAllJewelryCard";
import Link from "next/link";
import { Menu, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import axiosInstance from "@/axiosConfig/axiosInstance";
import FilterModal from "@/components/FilterModal";

const ShopAllJewelry = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState(""); // e.g., "price_asc", "price_desc", "name_asc"
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const sortDropdownRef = useRef(null);
  const observerTarget = useRef(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Category IDs to exclude (can be configured)
  const excludeCategoryIds = [64, 65, 66]; // Example: exclude these category IDs

  // Default category IDs to include when viewing "shop-all-jewelry" (all categories)
  // These are the IDs of the display categories (Engagement Rings, Wedding Rings, etc.)
  const defaultIncludeCategoryIds = [1, 16, 35, 41, 47, 67, 84, 91]; // Example default categories

  // Sort options
  const sortOptions = [
    { value: "best_sellers", label: "Best Sellers" },
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: Low To High" },
    { value: "price_desc", label: "Price: High To Low" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortDropdown]);

  const handleSortSelect = (value) => {
    setSortBy(value);
    setShowSortDropdown(false);
  };

  const [displayCategories, setDisplayCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const scrollContainerRef = React.useRef(null);
  const categoriesInitialized = useRef(false);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Redux State
  const { data: categories, status: categoryStatus } = useSelector(
    (state) => state.category
  );

  const { items: products, pagination, loading: productsLoading } = useSelector(
    (state) => state.product
  );

  // Initial Fetch - Categories & Subcategories
  useEffect(() => {
    const initData = async () => {
      setLoadingCategories(true);

      // Fetch categories directly to ensure we have them
      let currentCats = [];
      try {
        const catResponse = await axiosInstance.get('/api/category');
        currentCats = catResponse.data?.body?.data?.result || catResponse.data?.data?.result || [];
        // // console.log('Direct fetch - categories count:', currentCats.length);
      } catch (e) {
        // // console.error('Failed to fetch categories directly', e);
        // Fallback to Redux if direct fetch fails
        if (categoryStatus === "idle" || categories.length === 0) {
          await dispatch(fetchCategories());
        }
        currentCats = categories;
      }

      // Fetch subcategories from all main categories (Man, Women, etc.)
      // This is where Engagement Rings, Wedding Rings, etc. are likely stored
      let subCats = [];
      try {
        // Fetch subcategories from each main category
        for (const mainCat of currentCats) {
          if (mainCat._id) {
            try {
              // // console.log(`Fetching subcategories for "${mainCat.name}" (ID: ${mainCat._id})`);
              const res = await axiosInstance.get(
                `/api/category/subcategory?categoryId=${mainCat._id}`
              );
              const fetched = res.data?.data || res.data?.body?.data || [];
              if (fetched.length > 0) {
                // // console.log(`Found ${fetched.length} subcategories under "${mainCat.name}"`);
                // Add parent category info to subcategories
                const subCatsWithParent = fetched.map(sub => ({
                  ...sub,
                  parentCategoryName: mainCat.name,
                  parentCategoryId: mainCat._id
                }));
                subCats = [...subCats, ...subCatsWithParent];

                // Also check for nested subcategories (sub-subcategories)
                for (const subCat of fetched) {
                  if (subCat._id) {
                    try {
                      const nestedRes = await axiosInstance.get(
                        `/api/category/subcategory?categoryId=${subCat._id}`
                      );
                      const nested = nestedRes.data?.data || nestedRes.data?.body?.data || [];
                      if (nested.length > 0) {
                        // // console.log(`Found ${nested.length} nested subcategories under "${subCat.name}"`);
                        const nestedWithParent = nested.map(n => ({
                          ...n,
                          parentCategoryName: mainCat.name,
                          parentCategoryId: mainCat._id,
                          grandParentName: subCat.name
                        }));
                        subCats = [...subCats, ...nestedWithParent];
                      }
                    } catch (e) {
                      // No nested subcategories, that's fine
                    }
                  }
                }
              }
            } catch (err) {
              // // console.warn(`Failed to fetch subcategories for "${mainCat.name}":`, err);
            }
          }
        }

        // // console.log('Total subcategories found:', subCats.length);
        // // console.log('Subcategory details:', subCats.map(s => ({
        //   name: s.name,
        //   _id: s._id,
        //   slug: s.slug,
        //   parent: s.parentCategoryName
        // })));
      } catch (err) {
        // // console.error("Error fetching subcategories", err);
      }

      setLoadingCategories(false);

      // Build the target list
      // Desired: Engagement Rings, Wedding Rings, Rings, Earrings, Bracelets, Necklaces, Men's Jewelry
      const targetNames = [
        "Engagement Rings",
        "Wedding Rings",
        "Rings",
        "Earrings",
        "Bracelets",
        "Necklaces",
        "Men's Jewelry"
      ];

      // Use the categories we fetched above
      const combinedSource = [...currentCats, ...subCats];

      // Log all available categories for debugging
      // // console.log('All categories:', currentCats.map(c => ({
      //   name: c.name,
      //   _id: c._id,
      //   slug: c.slug
      // })));
      // // // console.log('All subcategories:', subCats.map(c => ({
      //   name: c.name,
      //   _id: c._id,
      //   slug: c.slug
      // })));
      // // // console.log('Combined source count:', combinedSource.length);
      // // // console.log('Looking for:', targetNames);

      const mappedCats = targetNames.map(name => {
        // Try multiple matching strategies
        let match = null;

        // Define search terms for each category
        const searchTerms = {
          "Engagement Rings": ["engagement ring", "engagement", "engagement rings"],
          "Wedding Rings": ["wedding ring", "wedding", "wedding rings"],
          "Rings": ["ring", "rings", "band", "bands"],
          "Earrings": ["earring", "earrings", "ear ring", "ear rings"],
          "Bracelets": ["bracelet", "bracelets", "bangle", "bangles"],
          "Necklaces": ["necklace", "necklaces", "chain", "chains", "pendant", "pendants", "choker"],
          "Men's Jewelry": ["men", "mens", "men's", "men's jewelry", "mens jewelry"]
        };

        const terms = searchTerms[name] || [name.toLowerCase()];

        // Strategy 1: Exact match (case insensitive, trimmed)
        match = combinedSource.find(c => {
          if (!c.name) return false;
          const catName = c.name.toLowerCase().trim();
          return terms.some(term => catName === term);
        });

        // Strategy 2: Contains match (more flexible)
        if (!match) {
          match = combinedSource.find(c => {
            if (!c.name) return false;
            const catName = c.name.toLowerCase();
            return terms.some(term =>
              catName.includes(term) || term.includes(catName)
            );
          });
        }

        // Strategy 3: Word boundary match (matches whole words)
        if (!match) {
          match = combinedSource.find(c => {
            if (!c.name) return false;
            const catName = c.name.toLowerCase();
            return terms.some(term => {
              const regex = new RegExp(`\\b${term}\\b`, 'i');
              return regex.test(catName);
            });
          });
        }

        // Strategy 4: Slug match
        if (!match && combinedSource.some(c => c.slug)) {
          match = combinedSource.find(c => {
            if (!c.slug && !c.name) return false;
            const slug = (c.slug || c.name || '').toLowerCase();
            return terms.some(term => slug.includes(term));
          });
        }

        // Strategy 5: Special fuzzy matching for specific categories
        if (!match) {
          if (name === "Engagement Rings") {
            match = combinedSource.find(c =>
              c.name?.toLowerCase().match(/engagement|diamond.*ring|ring.*diamond/)
            );
          } else if (name === "Wedding Rings") {
            match = combinedSource.find(c =>
              c.name?.toLowerCase().match(/wedding|band|marriage/)
            );
          } else if (name === "Rings") {
            // Find rings that aren't engagement or wedding
            match = combinedSource.find(c => {
              const catName = c.name?.toLowerCase() || '';
              return catName.includes('ring') &&
                !catName.includes('engagement') &&
                !catName.includes('wedding');
            });
          } else if (name === "Earrings") {
            match = combinedSource.find(c =>
              c.name?.toLowerCase().match(/ear|stud|hoop/)
            );
          } else if (name === "Bracelets") {
            match = combinedSource.find(c =>
              c.name?.toLowerCase().match(/bracelet|bangle|wrist/)
            );
          } else if (name === "Necklaces") {
            match = combinedSource.find(c =>
              c.name?.toLowerCase().match(/necklace|chain|pendant|choker/)
            );
          } else if (name === "Men's Jewelry") {
            // Match to "Man" category, not "Women"
            match = combinedSource.find(c =>
              c.name?.toLowerCase() === 'man' ||
              c.name?.toLowerCase() === "men" ||
              c.name?.toLowerCase().includes("men's")
            );
          }
        }

        if (!match) {
          // // // console.warn(`Could not find category match for: "${name}"`);
          // // // console.log('Available categories:', combinedSource.map(c => c.name).filter(Boolean));
        } else {
          // // // console.log(`✅ Matched "${name}" to: "${match.name}" (ID: ${match._id})`);
        }

        return {
          name: name,
          _id: match?._id || null, // If null, maybe disable click or show all?
          image: match?.image || match?.coverImage || "/images/fallback.webp", // specific fallback?
          isSubCategory: subCats.some(sc => sc._id === match?._id) // Track if it's a subcategory
          // Note: We might want specific images for these if the API images aren't great
        };
      });

      setDisplayCategories(mappedCats);

      // Log the mapped categories for debugging
      // // // console.log('Mapped categories:', mappedCats);
    };

    // Only run when categories are actually loaded, and only once
    if ((categoryStatus === "succeeded" || categories.length > 0) && !categoriesInitialized.current) {
      categoriesInitialized.current = true;
      initData();
    } else if (categoryStatus === "idle" && !categoriesInitialized.current) {
      // Trigger fetch if not started
      dispatch(fetchCategories());
    }
  }, [dispatch, categoryStatus, categories]);

  // Handler for applying filters from modal
  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  // Handler for removing individual filters
  const handleRemoveFilter = (filterType) => {
    const newFilters = { ...appliedFilters };

    if (filterType === 'inStock') {
      setInStockOnly(false);
    } else if (filterType === 'shape') {
      delete newFilters.shape;
    } else if (filterType === 'metal') {
      delete newFilters.metal;
    } else if (filterType === 'stones') {
      delete newFilters.stones;
    } else if (filterType === 'price') {
      delete newFilters.priceMin;
      delete newFilters.priceMax;
    } else if (filterType === 'carat') {
      delete newFilters.caratMin;
      delete newFilters.caratMax;
    }

    setAppliedFilters(newFilters);
    setCurrentPage(1);
  };

  // Handler for resetting all filters
  const handleResetAllFilters = () => {
    setAppliedFilters({});
    setInStockOnly(false);
    setCurrentPage(1);
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (inStockOnly) count++;
    if (appliedFilters.shape) count++;
    if (appliedFilters.metal) count++;
    if (appliedFilters.stones && appliedFilters.stones.length > 0) count++;
    if (appliedFilters.priceMin !== undefined || appliedFilters.priceMax !== undefined) count++;
    if (appliedFilters.caratMin !== undefined || appliedFilters.caratMax !== undefined) count++;
    return count;
  };

  // Memoize the selected category info to avoid unnecessary recalculations
  const isSubCategory = useMemo(() => {
    if (!selectedCategory || displayCategories.length === 0) return false;
    const selectedCat = displayCategories.find(c => c._id === selectedCategory);
    return selectedCat?.isSubCategory || false;
  }, [selectedCategory, displayCategories]);

  // Memoize appliedFilters to prevent unnecessary re-renders
  const appliedFiltersString = useMemo(() => {
    return JSON.stringify(appliedFilters);
  }, [appliedFilters]);

  // Fetch Products when Category Changes or on Initial Load
  useEffect(() => {
    setCurrentPage(1);

    const includeCategoryIds = selectedCategory
      ? [selectedCategory]
      : undefined;

    const fetchParams = {
      categoryId: selectedCategory || null, // null means fetch all products
      subCategory: isSubCategory ? selectedCategory : null, // Use subCategory_id if it's a subcategory
      includeCategoryIds: includeCategoryIds, // Array of category IDs to include
      excludeCategoryIds: excludeCategoryIds.length > 0 ? excludeCategoryIds : undefined, // Array of category IDs to exclude
      page: 1,
      limit: 20, // Increased limit for better UX
      sort: sortBy || undefined, // Add sort parameter
    };

    // Add in-stock filter
    if (inStockOnly) {
      fetchParams.inStock = true;
    }

    // Add attribute filters (shape, metal, stones)
    const attributeFilter = [];
    if (appliedFilters.shape) {
      attributeFilter.push(appliedFilters.shape);
    }
    if (appliedFilters.metal) {
      attributeFilter.push(appliedFilters.metal);
    }
    if (appliedFilters.stones && appliedFilters.stones.length > 0) {
      attributeFilter.push(...appliedFilters.stones);
    }
    if (attributeFilter.length > 0) {
      fetchParams.attributeFilter = attributeFilter;
    }

    // Add price range filters
    if (appliedFilters.priceMin !== undefined) {
      fetchParams.priceMin = appliedFilters.priceMin;
    }
    if (appliedFilters.priceMax !== undefined) {
      fetchParams.priceMax = appliedFilters.priceMax;
    }

    // Add carat range filters
    if (appliedFilters.caratMin !== undefined) {
      fetchParams.caratMin = appliedFilters.caratMin;
    }
    if (appliedFilters.caratMax !== undefined) {
      fetchParams.caratMax = appliedFilters.caratMax;
    }

    // Clear categoryId if it's a subcategory (to avoid conflicts)
    if (isSubCategory) {
      fetchParams.categoryId = null;
    }

    // // // console.log('Fetching products with params:', fetchParams);
    // Fetch products - if selectedCategory is null, fetch all products
    dispatch(fetchProductsByCategory(fetchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedCategory, isSubCategory, inStockOnly, sortBy, appliedFiltersString]);

  // Handle page transition curtain
  useEffect(() => {
    if (!productsLoading) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("__page-data-ready"));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [productsLoading]);

  // Note: Initial fetch is handled by the useEffect above when selectedCategory is null

  const handleCategoryClick = (categoryId, categoryName) => {
    if (!categoryId) {
      // // console.warn(`Category "${categoryName}" has no ID and cannot be filtered`);
      return; // Prevent clicking items with no ID
    }
    // // console.log(`Category clicked: ${categoryName} (ID: ${categoryId})`);
    // Always set the selected category (don't toggle off)
    setSelectedCategory(categoryId);
  };

  const handlePageChange = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    // Check if selected category is a subcategory
    const selectedCat = displayCategories.find(c => c._id === selectedCategory);
    const isSubCategoryLocal = selectedCat?.isSubCategory || false;

    // Build include category IDs array
    const includeCategoryIdsLocal = selectedCategory
      ? [selectedCategory]
      : undefined;

    const fetchParams = {
      categoryId: selectedCategory || null,
      subCategory: isSubCategoryLocal ? selectedCategory : null,
      includeCategoryIds: includeCategoryIdsLocal,
      excludeCategoryIds: excludeCategoryIds.length > 0 ? excludeCategoryIds : undefined,
      page: nextPage,
      limit: 20,
      sort: sortBy || undefined,
    };

    // Add in-stock filter if enabled
    if (inStockOnly) {
      fetchParams.inStock = true;
    }

    // Add attribute filters (shape, metal, stones)
    const attributeFilter = [];
    if (appliedFilters.shape) {
      attributeFilter.push(appliedFilters.shape);
    }
    if (appliedFilters.metal) {
      attributeFilter.push(appliedFilters.metal);
    }
    if (appliedFilters.stones && appliedFilters.stones.length > 0) {
      attributeFilter.push(...appliedFilters.stones);
    }
    if (attributeFilter.length > 0) {
      fetchParams.attributeFilter = attributeFilter;
    }

    // Add price range filters
    if (appliedFilters.priceMin !== undefined) {
      fetchParams.priceMin = appliedFilters.priceMin;
    }
    if (appliedFilters.priceMax !== undefined) {
      fetchParams.priceMax = appliedFilters.priceMax;
    }

    // Add carat range filters
    if (appliedFilters.caratMin !== undefined) {
      fetchParams.caratMin = appliedFilters.caratMin;
    }
    if (appliedFilters.caratMax !== undefined) {
      fetchParams.caratMax = appliedFilters.caratMax;
    }

    // Clear categoryId if it's a subcategory (to avoid conflicts)
    if (isSubCategoryLocal) {
      fetchParams.categoryId = null;
    }

    dispatch(getMoreProducts(fetchParams));
  };

  // Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination?.totalPages > currentPage && !productsLoading && !isFetchingMore) {
          setIsFetchingMore(true);
          handlePageChange();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [pagination?.totalPages, currentPage, productsLoading, isFetchingMore]);

  // Reset isFetchingMore when product count changes or loading stops
  useEffect(() => {
    if (!productsLoading) {
      setIsFetchingMore(false);
    }
  }, [productsLoading, products.length]);

  return (
    <div className="bg-white min-h-screen pb-12 font-gintoNord selection:bg-black selection:text-white">
      {/* 1. Header Title */}
      <div className="pt-12 pb-8 text-center px-4">
        <h1 className="text-5xl md:text-6xl text-[#1f2937] font-arizona font-light tracking-tight">
          Shop All Jewelry
        </h1>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm md:text-base font-light">
          Discover our curated collection of extraordinary lab-grown diamond jewelry, crafted with precision and passion.
        </p>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 py-4 md:py-8 relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all md:hidden block"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all md:hidden block"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto p-2 gap-2 justify-start lg:justify-center md:gap-8 pb-4 scrollbar-hide flex-nowrap scroll-smooth"
        >
          {displayCategories.map((cat, index) => (
            <div
              key={cat._id || index}
              onClick={() => handleCategoryClick(cat._id, cat.name)}
              className={`flex-shrink-0 flex flex-col items-center justify-start lg:justify-center gap-3 cursor-pointer group w-[100px] md:min-w-[120px] transition-all
                ${cat._id ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}
              `}
            >
              <div
                className={`w-20 h-20 md:w-36 md:h-36 bg-gray-50 flex items-center justify-center transition-all duration-300 relative border-2
                  ${selectedCategory === cat._id ? 'bg-gray-100 border-black' : 'border-transparent group-hover:bg-gray-100 group-hover:border-gray-300'}
                `}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover mix-blend-multiply p-2 md:p-4"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-500">No img</div>
                )}
                {
                  !cat._id && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      {/* Optional: Indicator for non-clickable/unavailable category */}
                    </div>
                  )
                }
              </div>
              <span className={`text-[10px] md:text-sm font-medium tracking-wide text-nowrap text-center 
                 ${selectedCategory === cat._id ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}
              `}>
                {cat.name}
                {!cat._id && <span className="text-[8px] text-red-400 block">(No ID)</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Items Count & Selected Category */}
      <div className="text-center pb-4">
        <p className="text-sm text-gray-500">
          {selectedCategory
            ? `${pagination?.totalItems || 0} ${displayCategories.find(c => c._id === selectedCategory)?.name || 'Items'}`
            : `${pagination?.totalItems || 0} Items`
          }
        </p>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Active Filters Bar */}
      {(inStockOnly || getActiveFiltersCount() > 0) && (
        <div className="max-w-[1700px] mx-auto px-4 md:px-8 mb-4 flex items-center gap-2 flex-wrap">
          {inStockOnly && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
              <span>In-Stock</span>
              <button
                onClick={() => setInStockOnly(false)}
                className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {appliedFilters.shape && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
              <span>Shape: {appliedFilters.shape}</span>
              <button
                onClick={() => handleRemoveFilter('shape')}
                className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {appliedFilters.metal && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
              <span>Metal: {appliedFilters.metal}</span>
              <button
                onClick={() => handleRemoveFilter('metal')}
                className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {appliedFilters.stones && appliedFilters.stones.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
              <span>Stone: {appliedFilters.stones.join(', ')}</span>
              <button
                onClick={() => handleRemoveFilter('stones')}
                className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {(appliedFilters.priceMin !== undefined || appliedFilters.priceMax !== undefined) && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
              <span>
                Price: ${(appliedFilters.priceMin || 0).toLocaleString()} - ${(appliedFilters.priceMax || 200000).toLocaleString()}
              </span>
              <button
                onClick={() => handleRemoveFilter('price')}
                className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {(appliedFilters.caratMin !== undefined || appliedFilters.caratMax !== undefined) && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
              <span>
                Carat: {appliedFilters.caratMin || 0} - {appliedFilters.caratMax || 200}
              </span>
              <button
                onClick={() => handleRemoveFilter('carat')}
                className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {(inStockOnly || getActiveFiltersCount() > 0) && (
            <button
              onClick={handleResetAllFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline font-medium"
            >
              Reset All
            </button>
          )}
        </div>
      )}

      {/* 3. Controls Bar (Right aligned: In-Stock, Filter, Sort) */}
      <div className="sticky top-0 z-30 bg-white py-4 border-b-2 border-black transition-all">
        <div className="max-w-[1700px] mx-auto px-4 md:px-8 flex justify-end items-center gap-6 text-sm text-gray-600">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors"
            onClick={() => setInStockOnly(!inStockOnly)}
          >
            <span>In-Stock</span>
            <div className={`w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${inStockOnly ? 'bg-black border-black' : ''}`}>
              {inStockOnly && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors"
            onClick={() => setShowFilterModal(true)}
          >
            <span>Filter</span>
            <SlidersHorizontal className="w-4 h-4" />
          </div>

          <div
            ref={sortDropdownRef}
            className="relative flex items-center gap-2 cursor-pointer hover:text-black transition-colors"
          >
            <div
              className="flex items-center gap-2"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span>{sortOptions.find(opt => opt.value === sortBy)?.label || "Sort"}</span>
              <Menu className="w-4 h-4" />
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </div>

            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[180px]">
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSortSelect(option.value)}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${sortBy === option.value ? 'bg-gray-50 font-medium' : ''
                      }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Inline Filter Panel */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilterModal ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="max-w-[1700px] mx-auto px-4 md:px-8">
          <FilterModal
            isOpen={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            onApplyFilters={handleApplyFilters}
            selectedCategory={selectedCategory}
            totalItems={pagination?.totalItems || 0}
            appliedFilters={appliedFilters}
            excludeCategoryIds={excludeCategoryIds}
            includeCategoryIds={selectedCategory ? [selectedCategory] : displayCategories.map(c => c._id).filter(id => id !== null)}
            inline={true}
          />
        </div>
      </div>

      <div className="border-t border-gray-200"></div>




      {/* 5. Product Grid */}
      <div className="bg-gray-50/30 min-h-[500px] py-8">
        {productsLoading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <p className="text-lg mb-2">No products found</p>
            <p className="text-sm">
              {selectedCategory
                ? `Try selecting a different category or clear the filter`
                : `No products available at the moment`
              }
            </p>
          </div>
        ) : (
          <div className="max-w-[1700px] mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-12">
              {products.map((product) => (
                <Link
                  href={
                    selectedCategory
                      ? `/${categories.find(c => c._id === selectedCategory)?.slug || 'category'}/${product.slug}`
                      : `/${product.category_id?.slug || 'products'}/${product.slug}`
                  }
                  key={product._id}
                  className="block"
                >
                  <ShopAllJewelryCard product={product} />
                </Link>
              ))}
            </div>

            {/* Infinite Scroll Target */}
            <div ref={observerTarget} className="h-20 w-full flex justify-center items-center mt-8">
              {isFetchingMore && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Loading more designs</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>


    </div>
  );
};

export default ShopAllJewelry;
