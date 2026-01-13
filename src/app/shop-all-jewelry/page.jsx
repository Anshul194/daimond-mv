"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchProductsByCategory, getMoreProducts } from "@/store/slices/product";
import RingsGrid from "@/components/RingGrid";
import ShopAllJewelryCard from "@/components/ShopAllJewelryCard";
import Link from "next/link";
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "@/axiosConfig/axiosInstance";

const ShopAllJewelry = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inStockOnly, setInStockOnly] = useState(false);

  const [displayCategories, setDisplayCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const scrollContainerRef = React.useRef(null);

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
        if (categoryStatus === "idle" || categories.length === 0) {
           await dispatch(fetchCategories());
        }

        // Fetch Fine Jewellery Subcategories (Hardcoded ID from Navbar logic: 6854fd3b5e53f236d75c07c1)
        // We do this to find Rings, Earrings, etc.
        let subCats = [];
        try {
            // Check if we can find the "Fine Jewellery" category ID dynamically, otherwise fallback
            // const fineJewelryCat = categories.find(c => c.name.toLowerCase() === 'fine jewellery'); 
            // const idToUse = fineJewelryCat?._id || "6854fd3b5e53f236d75c07c1";
            
            const res = await axiosInstance.get(
                `api/category/subcategory?categoryId=6854fd3b5e53f236d75c07c1`
            );
            subCats = res.data?.data || [];
        } catch (err) {
            console.error("Error fetching subcategories", err);
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

        const combinedSource = [...categories, ...subCats];
        
        const mappedCats = targetNames.map(name => {
             // Try exact match
             let match = combinedSource.find(c => c.name.toLowerCase() === name.toLowerCase());
             
             // Fuzzy/Special matching
             if (!match) {
                 if (name === "Men's Jewelry") {
                    // Try to find "Men" ?? Or "Wedding Rings" -> Men? 
                    // For now, if not found, we might fallback to a generic object or skip
                    // Navbar has "Men" under Wedding Rings. 
                    // We might not have a direct category ID for "Men's Jewelry" as a whole list yet.
                    // We'll leave it blank or try to find "Men"
                    match = combinedSource.find(c => c.name.toLowerCase() === 'men') || 
                            combinedSource.find(c => c.name.toLowerCase() === "men's wedding rings");
                 } else if (name === "Necklaces") {
                    match = combinedSource.find(c => c.name.toLowerCase() === 'chains') || 
                            combinedSource.find(c => c.name.toLowerCase() === 'pendants');
                 }
             }

             return {
                 name: name,
                 _id: match?._id || null, // If null, maybe disable click or show all?
                 image: match?.image || match?.coverImage || "/images/fallback.webp" // specific fallback?
                 // Note: We might want specific images for these if the API images aren't great
             };
        });

        setDisplayCategories(mappedCats);
    };

    initData();
  }, [dispatch, categoryStatus, categories.length]);

  // Fetch Products when Category Changes
  useEffect(() => {
    setCurrentPage(1);
    const fetchParams = {
      categoryId: selectedCategory, // If null, backend should infer "all" or specific logic needed
      page: 1,
      limit: 10,
    };
    
    // If selectedCategory is null, we might need a specific way to ask for ALL products 
    // depending on the backend. Assuming empty categoryId works for 'all'.
    dispatch(fetchProductsByCategory(fetchParams));
  }, [dispatch, selectedCategory]);

  const handleCategoryClick = (categoryId) => {
    if (!categoryId) return; // Prevent clicking items with no ID
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handlePageChange = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    dispatch(
      getMoreProducts({
        categoryId: selectedCategory,
        page: nextPage,
      })
    );
  };

  return (
    <div className="bg-white min-h-screen pb-12 font-gintoNord">
      {/* 1. Header Title */}
      <div className="pt-8 pb-4 text-center">
        <h1 className="text-4xl text-[#1f2937] font-arizona font-light">
          Shop All Jewelry
        </h1>
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
              onClick={() => handleCategoryClick(cat._id)}
              className="flex-shrink-0 flex flex-col items-center justify-start lg:justify-center gap-3 cursor-pointer group w-[100px] md:min-w-[120px]"
            >
              <div 
                className={`w-20 h-20 md:w-36 md:h-36 bg-gray-50 flex items-center justify-center transition-all duration-300 relative
                  ${selectedCategory === cat._id ? 'bg-gray-100' : 'group-hover:bg-gray-100'}
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
                 ${selectedCategory === cat._id ? 'text-black' : 'text-gray-600 group-hover:text-black'}
              `}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Items Count */}
      <div className="text-center pb-6">
        <p className="text-sm text-gray-500">
          {pagination?.totalItems || 0} Items
        </p>
      </div>

      {/* 3. Controls Bar (Right aligned: In-Stock, Filter, Sort) */}
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 mb-4 flex justify-end items-center gap-6 text-sm text-gray-600">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors"
            onClick={() => setInStockOnly(!inStockOnly)}
          >
            <span>In-Stock</span>
            <div className={`w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${inStockOnly ? 'bg-black border-black' : ''}`}>
               {inStockOnly && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>
          
          <div className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
             <span>Filter</span>
             <SlidersHorizontal className="w-4 h-4" />
          </div>

           <div className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
             <span>Sort</span>
             <Filter className="w-4 h-4" /> 
             {/* Note: Icon usage might need adjustment based on available libraries or SVG assets */}
          </div>
      </div>

      <div className="border-t border-gray-200"></div>




      {/* 5. Product Grid */}
      <div className="bg-gray-50/30 min-h-[500px] py-8">
          {productsLoading && products.length === 0 ? (
               <div className="flex justify-center items-center h-64 text-gray-500">Loading products...</div>
          ) : (
                <div className="max-w-[1700px] mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
                        {products.map((product) => (
                             <Link
                                href={
                                  selectedCategory
                                    ? `/${categories.find(c => c._id === selectedCategory)?.slug || 'category'}/${product.slug}`
                                    : `/products/${product.slug}` // fallback URL
                                }
                                key={product._id}
                             >
                                <ShopAllJewelryCard product={product} />
                             </Link>
                        ))}
                    </div>

                    {/* Pagination Button (Reused) */}
                    {pagination?.totalPages > currentPage && (
                        <div className="flex justify-center mt-12 mb-12">
                            <button
                                className="w-fit px-8 bg-[#236339] mx-auto text-white py-3 font-medium transition-all duration-300 hover:bg-gray-800"
                                onClick={handlePageChange}
                            >
                                Load More
                            </button>
                        </div>
                    )}
                 </div>
          )}
      </div>

    </div>
  );
};

export default ShopAllJewelry;
