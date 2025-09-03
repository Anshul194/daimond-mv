"use client";
import { fetchBlogCategories } from "@/store/slices/blogCategory";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function convertDateToReadableFormat(isoDate) {
  const date = new Date(isoDate);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

const Page = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.blogCategory);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBlogCategories());
    }
  }, [status, dispatch]);
  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/blogBanner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/20 bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-5xl font-light font-arizona mb-2 tracking-wide">
              Blogs
            </h1>
            <p className="text-lg md:text-sm font-gintoNord font-light">
              Discover Everything You Need to Know About Fine Jewellery{" "}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Introduction Text */}
        <div className="text-center mb-16">
          <p className="text-gray-600 text-md leading-relaxed max-w-4xl mx-auto">
            Explore our comprehensive guides on engagement rings, wedding rings,
            ring care, lab grown diamonds, moissanite and other gemstones. Gain
            valuable insights and tips to make informed decisions about your
            precious jewellery pieces.
          </p>
          <div className="w-20 h-px bg-gray-300 mx-auto mt-8"></div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {data.map((post, index) => (
            <Link href={`/blogs/${post._id}`} key={index}>
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-4">
                  <img
                    src={post.image}
                    alt={post.alt}
                    className="w-full h-42 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-900 font-semibold mb-2">
                    {convertDateToReadableFormat(post.createdAt)}
                  </p>
                  <h3 className="text-lg font-light text-gray-800 leading-tight">
                    {post.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
