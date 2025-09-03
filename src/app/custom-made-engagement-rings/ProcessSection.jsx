"use client";

import React, { useState } from "react";

const ProcessSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const processSteps = [
    {
      id: 1,
      title: "Initial Consultation",
      subtitle: "INITIAL CONSULTATION",
      image: "/steps/one.webp", // Replace with your actual image path
      description: "Bring your inspiration and imagination. We often receive photos, screenshots and even drawings from clients that help to translate their vision. You can start with a design that exists or we can work with you to create something new - whatever truly represents you. Our design team then send a quote based on your inspiration, and your chosen components (precious metal type, gemstones etc.)"
    },
    {
      id: 2,
      title: "Selecting a Stone",
      subtitle: "SELECTING A STONE",
      image: "/steps/two.webp", // Replace with your actual image path
      description: "You’ll be guided through the world of gemstones to pick out the perfect stone to match your style and budget. Whether you choose a lab grown diamond, sapphire or moissanite, we have you covered with a wide variety of shapes, sizes and colours."
    },
    {
      id: 3,
      title: "Designing Your Ring",
      subtitle: "DESIGNING YOUR RING",
      image: "/steps/three.webp", // Replace with your actual image path
      description: "Once your design is finalised and order has been placed, we will visualise your custom ring with a Computer-Aided Design (CAD) to ensure every detail is to your specifications, down to the millimetre. This system allows you to see your design, and for us to control the exact ring and gemstone measurements so that your stone perfectly fits the setting. This design is a work in progress between you and our design team, and we ensure each detail is just right before moving on to crafting."
    },
    {
      id: 4,
      title: "Crafting Your Ring",
      subtitle: "CRAFTING YOUR RING",
      image: "/steps/four.webp", // Replace with your actual image path
      description: "Once you have approved the design, our in-house jewellers will begin crafting. Your ring will be completed within 8-10 weeks from your order date. Once completed, you can pick up your ring in one of our showrooms, or we can deliver it directly to your door in discrete packaging."
    }
  ];

  return (
    <section className="bg-[#F8F8F8] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-gray-800 font-light mb-4">
            The Process
          </h2>
        </div>

        {/* Desktop Tab Layout (lg and above) */}
        <div className="hidden lg:block">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-0">
              {processSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setActiveTab(index)}
                    className={`relative px-4 py-4 text-sm font-medium transition-all duration-300 ${
                      activeTab === index
                        ? 'bg-[#B1C9B9] text-gray-800 shadow-md'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-44 h-44 bg-gray-200 rounded-lg mb-3">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('bg-[#B1C9B9]');
                          }}
                        />
                      </div>
                      <span className="text-lg font-semibold uppercase tracking-wide">
                        {step.subtitle}
                      </span>
                    </div>
                  </button>
                  
                  {/* Arrow between tabs (not after the last tab) */}
                  {index < processSteps.length - 1 && (
                    <div className="flex items-center justify-center px-4">
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-400"
                      >
                        <path 
                          d="M9 18L15 12L9 6" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="  p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
              {/* Left - Image */}
              <div className="aspect-2/2 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={processSteps[activeTab].image}
                  alt={processSteps[activeTab].title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gray-300');
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500">Image placeholder</div>';
                  }}
                />
              </div>

              {/* Right - Content */}
              <div className="space-y-6">
                <div>
                  <span className="text-sm text-gray-500 tracking-wide">
                    0{processSteps[activeTab].id}.
                  </span>
                  <h3 className="text-2xl font-light text-gray-800 mt-2">
                    {processSteps[activeTab].title}
                  </h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  {processSteps[activeTab].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Vertical Layout (below lg) */}
        <div className="lg:hidden space-y-8">
          {processSteps.map((step, index) => (
            <div key={step.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {/* Step Header */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gray-300');
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-gray-500 tracking-wide">
                      0{step.id}.
                    </span>
                    <h3 className="text-xl font-light text-gray-800">
                      {step.title}
                    </h3>
                  </div>
                </div>

                {/* Step Description */}
                <p className="text-gray-600 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>


        {/* Banner Section */}
      </div>
        <div
            className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mt-16 flex items-center justify-end"
            style={{
                backgroundImage: "url('/public/serviceBanner.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-white text-3xl md:text-4xl font-light mb-4">
                    Need help finding the <br className="hidden md:block" /> perfect ring?
                </h2>
                <p className="text-white text-base md:text-md mb-6 max-w-lg">
                    Book a time to visit our showroom to get assisted or book a virtual appointment no matter where you are!
                </p>
                <button className="bg-[#25603B] hover:bg-[#1e4e2f] text-white px-8 py-3 rounded-md font-semibold transition">
                    BOOK APPOINTMENT
                </button>
            </div>
        </div>
    </section>
  );
};

export default ProcessSection;