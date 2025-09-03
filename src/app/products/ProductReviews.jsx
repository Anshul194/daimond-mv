import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ProductReviews = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqData = [
    {
      question: "HOW CAN I MATCH A WEDDING BAND WITH AN ENGAGEMENT RING?",
      answer: "To match a wedding band with your engagement ring, consider the metal type, style, and design elements. The most important factor is ensuring both rings are made from the same metal (platinum, gold, etc.) for a cohesive look. You can choose a complementary band that follows the curves of your engagement ring, or opt for a classic straight band for contrast. Many couples also choose matching sets designed to fit together perfectly."
    },
    {
      question: "HOW DO I FIND OUT MY WEDDING RING SIZE?",
      answer: "The most accurate way to determine your ring size is to visit a professional jeweler who can measure your finger with a ring sizer. However, you can also measure at home using a ring sizer tool or by wrapping a string around your finger and measuring the circumference. Keep in mind that finger size can vary throughout the day and with temperature, so it's best to measure when your hands are at normal temperature."
    },
    {
      question: "HOW LONG DOES IT TAKE TO MAKE A WEDDING RING?",
      answer: "The time to create a custom wedding ring typically ranges from 4-8 weeks, depending on the complexity of the design and the materials used. Simple bands may take 3-4 weeks, while more intricate designs with stones or custom engravings can take 6-8 weeks. We recommend ordering your wedding rings at least 2-3 months before your wedding date to allow for any adjustments or sizing changes."
    },
    {
      question: "CAN WEDDING RINGS BE RESIZED?",
      answer: "Most wedding rings can be resized, but the ability to resize depends on the ring's design, metal type, and construction. Plain metal bands are easiest to resize, while rings with stones, intricate patterns, or alternative metals like titanium may be more challenging. Generally, rings can be sized up or down by 1-2 sizes. It's best to consult with a professional jeweler to determine if your specific ring can be safely resized."
    },
    {
      question: "WHAT IS THE MOST POPULAR METAL FOR WOMEN'S WEDDING RINGS?",
      answer: "White gold and platinum are currently the most popular metals for women's wedding rings. White gold offers a beautiful silvery appearance at a more affordable price point, while platinum is highly durable and naturally hypoallergenic. Yellow gold remains a classic choice, and rose gold has gained popularity for its romantic, warm tone. The choice often depends on personal preference, skin tone, and the metal of the engagement ring."
    },
    {
      question: "HOW DO I TAKE CARE OF MY WEDDING RING?",
      answer: "To keep your wedding ring looking its best, clean it regularly with warm soapy water and a soft brush. Have it professionally cleaned and inspected every 6-12 months. Remove your ring during activities that could damage it, such as heavy lifting, gardening, or using harsh chemicals. Store it safely when not wearing it, and consider getting it insured. Different metals may require specific care, so consult with your jeweler for metal-specific maintenance tips."
    },
    {
      question: "WHAT FINGER DO YOU WEAR YOUR WEDDING RING ON?",
      answer: "Traditionally, wedding rings are worn on the fourth finger (ring finger) of the left hand. This tradition stems from the ancient belief that this finger contains the 'vena amoris' or 'vein of love' that connects directly to the heart. However, cultural practices vary - in some countries, wedding rings are worn on the right hand. Ultimately, you can wear your wedding ring on whichever finger feels most comfortable and meaningful to you."
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="w-full pb-6">
      {/* Header Section */}
      <div className="bg-[#236339] text-white py-8 px-4">
        <div className="w-full mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-light tracking-wide">
            Women's Wedding FAQs
          </h1>
          <p className="text-[10px] md:text-md opacity-90 font-light">
            Your questions, answered.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-xl mx-auto py-6 px-4">
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-2 flex items-center text-left hover:text-[#236339] transition-colors duration-300 group"
              >
                <div className="flex-shrink-0 mr-4 transition-transform duration-300 group-hover:scale-110">
                  {expandedFAQ === index ? (
                    <ChevronUp size={20} className="text-[#236339] transition-colors duration-300" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600 transition-colors duration-300" />
                  )}
                </div>
                <span className="!text-md cursor-pointer md:text-sm font-medium tracking-wide text-gray-800">
                  {faq.question}
                </span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedFAQ === index 
                  ? 'max-h-96 opacity-100 pb-6' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="ml-12 transform transition-transform duration-300">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;