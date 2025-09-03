"use client";
import GreenBoxText from "@/components/homepage/GreenBoxText";
import HeroSection from "@/components/homepage/HeroSection";
import VideoSection from "@/components/homepage/VideoSection";
import SliderBox from "@/components/SliderBox";
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
      <VideoSection />

      <SliderBox
        type="products"
        categoryId="6854fc895e53f236d75c07af"
        title="Featured Engagement Rings"
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
