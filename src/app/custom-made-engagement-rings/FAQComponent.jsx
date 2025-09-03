import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQComponent = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "HOW MUCH DOES IT COST TO GET A CUSTOM RING?",
      answer: "Custom engagement rings start at 2,000 AUD."
    },
    {
      question: "HOW LONG WILL A CUSTOM RING TAKE TO MAKE?",
      answer: ""
    },
    {
      question: "HOW DO I CLAIM MY LIMITED LIFETIME WARRANTY?",
      answer: ""
    },
    {
      question: "WHAT IS THE DIFFERENCE BETWEEN LAB GROWN SAPPHIRES AND MINED SAPPHIRES?",
      answer: ""
    },
    {
      question: "WHAT IS A TOKI FIT RING?",
      answer: ""
    },
    {
      question: "CAN THEY HAVE TWO TONE METALS?",
      answer: ""
    },
    {
      question: "WHY SHOULD I MAKE A CUSTOM ENGAGEMENT RING?",
      answer: ""
    },
    {
      question: "CAN YOU RECREATE AN EXISTING DESIGN?",
      answer: ""
    },
    {
      question: "CAN YOU CUSTOMISE ONE OF YOUR EXISTING RINGS?",
      answer: ""
    },
    {
      question: "WHAT STONE SHAPES CAN I HAVE IN MY TOKI FIT RING?",
      answer: ""
    },
    {
      question: "CAN THEY BE HIGH SET OR LOW SET?",
      answer: ""
    }
  ];

  return (
    <div className="w-full max-w-full mx-auto">
      {/* Header */}
      <div className="bg-green-800 text-white py-6 px-4">
        <h1 className="text-3xl font-bold text-center">FAQ</h1>
        <div className="flex justify-center mt-2">
          <div className="h-0.5 w-16 bg-yellow-400"></div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="divide-y divide-gray-200 max-w-7xl mx-auto">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-8 text-left transition-colors duration-200 flex items-center"
            >
              <div className="mr-4 flex-shrink-0">
                {openItems[index] ? (
                  <Minus className="w-5 h-5 text-gray-600" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-800 uppercase tracking-wide">
                {item.question}
              </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openItems[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              {item.answer && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 text-sm leading-relaxed pl-9">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQComponent;