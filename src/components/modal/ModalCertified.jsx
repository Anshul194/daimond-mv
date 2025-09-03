import React from 'react';

const ModalCertified = () => {
  return (
    <div 
      className="bg-gray-100 p-8 max-w-full mx-auto min-h-56  bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/images/certified.webp')"
      }}
    >
      <div className="flex items-start">
        {/* Left Section - Only Diamond, Heading, Para, Button */}
        <div className="flex-1 max-w-md text-center">
          
          <h1 className="text-3xl font-light font-arizona text-gray-800 mb-2">
            Your Diamonds,
          </h1>
          <h2 className="text-3xl font-light font-arizona text-gray-800 mb-6">
            Truly Carbon Neutral
          </h2>
          
          <p className="text-sm text-gray-600 leading-relaxed mb-8 font-gintoNormal">
            Cullen Jewellery's selection of lab grown diamonds is certified 100% 
            Carbon Neutral by Clear Neutral, an authority in carbon neutral 
            certification. Embrace a brilliant, sustainable tomorrow by choosing 
            our lab grown diamonds today.
          </p>
          
          <button className="bg-green-700 text-white px-6 py-3 text-sm font-medium hover:bg-green-800 transition-colors">
            LEARN ABOUT CLEAR NEUTRAL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCertified;