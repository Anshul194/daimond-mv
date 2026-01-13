import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="w-full h-[85vh] flex">
      {/* Left Panel - Main Hero */}
      <div className="relative w-full lg:w-1/2 overflow-hidden pb-8">
        {/* Background Image */}
        <Image
          src="/images/left-banner.webp"
          alt="Engagement Ring Hero"
          fill
          className="object-cover"
          priority
        />

        {/* Dark overlay */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div> */}

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-end pb-12 h-full px-12  lg:px-20">
          {/* Google Reviews Badge */}
          <div className="mb-2">
            <div className="inline-flex items-center bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[9px] font-medium text-gray-800">
                  9642 reviews
                </span>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl lg:text-4xl font-light font-arizona text-white leading-tight">
            Make a statement.
          </h1>

          {/* Subheading */}
          <p className="text-md lg:text-[10px] text-white font-gintoNormal mb-4 font-light">
            Engagement rings to make a statement.
          </p>

          {/* CTA Button */}
          <Link href="/engagement-rings/build-ring">
            <button className="bg-green-700 w-[170px] hover:bg-green-800 text-white font-light font-gintoNormal py-4 px-5 text-[10px] tracking-wide transition-colors duration-200">
              EXPLORE ENGAGEMENT
            </button>
          </Link>
          <Link href="/shop-all-jewelry">
            <button className="border border-2 mt-3 w-[170px] hover:bg-green-800 text-white font-light font-gintoNormal py-4 px-5 text-[10px] tracking-wide transition-colors duration-200">
              JEWELRY
            </button>
          </Link>
        </div>
      </div>

      {/* Right Panel - Ring Collection */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/right-banner.webp"
          alt="Ring Collection"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default HeroSection;
