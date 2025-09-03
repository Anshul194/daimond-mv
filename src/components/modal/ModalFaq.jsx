import React, { useState } from 'react';

const RingFinderFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    { question: "HOW LONG WILL IT TAKE TO GET MY ORDER?" },
    { question: "HOW DO I FIND OUT MY RING SIZE?" },
    { question: "WHAT IF I NEED HELP PLACING AN ORDER THROUGH YOUR WEBSITE?" },
    { question: "CAN YOU HELP ME KEEP MY PURCHASE A SURPRISE?" },
    { question: "WHAT TYPE OF WARRANTY DO I RECEIVE?" },
    { question: "WHAT PAYMENT METHODS DO YOU ACCEPT?" },
    { question: "DO YOU SHIP WORLDWIDE?" },
    { question: "CAN I RETURN A PRODUCT?" },
    { question: "CAN I JUST DROP IN TO THE SHOWROOM?" },
    { question: "THE FIT OF MY RING IS NOT QUITE RIGHT, CAN I RESIZE IT?" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div 
        className="relative bg-gray-100 p-8 min-h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/certified.webp')"
        }}
      >
        <div className="text-center text-white relative z-10">
          <h1 className="text-4xl font-light font-arizona mb-4">
            Need help finding
          </h1>
          <h2 className="text-4xl font-light font-arizona mb-6">
            the perfect ring?
          </h2>
          
          <p className="text-lg font-gintoNormal mb-8 max-w-md mx-auto">
            Book a time to visit our showroom to get assisted or 
            book a virtual appointment no matter where you are!
          </p>
          
          <button className="bg-green-700 text-white px-8 py-4 text-sm font-medium hover:bg-green-800 transition-colors font-gintoNormal tracking-wider">
            BOOK APPOINTMENT
          </button>
        </div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* FAQ Section */}
      <div className="">
        <div className=" mx-auto ">
          <div className="text-center mb-4 btn py-3">
            <h2 className="text-4xl font-light font-arizona text-white mb-2">
              FAQs
            </h2>
            <p className="text-white font-gintoNormal text-lg">
              Your questions, answered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white border-b border-green-700"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-green-700 text-xl font-light mr-4">
                      {openFAQ === index ? '−' : '+'}
                    </span>
                    <span className="font-gintoNormal text-sm font-medium text-gray-800">
                      {faq.question}
                    </span>
                  </div>
                </button>
                
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 font-gintoNormal text-sm leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingFinderFAQ;