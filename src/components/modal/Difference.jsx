import React from 'react';

const Difference = () => {
  return (
    <div className="btn text-white py-8 px-6">
      {/* Header */}
      <h2 className="text-center text-2xl font-arizona mb-8">
        The Cullen Difference
      </h2>

      {/* Features Grid */}
      <div className="grid grid-cols-5 max-sm:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
        {/* Quality Craftsmanship */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
              {/* Diamond outline */}
              <path d="M50 10 L30 25 L15 45 L50 85 L85 45 L70 25 Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Diamond facets */}
              <path d="M30 25 L50 45 L70 25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 45 L50 45 L85 45" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 25 L15 45" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M70 25 L85 45" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M50 45 L50 85" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-[10px] font-gintoNord font-bold uppercase tracking-wider mb-1">
            QUALITY
          </h3>
          <h3 className="text-[10px] font-gintoNord font-bold uppercase tracking-wider">
            CRAFTSMANSHIP
          </h3>
        </div>

        {/* Premium Materials */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              {/* Microscope base */}
              <path d="M20 85 L80 85" stroke="currentColor" strokeLinecap="round"/>
              <path d="M40 85 L40 75" stroke="currentColor" strokeLinecap="round"/>
              <path d="M60 85 L60 75" stroke="currentColor" strokeLinecap="round"/>
              {/* Microscope body */}
              <path d="M35 75 L65 75 L65 45 L35 45 Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Microscope tube */}
              <path d="M45 45 L45 25 L55 25 L55 45" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Eyepiece */}
              <circle cx="50" cy="20" r="5" fill="none" stroke="currentColor"/>
              {/* Stage */}
              <path d="M30 60 L70 60" stroke="currentColor" strokeLinecap="round"/>
              <circle cx="50" cy="60" r="3" fill="none" stroke="currentColor"/>
            </svg>
          </div>
          <h3 className="text-[10px] font-gintoNord font-bold uppercase tracking-wider mb-1">
            PREMIUM
          </h3>
          <h3 className="text-[10px] font-gintoNord font-bold uppercase tracking-wider">
            MATERIALS
          </h3>
        </div>

        {/* Customisable Design */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              {/* Ring band */}
              <ellipse cx="50" cy="50" rx="35" ry="25" fill="none" stroke="currentColor" strokeWidth="2"/>
              <ellipse cx="50" cy="50" rx="25" ry="15" fill="none" stroke="currentColor" strokeWidth="1"/>
              {/* Center stone */}
              <circle cx="50" cy="35" r="4" fill="currentColor"/>
              {/* Side stones */}
              <circle cx="40" cy="38" r="2" fill="currentColor"/>
              <circle cx="60" cy="38" r="2" fill="currentColor"/>
              <circle cx="35" cy="45" r="2" fill="currentColor"/>
              <circle cx="65" cy="45" r="2" fill="currentColor"/>
            </svg>
          </div>
          <h3 className="text-[10px] font-gintoNord font-bold uppercase tracking-wider mb-1">
            CUSTOMISABLE
          </h3>
          <h3 className="text-[10px] font-gintoNord font-bold uppercase tracking-wider">
            DESIGN
          </h3>
        </div>

        {/* Sustainable Practices */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              {/* Leaf shape */}
              <path d="M50 15 C35 25, 25 40, 30 60 C35 75, 50 85, 50 85 C50 85, 65 75, 70 60 C75 40, 65 25, 50 15 Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Leaf veins */}
              <path d="M50 15 L50 85" stroke="currentColor" strokeLinecap="round"/>
              <path d="M50 30 L40 40" stroke="currentColor" strokeLinecap="round"/>
              <path d="M50 30 L60 40" stroke="currentColor" strokeLinecap="round"/>
              <path d="M50 45 L38 55" stroke="currentColor" strokeLinecap="round"/>
              <path d="M50 45 L62 55" stroke="currentColor" strokeLinecap="round"/>
              <path d="M50 60 L40 70" stroke="currentColor" strokeLinecap="round"/>
              <path d="M50 60 L60 70" stroke="currentColor" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-[10px] font-gintoNord font-bold uppercase tracking-wider mb-1">
            SUSTAINABLE
          </h3>
          <h3 className="text-[10px] font-gintoNord font-bold uppercase tracking-wider">
            PRACTICES
          </h3>
        </div>

        {/* Philanthropic Initiatives */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              {/* House outline */}
              <path d="M20 80 L20 50 L50 20 L80 50 L80 80 Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Roof */}
              <path d="M15 50 L50 15 L85 50" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Door */}
              <path d="M40 80 L40 60 L60 60 L60 80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Windows */}
              <path d="M25 45 L35 45 L35 35 L25 35 Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M65 45 L75 45 L75 35 L65 35 Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Heart in center */}
              <path d="M50 45 C48 42, 44 42, 44 46 C44 48, 50 54, 50 54 C50 54, 56 48, 56 46 C56 42, 52 42, 50 45 Z" fill="currentColor"/>
            </svg>
          </div>
          <h3 className="text-[10px] font-gintoNord font-bold uppercase tracking-wider mb-1">
            PHILANTHROPIC
          </h3>
          <h3 className="text-[10px] font-gintoNord font-bold uppercase tracking-wider">
            INITIATIVES
          </h3>
        </div>
      </div>

      {/* Description Paragraph */}
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-gintoNormal leading-relaxed" style={{ fontSize: '10px' }}>
          We celebrate life's cherished moments, conscientiously. We craft premium engagement rings and fine jewellery exclusively with carbon 
          neutral lab grown diamonds and moissanite. Headquartered in the heart of Melbourne, Australia, our legacy of superior craftsmanship 
          lies in the hands of jewellers with generational experience. By pairing accessible elegance with a commitment to sustainability, every 
          piece is more than a symbol — it's a promise of love, ethically made and family kept.
        </p>
      </div>
    </div>
  );
};

export default Difference;