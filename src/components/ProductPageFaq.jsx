"use client";

import React, { useState } from 'react';

const ProductPageFilter = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const faqData = [
    {
      question: "HOW CAN I MATCH A WEDDING BAND WITH AN ENGAGEMENT RING?",
      answer: "Matching a wedding band with an engagement ring involves considering the metal type, style, and proportions. Consider choosing the same metal for both rings, ensuring the band complements the engagement ring's design, and consulting with a jeweler for professional guidance."
    },
    {
      question: "HOW DO I FIND OUT MY WEDDING RING SIZE?",
      answer: "You can find your ring size by visiting a jewelry store for professional measurement, using a ring sizer at home, or measuring an existing ring that fits well. It's best to measure your finger at the end of the day when it's at its largest."
    },
    {
      question: "HOW LONG DOES IT TAKE TO MAKE A WEDDING RING?",
      answer: "Custom wedding rings typically take 4-6 weeks to create, depending on the complexity of the design and the jeweler's workload. Simple bands may be ready in 2-3 weeks, while intricate designs with custom settings may take 6-8 weeks."
    },
    {
      question: "CAN WEDDING RINGS BE RESIZED?",
      answer: "Most wedding rings can be resized, but it depends on the metal type, design, and amount of adjustment needed. Simple bands are easier to resize than rings with intricate details or alternative metals like titanium or tungsten."
    },
    {
      question: "WHAT IS THE MOST POPULAR METAL FOR WOMEN'S WEDDING RINGS?",
      answer: "Platinum and white gold are currently the most popular metals for women's wedding rings, followed by yellow gold and rose gold. Platinum is preferred for its durability and hypoallergenic properties, while gold offers variety in color options."
    },
    {
      question: "HOW DO I TAKE CARE OF MY WEDDING RING?",
      answer: "Regular cleaning with mild soap and warm water, avoiding harsh chemicals, removing the ring during activities that could damage it, and having it professionally inspected annually will help maintain your wedding ring's appearance and integrity."
    },
    {
      question: "WHAT FINGER DO YOU WEAR YOUR WEDDING RING ON?",
      answer: "Traditionally, wedding rings are worn on the fourth finger (ring finger) of the left hand in most Western cultures. This tradition stems from the ancient belief that a vein in this finger connects directly to the heart."
    }
  ];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-[#4a7c59] text-white py-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-arizona font-light mb-1">
            Women's Wedding FAQs
          </h1>
          <p className="text-[10px] font-gintoNord font-light opacity-90">
            Your questions, answered.
          </p>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white py-5 px-4">
        <div className="max-w-2xl mx-auto">
          {faqData.map((faq, index) => (
            <div key={index} className="mb-4">
              <div className="bg-white rounded-lg shadow-sm border-b border-gray-300">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-3 py-3 text-left flex items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 mr-4">
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        openAccordion === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] font-medium text-gray-800 font-gintoNord uppercase tracking-wide">
                    {faq.question}
                  </span>
                </button>
                
                {openAccordion === index && (
                  <div className="px-6 pb-5">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPageFilter;