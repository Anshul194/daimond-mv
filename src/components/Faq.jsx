"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown } from "lucide-react";
import { fetchFaqs } from "../store/slices/faq"; // Adjust the path to your faqSlice

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full py-8 flex items-center justify-between text-left group transition-all duration-300"
        onClick={onToggle}
      >
        <span className={`text-white font-semibold text-[10px] font-gintoNord uppercase tracking-[0.2em] transition-colors duration-300 ${isOpen ? 'text-[#00736C]' : 'group-hover:text-[#00736C]'}`}>
          {question}
        </span>
        <div className="flex-shrink-0 ml-6">
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transform transition-all duration-500 ease-in-out ${
              isOpen ? "rotate-180 text-[#00736C]" : "rotate-0 group-hover:text-black"
            }`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-gray-600 font-gintoNormal text-sm leading-relaxed max-w-3xl">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function Faq() {
  const [openItems, setOpenItems] = useState({});
  const dispatch = useDispatch();
  // const { faqs, loading, error } = useSelector((state) => state.faq);
  // console.log('FAQs:', faqs);

  const faqs = [
    {
      question: "How long will it take to get my order?",
      answer:
        "Crafting of your ring typically takes 50 business days, with expediting options available if you need it sooner. The exact completion date can be conveniently found on each product page. Please note that shipping is not included within this date and you can find all our shipping information on our shipping page. For all timeframe information please visit our crafting timeframes page.",
    },
    {
      question: "Do you ship worldwide?",
      answer:
        "Yes! At Cullen, we provide free express and insured international shipping on all orders over $500. Plus, we cover duties and taxes for most countries. For full details, visit our shipping page.",
    },
    {
      question: "Are lab grown diamonds a simulant or real?",
      answer:
        "Yes - Lab grown diamonds, also known as laboratory grown diamonds or ethical lab grown diamonds, are chemically identical to mined diamonds or natural diamonds. They offer the same level of beauty and are an extremely popular choice. A lab grown diamond, unlike a simulant, has the same chemical and physical properties as a mined diamond. They are aesthetically and physically identical to mined diamonds, offering the same fire and brilliance.",
    },
    {
      question: "What lab diamond stone shapes do you offer?",
      answer:
        "Our range of lab grown diamonds are available in round, oval, pear, emerald, radiant, cushion, marquise, elongated hexagon, princess, asscher, heart and elongated cushion. We offer fancy coloured lab grown diamonds in all shapes and sizes.",
    },
    {
      question:
        "What is the difference between a mined diamond and an ethical lab grown diamond?",
      answer:
        "The only difference between a mined diamond and a lab grown diamond is the origin. Lab grown diamonds are free from the ethical concerns associated with mined diamonds. Lab diamonds are created under high pressure in a laboratory using advanced technology and offer the same fire, clarity, and carat weight as mined diamonds.",
    },
    {
      question:
        "How does Cullen Jewellery ensure a seamless purchase experience?",
      answer:
        "We offer a personalised in-person showroom experience to explore gemstone shapes, carat weight, compare engagement ring designs and purchase our ready-to-wear range. Our collection is also available to shop online, with the option to customise a ring unique to you. We provide comprehensive support, with a specialist guiding you through each step of your engagement ring journey.",
    },
    {
      question: "What type of warranty do I receive?",
      answer:
        "Cullen Jewellery offers a complimentary Lifetime Manufacturing Warranty on all our products, including lab grown diamond rings, ensuring peace of mind.",
    },
    {
      question: "Is Moissanite a Good Choice for an Engagement Ring?",
      answer:
        "Yes - Moissanite is a brilliant alternative to a lab diamond engagement ring. It offers exceptional clarity, durability, and sparkle, making it a stunning gemstone in its own right. Unlike a 'fake diamond,' moissanite is a high-quality lab grown gemstone that provides the same level of brilliance as a diamond at a more accessible price. Each moissanite stone at Cullen is checked by our expert team to ensure it's the best quality, just like our lab grown diamond collections. Moissanite engagement rings are becoming increasingly popular due to their beauty, durability, ease of customisation, and affordability. They retain their sparkle indefinitely, with clarity and carat weight remaining intact over time. If you're looking for a timeless, brilliant gemstone that rivals the aesthetic of mined diamonds, moissanite is the perfect choice. Moissanite and diamonds (both lab grown and mined) share similar optical properties, making moissanite a great alternative to diamonds. Many people mistakenly believe moissanite is a 'fake diamond,' but it is a unique gemstone with its own beauty and brilliance. To the naked eye, moissanite rings look nearly identical to diamond rings, offering a timeless aesthetic that never appears 'tacky' or fake. Due to its comparable thermal conductivity, moissanite can even pass a diamond tester. However, at Cullen Jewellery, we use specialised equipment to distinguish between moissanite and diamonds, ensuring full transparency in your purchase. If you're considering a stunning alternative to a lab grown or natural diamond ring, moissanite is an excellent choice. Explore our collection today to find the perfect moissanite engagement ring for you!",
    },
    {
      question: "Where are your showrooms located?",
      answer:
        "We have conveniently placed showrooms in Melbourne, Sydney, Brisbane, Adelaide, Perth and Auckland New Zealand. To visit one of our showrooms please book an appointment.",
    },
    {
      question: "What is a carbon neutral lab grown diamond?",
      answer:
        "A carbon-neutral lab-grown diamond is a diamond that has been created with net-zero carbon emissions, meaning any carbon produced during its growth and manufacturing process is offset through verified sustainability initiatives. Our diamonds are certified carbon-neutral by Clear Neutral, ensuring they meet the highest environmental standards.",
    },
  ];

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div>
    {/* <div className="bg-white"> */}
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-light mb-4 font-arizona tracking-wide text-white">
          Common Questions
        </h2>
        <p className="text-gray-500 font-gintoNormal text-[10px] uppercase tracking-[0.2em]">
          Refining your engagement ring journey
        </p>
      </div>

      {/* FAQ Content */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="divide-y divide-gray-100">
          {faqs.length === 0 && <p className="text-center py-12 text-gray-400">No FAQs available.</p>}
          {faqs.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openItems[index] || false}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
