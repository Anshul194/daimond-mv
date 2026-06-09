import React, { Suspense, lazy } from "react";
import HeroSection from "@/components/homepage/HeroSection";
import SliderBox from "@/components/SliderBox";
import CategoriesSlider from "@/components/homepage/CategoriesSlider";

const GreenBoxText = lazy(() => import("@/components/homepage/GreenBoxText"));
const StorySection = lazy(() => import("@/components/homepage/StorySection"));
const Collections = lazy(() => import("@/components/homepage/Collections"));
const Services = lazy(() => import("@/components/homepage/Services"));
const Education = lazy(() => import("@/components/homepage/Education"));
const Reviews = lazy(() => import("@/components/homepage/Reviews"));
const VideoReview = lazy(() => import("@/components/homepage/VideoReview"));
const Faq = lazy(() => import("@/components/Faq"));
const PageDataReady = lazy(() => import("@/components/PageDataReady"));

function SectionFallback() {
  return <div className="w-full h-48 bg-gray-50 animate-pulse" />;
}

export default function Home() {
  return (
    <div>
      <PageDataReady />
      <HeroSection />

      <SliderBox
        type="styles"
        title="Shop Lab Diamond Engagement Rings by Style"
        subtitle="Discover our signature setting styles, including solitaire, trilogy, halo, toi et moi and bezel."
      />
      <Suspense fallback={<SectionFallback />}>
        <GreenBoxText />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <StorySection />
      </Suspense>

      <SliderBox
        type="products"
        categoryId="69d4c409bed5febddc4a3df9"
        title="Featured Engagement Rings"
        featured={true}
        subtitle="Shop from our range of lab diamond, coloured sapphire and moissanite engagement rings."
        className="bg-gray-50"
        style={{ marginBottom: "2rem" }}
      />

      <Suspense fallback={<SectionFallback />}>
        <Collections className="!flex-row" />
      </Suspense>
      <CategoriesSlider />
      <Suspense fallback={<SectionFallback />}>
        <Collections className="!flex-row-reverse" />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Collections className="!flex-row" />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Education />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Reviews />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <VideoReview />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Faq />
      </Suspense>
    </div>
  );
}
