"use client";

import React, { useState, useEffect } from "react";
import Filter from "./Filter";
import RingsGrid from "@/components/RingGrid";
import Modal from "@/components/modal/Modal";
import { usePathname, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/slices/categorySlice";
import {
  fetchProductsByCategory,
  getMoreProducts,
} from "@/store/slices/product";
import axiosInstance from "@/axiosConfig/axiosInstance";
import Image from "next/image";

const RingsBuild = ({ props }) => {
  // Modal state - Initialize as closed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRing, setSelectedRing] = useState(null);

  const location = usePathname();

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [currentCategoryData, setCurrentCategoryData] = useState(null);
  const [getAttribute, setGetAttribute] = useState(null);
  const searchParams = useSearchParams();

  const shape = searchParams.get("shape");
  const style = searchParams.get("style");
  const metal = searchParams.get("metal");
  const band = searchParams.get("band");
  const profile = searchParams.get("profile");
  const gender = searchParams.get("gender");

  // Get the text after the first slash in the path
  const pathAfterFirstSlash = location.startsWith("/")
    ? location.slice(1).split("/")[0] || ""
    : "";

  const {
    data: categories,
    status,
    error,
  } = useSelector((state) => state.category);
  {
    {
      console.log(categories);
    }
  }

  const { items: Products, pagination } = useSelector((state) => state.product);
  {
    {
      console.log("prodcuts : --", Products);
    }
  }

  console.log("Pagination:", pagination);

  const getData = async () => {
    if (categories.length === 0) {
      try {
        await dispatch(fetchCategories());
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    const findCategory = categories.find(
      (cat) => cat.slug === location.slice(1).split("/")[0]
    );
    const categoryID = findCategory ? findCategory._id : null;
    console.log("categories", categories);
    console.log(
      "findCategory",
      findCategory + " LOcation",
      location.slice(1).split("/")[0].toLowerCase()
    );
    console.log("categoryID", categoryID);

    const attributes = [
      "Shape",
      "Style",
      "METAL TYPE",
      "BAND TYPE",
      "SETTING",
      "BAND",
    ];

    // Use Promise.all to fetch all attributes in parallel
    const responses = await Promise.all(
      attributes.map((attribute) => {
        return axiosInstance.get(
          `/api/productattribute?filters={"category_id":"${categoryID}","title":"${attribute}"}`
        );
      })
    );

    // Push data in attributeData with key
    const attributeData = {};
    responses.forEach((response, idx) => {
      attributeData[attributes[idx]] = response.data.data.data[0]?.terms;
    });

    console.log("attributeData", attributeData);

    setGetAttribute(attributeData);

    // Combine the results into an object

    const attributeFilter = [];
    if (shape && shape !== "") {
      attributeFilter.push(shape);
    }
    if (style && style !== "") {
      attributeFilter.push(style);
    }
    if (metal && metal !== "") {
      attributeFilter.push(metal);
    }
    if (band && band !== "") {
      attributeFilter.push(band);
    }
    if (profile && profile !== "") {
      attributeFilter.push(profile);
    }

    if (categoryID) {
      setCategoryId(categoryID);

      if (categoryID === "6854fd3b5e53f236d75c07c1") {
        dispatch(
          fetchProductsByCategory({
            categoryId: categoryID,
            gender: gender ? gender : "both",
            attributeFilter,
            subCategory: searchParams.get("finejewellery"),
          })
        );

        const subcategories = await axiosInstance.get(
          `api/SubCategory/${searchParams.get("finejewellery")}`
        );
        setCurrentCategoryData(subcategories.data.body.data);
      } else {
        setCurrentCategoryData(findCategory);
        dispatch(
          fetchProductsByCategory({
            categoryId: categoryID,
            gender: gender ? gender : "both",
            attributeFilter,
          })
        );
      }
    }
  };

  useEffect(() => {
    const attributeFilter = [];
    if (shape && shape !== "") {
      attributeFilter.push(shape);
    }
    if (style && style !== "") {
      attributeFilter.push(style);
    }
    if (metal && metal !== "") {
      attributeFilter.push(metal);
    }
    if (band && band !== "") {
      attributeFilter.push(band);
    }
    if (profile && profile !== "") {
      attributeFilter.push(profile);
    }

    // if (categoryId) {
    //   setCategoryId(categoryId);
    //   dispatch(
    //     fetchProductsByCategory({
    //       categoryId,
    //       gender: gender ? gender : "both",
    //       attributeFilter,
    //     })
    //   );
    // }

    if (categoryId) {
      if (categoryId === "6854fd3b5e53f236d75c07c1") {
        dispatch(
          fetchProductsByCategory({
            categoryId: categoryId,
            gender: gender ? gender : "both",
            attributeFilter,
            subCategory: searchParams.get("finejewellery"),
          })
        );
      } else {
        dispatch(
          fetchProductsByCategory({
            categoryId: categoryId,
            gender: gender ? gender : "both",
            attributeFilter,
          })
        );
      }
    }
  }, [shape, style, metal, band, profile, gender]);
  // Reset modal state on component mount
  useEffect(() => {
    getData();
    setIsModalOpen(false);
    setSelectedRing(null);
  }, [categories, location]);

  const handleRingClick = (ring, index) => {
    console.log("Ring clicked:", ring); // Debug log
    setSelectedRing({ ...ring, index });
    setIsModalOpen(true);
  };

  // Handle modal close - Enhanced with multiple cleanup methods
  const handleModalClose = () => {
    console.log("Modal closing"); // Debug log
    setIsModalOpen(false);
    setSelectedRing(null);

    // Additional cleanup - remove any body scroll lock
    document.body.style.overflow = "unset";
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        handleModalClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (currentPage > 1 && categoryId) {
      dispatch(getMoreProducts({ categoryId, page: currentPage }));
    }
  }, [currentPage]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative h-80 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: currentCategoryData?.image
            ? `url('${currentCategoryData.image}')`
            : "none",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-5xl capitalize font-light font-arizona mb-2 tracking-wide">
              {currentCategoryData?.name || "Rings"}
            </h1>
            <p className="text-sm w-2/3 mx-auto md:text-sm font-gintoNord font-light">
              {currentCategoryData?.description.slice(0, 200) || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Content Below Banner */}
      <div className="max-w-4xl mx-auto px-6 py-6 text-center">
        <p className="text-gray-700 text-[10px] leading-relaxed font-gintoNord mb-2">
          Create your Platinum lab grown diamond, moissanite or lab grown
          sapphire engagement ring below .
        </p>
        <p className="text-gray-600 text-[10px] font-gintoNord">
          Looking to view our range in person? We are open by appointment.
          Please{" "}
          <span className="text-gray-800 font-medium border-b-2 hover:border-gray-800 pb-1 cursor-pointer hover:text-gray-600 transition-colors">
            make a booking here
          </span>
          .
        </p>
      </div>

      <Filter Data={getAttribute} />

      {/* Product Section */}
      <div className="bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-end items-center gap-4">
            <span className="text-sm text-gray-600">Sort:</span>
            <select className="text-sm border border-gray-300 rounded px-3 py-1">
              <option>Recommended</option>
            </select>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px]">✓</span>
              </div>
              <span className="text-sm text-gray-600">
                Show lifestyle photos
              </span>
            </div>
          </div>
        </div>

        {/* Rings Grid Component */}
        {Products && Products.length > 0 ? (
          <RingsGrid
            rings={Products}
            pagination={pagination}
            currentPage={currentPage}
            onRingClick={handleRingClick}
            category={pathAfterFirstSlash}
            onPageChange={() => setCurrentPage(currentPage + 1)}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            No products available in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default RingsBuild;
