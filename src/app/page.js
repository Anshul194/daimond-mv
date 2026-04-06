"use client";
import React, { useEffect } from "react";
import HeroSection from "@/components/homepage/HeroSection";
import GreenBoxText from "@/components/homepage/GreenBoxText";
import SliderBox from "@/components/SliderBox";
import StorySection from "@/components/homepage/StorySection";
// import VideoSection from "@/components/homepage/VideoSection";
// import {
//   ringStyles,
//   ringStylesTwo,
//   sliderConfigs
// } from "../data/sliderdata";
import Collections from "@/components/homepage/Collections";
import SliderBoxTwo from "@/components/homepage/CategoriesSlider";
import Services from "@/components/homepage/Services";
import Education from "@/components/homepage/Education";
import Reviews from "@/components/homepage/Reviews";
import VideoReviews from "@/components/homepage/VideoReview";
import Faq from "@/components/Faq";
import { useSelector } from "react-redux";

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("__page-data-ready"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <HeroSection />

      {/* Ring Styles Slider */}
      <SliderBox
        type="styles"
        title="Shop Lab Diamond Engagement Rings by Style"
        subtitle="Discover our signature setting styles, including solitaire, trilogy, halo, toi et moi and bezel."
      />
      <GreenBoxText />
      <StorySection />

      <SliderBox
        type="products"
        categoryId="6965f0e64b452b08aeeb4b11"
        title="Featured Engagement Rings"
        featured={true}
        subtitle="Shop from our range of lab diamond, coloured sapphire and moissanite engagement rings."
        className="bg-gray-50"
        style={{ marginBottom: "2rem" }}
      />

      <Collections className="!flex-row" />
      <SliderBoxTwo />
      <Collections className="!flex-row-reverse" />
      <Services />
      <Collections className="!flex-row" />
      <Education />
      <Reviews />
      <VideoReviews />
      <Faq />
    </div>
  );
}
