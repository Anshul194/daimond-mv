"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { fetchAttributesByTitle } from "../store/slices/attributes";
import {
  fetchProductsByCategory,
  fetchProductById,
} from "../store/slices/product";
import ProductModal from "../../src/components/modal/Modal";
import Link from "next/link";
import Image from "next/image";

const SliderBox = ({
  type = "styles", // "styles" or "products"
  categoryId = null, // Required when type is "products"
  title = "Shop Lab Diamond Engagement Rings by Style",
  subtitle = "Discover our signature setting styles, including solitaire, trilogy, halo, toi et moi and bezel.",
  ...otherProps
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const sliderRef = useRef(null);
  const router = useRouter(); // Initialize router for navigation

  const dispatch = useDispatch();

  // Get data from appropriate slice based on type
  const attributesState = useSelector((state) => state.attributes);
  const productsState = useSelector((state) => state.product);

  // console.log("Debug - attributesState:", attributesState);
  // console.log("Debug - productsState:", productsState);

  const currentState = type === "products" ? productsState : attributesState;

  // Add safety check for undefined state
  const { items = [], loading = false, error = null } = currentState || {};

  // Get selected product data from Redux store
  const selectedProduct = useMemo(() => {
    if (!selectedProductId || !items.length) return null;
    return items.find((item) => item._id === selectedProductId);
  }, [selectedProductId, items]);

  // Fetch data on mount based on type
  useEffect(() => {
    if (type === "products" && categoryId) {
      dispatch(fetchProductsByCategory(categoryId));
    } else if (type === "styles") {
      dispatch(fetchAttributesByTitle());
    }
  }, [dispatch, type, categoryId]);

  // Debounced resize handler for items per view
  const updateItemsPerView = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setItemsPerView(4); // lg: show 4
    } else if (width >= 768) {
      setItemsPerView(3); // md: show 3
    } else {
      setItemsPerView(1); // sm: show 1
    }
  }, []);

  useEffect(() => {
    updateItemsPerView();
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateItemsPerView, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [updateItemsPerView]);

  const maxSlides = useMemo(
    () => Math.max(0, items.length - itemsPerView),
    [items.length, itemsPerView]
  );

  const nextSlide = useCallback(() => {
    if (currentSlide < maxSlides) {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, maxSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  const slideWidth = useMemo(() => 100 / itemsPerView, [itemsPerView]);

  // Handle item click - open modal for products or navigate to Rings page for styles
  const handleItemClick = useCallback(
    (item) => {
      if (type === "products") {
        const productId = item._id || item.id;
        setSelectedProductId(productId);
        setIsModalOpen(true);

        // Fetch detailed product data if not already available or incomplete
        const existingProduct = items.find((p) => p._id === productId);
        if (!existingProduct || !existingProduct.detailedDataLoaded) {
          dispatch(fetchProductById(productId));
        }
      } else {
        // Navigate to Rings page with attributeName and attributeValue
        // console.log("Style clicked:", item);
        const attributeName = item.title || "Style"; // Adjust based on your data structure
        const attributeValue = item.value || item.name;
        router.push(
          `/products/rings?attributeName=${encodeURIComponent(
            attributeName
          )}&attributeValue=${encodeURIComponent(attributeValue)}`
        );
      }
    },
    [type, items, dispatch, router]
  );

  // Close modal handler
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  }, []);

  // Helper function to get item data based on type
  const getItemData = useCallback(
    (item) => {
      if (type === "products") {
        return {
          id: item._id || item.id,
          name: item.name || item.title || "Unnamed Product",
          image: item.image || item.images?.[0] || "/images/fallback.webp",
          backgroundPosition: item.backgroundPosition || "center center",
          price: item.price || null,
          originalPrice: item.originalPrice || null,
        };
      } else {
        return {
          id: item._id || item.value,
          name: item.value || item.name || "Unnamed Style",
          image: item.image || "/images/fallback.webp",
          backgroundPosition: item.backgroundPosition || "center center",
        };
      }
    },
    [type]
  );

  // Render loading state
  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">
          Loading {type === "products" ? "products" : "styles"}...
        </p>
      </div>
    );
  }

  // Render error state
  if (error && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Render empty state
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">
          No {type === "products" ? "products" : "styles"} available.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4  py-16" {...otherProps}>
        {/* Header */}
        <div className="text-center pt-16 mb-0">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-light font-arizona text-gray-800 mb-4">
            {title}
          </h1>
          <p className="text-gray-700 text-[10px]">{subtitle}</p>
        </div>

        {/* Slider Container */}
        <div className="relative overflow-hidden max-w-7xl mx-auto px-4 py-16">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * slideWidth}%)`,
            }}
          >
            {items.map((item, index) => {
              const itemData = getItemData(item);

              return (
                <Link
                  key={itemData.id || index}
                  href={
                    type === "products"
                      ? `/${item.category_id?.slug}/${item.slug}`
                      : `/engagement-230?style=${itemData.name.toLowerCase()}`
                  }
                  className="flex-shrink-0 px-4"
                  style={{ width: `${slideWidth}%` }}
                >
                  <div className="group cursor-pointer">
                    {/* Image Container */}
                    <div className="aspect-[3/4] md:aspect-[4/5] bg-gray-100 overflow-hidden mb-4 relative transition-transform duration-300 ease-in-out hover:scale-105">
                      {/* <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${
                            Array.isArray(itemData.image)
                              ? itemData.image[0]
                              : itemData.image
                          })`,
                          backgroundPosition: itemData?.backgroundPosition,
                        }}
                      /> */}

                      {/* <Image
                        src={
                          Array.isArray(itemData.image)
                            ? itemData.image[0]
                            : itemData.image
                        }
                        alt={itemData.name}
                        layout="fill"
                        objectFit="cover"
                      /> */}

                      {Array.isArray(itemData.image) ? (
                        <Image
                          src={itemData.image[0]}
                          alt={itemData.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <Image
                          src={itemData.image}
                          alt={itemData.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      )}

                      {/* Show price for products */}
                      {type === "products" && itemData.price && (
                        <div className="absolute bottom-2 left-2 bg-white/90 text-black backdrop-blur-sm px-2 py-1 rounded text-[10px] font-medium">
                          {itemData.price}
                        </div>
                      )}
                    </div>

                    {/* Item Name and Arrow */}
                    <div className="flex items-center justify-start gap-4">
                      <h3 className="text-[10px] font-semibold font-gintoNord text-gray-900 tracking-wide uppercase">
                        {itemData.name}
                      </h3>
                      <svg
                        className="w-5 h-4 text-gray-600 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                        <line
                          x1="0"
                          y1="12"
                          x2="15"
                          y2="12"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          {currentSlide < maxSlides && (
            <button
              onClick={nextSlide}
              className="absolute right-5 top-2/4 transform -translate-y-2/3 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 z-10"
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-5 top-2/4 transform -translate-y-2/3 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 z-10"
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Product Modal - Only render for products */}
      {console.log("Debug - isModalOpen:", isModalOpen)}
      {console.log("Debug - selectedProductId:", selectedProductId)}
      {console.log("Debug - selectedProduct:", selectedProduct)}
      {type === "products" && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          productData={selectedProduct}
          loading={productsState.loading && selectedProductId !== null}
        />
      )}
    </>
  );
};

export default SliderBox;
