
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

const ShowDiamondFilter = ({ isVisible, onClose, onApplyFilters }) => {
  const [activeTab, setActiveTab] = useState('CLARITY');
  const [selectedShape, setSelectedShape] = useState('ROUND');
  const [selectedCarat, setSelectedCarat] = useState(1.0);
  const [skinTone, setSkinTone] = useState(40); // 0-100 scale for skin tone
  const [selectedCutGrade, setSelectedCutGrade] = useState('Excellent');
  
  const [filters, setFilters] = useState({
    clarity: [],
    colour: [],
    cut: [],
    carat: { min: 0, max: 10 },
    shape: ['ROUND'],
    depth: { min: 0, max: 100 },
    table: { min: 0, max: 100 },
    lwRatio: { min: 0, max: 3 }
  });

  const topTabs = ['CLARITY', 'COLOUR', 'CUT', 'CARAT'];
  const bottomTabs = ['SHAPE', 'DEPTH', 'TABLE', 'L/W RATIO'];

  const shapes = [
    { id: 'round', name: 'ROUND', svg: 'round.svg' },
    { id: 'oval', name: 'OVAL', svg: 'oval.svg' },
    { id: 'emerald', name: 'EMERALD', svg: 'emerald.svg' },
    { id: 'radiant', name: 'RADIANT', svg: 'radiant.svg' },
    { id: 'pear', name: 'PEAR', svg: 'pear.svg' },
    { id: 'cushion', name: 'CUSHION', svg: 'cushion.svg' },
    { id: 'elongated-cushion', name: 'ELONGATED CUSHION', svg: 'elongated_cushion.svg' },
    { id: 'elongated-hexagon', name: 'ELONGATED HEXAGON', svg: 'elongated_hexagon.svg' },
    { id: 'marquise', name: 'MARQUISE', svg: 'marquise.svg' },
    { id: 'heart', name: 'HEART', svg: 'heart.svg' },
    { id: 'princess', name: 'PRINCESS', svg: 'princess.svg' },
    { id: 'asscher', name: 'ASSCHER', svg: 'asscher.svg' }
  ];

  const clarityOptions = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
  const colourOptions = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  const cutOptions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

  const handleShapeSelect = (shapeName) => {
    setSelectedShape(shapeName);
    setFilters(prev => ({
      ...prev,
      shape: prev.shape.includes(shapeName)
        ? prev.shape.filter(s => s !== shapeName)
        : [...prev.shape, shapeName]
    }));
  };

  const handleMultiSelect = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleRangeChange = (category, type, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: parseFloat(value)
      }
    }));
  };

  const [selectedClarityGrade, setSelectedClarityGrade] = useState('VS1');
  const [selectedColourGrade, setSelectedColourGrade] = useState('E');

  const handleCaratChange = (value) => {
    const caratValue = parseFloat(value);
    setSelectedCarat(caratValue);
    setFilters(prev => ({
      ...prev,
      carat: { min: caratValue, max: caratValue + 0.3 }
    }));
  };

  const handleSkinToneChange = (value) => {
    setSkinTone(parseFloat(value));
  };

  const getCaratDisplayText = (carat) => {
    return `${carat.toFixed(2)}ct - ${(carat + 0.3).toFixed(2)}ct`;
  };

  // Add these data structures after your existing arrays (after cutOptions)
  const clarityGrades = [
    { id: 'FL', name: 'FL', description: 'Flawless: No inclusions or blemishes visible under 10x magnification.' },
    { id: 'IF', name: 'IF', description: 'Internally Flawless: No inclusions visible under 10x magnification, only minor blemishes on the surface.' },
    { id: 'VVS1', name: 'VVS1', description: 'Very Very Slightly Included 1: Minute inclusions difficult for a skilled grader to see under 10x magnification.' },
    { id: 'VVS2', name: 'VVS2', description: 'Very Very Slightly Included 2: Minute inclusions difficult for a skilled grader to see under 10x magnification.' },
    { id: 'VS1', name: 'VS1', description: 'Very Slightly Included 1: Small inclusions difficult to see with 10x magnification, and will almost always be invisible to the naked eye.' },
    { id: 'VS2', name: 'VS2', description: 'Very Slightly Included 2: Small inclusions somewhat easy to see with 10x magnification.' },
    { id: 'SI1', name: 'SI1', description: 'Slightly Included 1: Inclusions are noticeable to a skilled grader using 10x magnification.' },
    { id: 'SI2', name: 'SI2', description: 'Slightly Included 2: Inclusions are easily noticeable to a skilled grader using 10x magnification.' },
    { id: 'I1', name: 'I1', description: 'Included 1: Inclusions are obvious under 10x magnification and may affect transparency and brilliance.' }
  ];

  const colourGrades = [
    { id: 'D', name: 'D', description: 'Colourless: Absolutely colourless, the highest colour grade.' },
    { id: 'E', name: 'E', description: 'Colourless: Very similar to D colour, except some minute colour differences may be spotted by an expert.' },
    { id: 'F', name: 'F', description: 'Colourless: Slight colour detected by an expert, but still considered colourless.' },
    { id: 'G', name: 'G', description: 'Near Colourless: Colour is noticeable when compared to higher grades, but offers excellent value.' },
    { id: 'H', name: 'H', description: 'Near Colourless: Colour is slightly more noticeable than G, but still appears colourless mounted.' },
    { id: 'I', name: 'I', description: 'Near Colourless: Colour is more noticeable, but still offers good value.' },
    { id: 'J', name: 'J', description: 'Near Colourless: Colour is noticeable, but can appear colourless when mounted in yellow gold.' },
    { id: 'K', name: 'K', description: 'Faint Yellow: Noticeable colour, best mounted in yellow gold to minimize the colour appearance.' },
    { id: 'L', name: 'L', description: 'Faint Yellow: Noticeable colour, best mounted in yellow gold.' },
    { id: 'M', name: 'M', description: 'Faint Yellow: Noticeable colour, best mounted in yellow gold.' }
  ];

  // Add these helper functions after your existing handler functions
  const handleClarityGradeSelect = (grade) => {
    setSelectedClarityGrade(grade);
    // Also update the filters if you want the selection to be part of the filter
    handleMultiSelect('clarity', grade);
  };

  const handleColourGradeSelect = (grade) => {
    setSelectedColourGrade(grade);
    // Also update the filters if you want the selection to be part of the filter
    handleMultiSelect('colour', grade);
  };

  const getSelectedGradeInfo = (grades, selectedGrade) => {
    return grades.find(grade => grade.id === selectedGrade) || grades[0];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'CLARITY':
        const selectedClarityInfo = getSelectedGradeInfo(clarityGrades, selectedClarityGrade);
        return (
          <div className="p-4">
            {/* Clarity Scale */}
            <div className="mb-6">
              <div className="relative flex flex-col justify-between">
                {/* Scale Bar */}
                <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 rounded-full mb-4"></div>
                
                {/* Interactive Scale Labels */}
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  {clarityGrades.map((grade) => (
                    <button
                      key={grade.id}
                      onClick={() => handleClarityGradeSelect(grade.id)}
                      className={`px-2 py-1 rounded transition-all hover:bg-gray-100 ${
                        selectedClarityGrade === grade.id
                          ? 'font-semibold text-white bg-gray-800'
                          : 'hover:text-gray-900'
                      }`}
                    >
                      {grade.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Diamond Diagram */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  {/* Diamond SVG */}
                  <svg width="200" height="120" viewBox="0 0 200 120" className="text-gray-400">
                    {/* Diamond outline */}
                    <path d="M100 10 L160 40 L140 110 L60 110 L40 40 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                    {/* Internal facets */}
                    <path d="M100 10 L100 110" stroke="currentColor" strokeWidth="1"/>
                    <path d="M40 40 L160 40" stroke="currentColor" strokeWidth="1"/>
                    <path d="M60 110 L100 40" stroke="currentColor" strokeWidth="1"/>
                    <path d="M140 110 L100 40" stroke="currentColor" strokeWidth="1"/>
                    <path d="M40 40 L100 40" stroke="currentColor" strokeWidth="1"/>
                    <path d="M160 40 L100 40" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  
                  {/* Magnifying glass circle */}
                  <div className="absolute top-8 right-4 w-12 h-12 border-2 border-blue-400 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Dynamic Description */}
              <div className="bg-gray-800 text-white p-3 rounded text-sm">
                <strong>{selectedClarityInfo.name} - {selectedClarityInfo.name === 'FL' ? 'Flawless' : 
                         selectedClarityInfo.name === 'IF' ? 'Internally Flawless' :
                         selectedClarityInfo.name.includes('VVS') ? `Very Very Slightly Included ${selectedClarityInfo.name.slice(-1)}` :
                         selectedClarityInfo.name.includes('VS') ? `Very Slightly Included ${selectedClarityInfo.name.slice(-1)}` :
                         selectedClarityInfo.name.includes('SI') ? `Slightly Included ${selectedClarityInfo.name.slice(-1)}` :
                         'Included 1'}:</strong> {selectedClarityInfo.description}
              </div>
            </div>
          </div>
        );

      case 'COLOUR':
        const selectedColourInfo = getSelectedGradeInfo(colourGrades, selectedColourGrade);
        return (
          <div className="p-4">
            {/* Color Scale */}
            <div className="mb-6">
              <div className="relative">
                {/* Scale Bar */}
                <div className="h-2 bg-gradient-to-r from-white via-gray-100 to-yellow-200 rounded-full mb-4 border border-gray-300"></div>
                
                {/* Interactive Scale Labels */}
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  {colourGrades.map((grade) => (
                    <button
                      key={grade.id}
                      onClick={() => handleColourGradeSelect(grade.id)}
                      className={`px-2 py-1 rounded transition-all hover:bg-gray-100 ${
                        selectedColourGrade === grade.id
                          ? 'font-semibold text-white bg-gray-800'
                          : 'hover:text-gray-900'
                      }`}
                    >
                      {grade.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Diamond Diagram */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  {/* Diamond SVG */}
                  <svg width="200" height="140" viewBox="0 0 200 140" className="text-gray-400">
                    {/* Diamond outline */}
                    <path d="M100 20 L160 60 L140 130 L60 130 L40 60 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                    {/* Internal facets */}
                    <path d="M100 20 L100 130" stroke="currentColor" strokeWidth="1"/>
                    <path d="M40 60 L160 60" stroke="currentColor" strokeWidth="1"/>
                    <path d="M60 130 L100 60" stroke="currentColor" strokeWidth="1"/>
                    <path d="M140 130 L100 60" stroke="currentColor" strokeWidth="1"/>
                    <path d="M40 60 L100 60" stroke="currentColor" strokeWidth="1"/>
                    <path d="M160 60 L100 60" stroke="currentColor" strokeWidth="1"/>
                    <path d="M70 20 L130 20" stroke="currentColor" strokeWidth="1"/>
                    <path d="M70 20 L40 60" stroke="currentColor" strokeWidth="1"/>
                    <path d="M130 20 L160 60" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
              
              {/* Dynamic Description */}
              <div className="bg-gray-800 text-white p-3 rounded text-sm">
                <strong>{selectedColourInfo.name} - {selectedColourInfo.name <= 'F' ? 'Colourless' : 
                         selectedColourInfo.name <= 'J' ? 'Near Colourless' : 'Faint Yellow'}:</strong> {selectedColourInfo.description}
              </div>
            </div>
          </div>
        );

      case 'CUT':
  return (
    <div className="p-4">
      {/* Cut Grade Display */}
      <div className="mb-6">
        <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium inline-block mb-2">
          {selectedCutGrade}
        </div>
        
        {/* Interactive Cut Grade Slider */}
        <div className="relative mb-6">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={cutOptions.indexOf(selectedCutGrade)}
              onChange={(e) => {
                const newCutGrade = cutOptions[parseInt(e.target.value)];
                setSelectedCutGrade(newCutGrade);
                handleMultiSelect('cut', newCutGrade);
              }}
              className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer cut-slider"
            />
          </div>
          
          {/* Scale Labels */}
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Excellent</span>
            <span>Very Good</span>
          </div>
        </div>
        
        {/* Cut Grade Image Display */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-64 h-48 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            {selectedCutGrade === 'Excellent' ? (
              <img
                src="/cut_ex.png"
                alt="Excellent Cut Diamond"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : selectedCutGrade === 'Ideal' ? (
              <img
                src="/cut_id.png"
                alt="Ideal Cut Diamond"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="text-gray-500 text-sm">
                {selectedCutGrade} Cut
              </div>
            )}
            
            {/* Fallback content for broken images */}
            <div 
              className="w-full h-full items-center justify-center text-gray-500 text-sm"
              style={{ display: 'none' }}
            >
              {selectedCutGrade} Cut Diamond
            </div>
          </div>
        </div>
        
        {/* Cut Grade Description */}
        <div className="bg-gray-800 text-white p-3 rounded text-sm">
          {selectedCutGrade === 'Excellent' && (
            <span><strong>Excellent Cut:</strong> Exquisite quality cut to create the optimal combination of brilliance and fire. Reflects nearly all light that enters the diamond.</span>
          )}
          {selectedCutGrade === 'Very Good' && (
            <span><strong>Very Good Cut:</strong> High-quality cut that reflects most light entering the diamond, offering excellent brilliance.</span>
          )}
          {selectedCutGrade === 'Good' && (
            <span><strong>Good Cut:</strong> Good quality cut that reflects a majority of light, providing good brilliance at a better value.</span>
          )}
          {selectedCutGrade === 'Fair' && (
            <span><strong>Fair Cut:</strong> Adequate cut quality that reflects some light, but may appear darker or less brilliant.</span>
          )}
          {selectedCutGrade === 'Poor' && (
            <span><strong>Poor Cut:</strong> Cut quality that reflects minimal light, resulting in a dull or dark appearance.</span>
          )}
        </div>
      </div>
      
      {/* Custom Slider Styles */}
      <style jsx>{`
        .cut-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #374151;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .cut-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #374151;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .cut-slider::-webkit-slider-track {
          height: 8px;
          background: #d1d5db;
          border-radius: 4px;
        }
        
        .cut-slider::-moz-range-track {
          height: 8px;
          background: #d1d5db;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );

      case 'CARAT':
        return (
          <div className="p-4">
            {/* Carat Range Display */}
            <div className="mb-6">
              <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium inline-block mb-2">
                {getCaratDisplayText(selectedCarat)}
              </div>
              
              {/* Interactive Carat Scale */}
              <div className="relative mb-6">
                {/* Slider Container */}
                <div className="relative">
                  <input
                    type="range"
                    min="0.25"
                    max="3"
                    step="0.01"
                    value={selectedCarat}
                    onChange={(e) => handleCaratChange(e.target.value)}
                    className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer carat-slider"
                  />
                </div>
                
                {/* Scale Labels */}
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>0.25ct</span>
                  <span>1ct</span>
                  <span>2ct</span>
                  <span>3ct</span>
                </div>
              </div>
              
              {/* Diamond Size Visualization with Layered Images */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-48 h-48 bg-gray-100 border border-gray-200 overflow-hidden">
                  {/* Light skin tone layer */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="https://cullenjewellery.com/_app/immutable/assets/hand_light.R2T1drhK.webp"
                      alt="Light Hand"
                      className="w-full h-full object-contain"
                      style={{ opacity: 1 - (skinTone / 100) }}
                    />
                  </div>
                  
                  {/* Dark skin tone layer */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="https://cullenjewellery.com/_app/immutable/assets/hand_dark.BZClr1PQ.webp"
                      alt="Dark Hand"
                      className="w-full h-full object-contain"
                      style={{ opacity: skinTone / 100 }}
                    />
                  </div>
                  
                  {/* Diamond layer with dynamic sizing and positioning */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="absolute"
                      style={{
                        left: '85.85px',
                        top: '85.85px',
                        transform: `scale(${selectedCarat * 0.8 + 0.5})`
                      }}
                    >
                      <img
                        src="https://cullenjewellery.com/_app/immutable/assets/hand_stone_round.DNPAivQg.webp"
                        alt="Diamond"
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="text-center text-sm text-gray-600 italic mb-6">
                Actual diamond size on size 6 hand
              </div>
              
              {/* Skin tone slider */}
              <div className="relative mb-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={skinTone}
                  onChange={(e) => handleSkinToneChange(e.target.value)}
                  className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer skin-tone-slider"
                />
                
                {/* Light/Dark labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Light</span>
                  <span>Dark</span>
                </div>
              </div>
              
              {/* Alternative: Min/Max Input Fields */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Min Carat</label>
                    <input
                      type="number"
                      step="0.01"
                      value={filters.carat.min}
                      onChange={(e) => handleRangeChange('carat', 'min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Max Carat</label>
                    <input
                      type="number"
                      step="0.01"
                      value={filters.carat.max}
                      onChange={(e) => handleRangeChange('carat', 'max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Custom Slider Styles */}
            <style jsx>{`
              .carat-slider::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                background: #374151;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              
              .carat-slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: #374151;
                border-radius: 50%;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              
              .carat-slider::-webkit-slider-track {
                height: 8px;
                background: #d1d5db;
                border-radius: 4px;
              }
              
              .carat-slider::-moz-range-track {
                height: 8px;
                background: #d1d5db;
                border-radius: 4px;
              }
              
              .skin-tone-slider::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                background: #374151;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              
              .skin-tone-slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: #374151;
                border-radius: 50%;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              
              .skin-tone-slider::-webkit-slider-track {
                height: 8px;
                background: linear-gradient(to right, #f9fafb, #6b7280);
                border-radius: 4px;
              }
              
              .skin-tone-slider::-moz-range-track {
                height: 8px;
                background: linear-gradient(to right, #f9fafb, #6b7280);
                border-radius: 4px;
              }
            `}</style>
          </div>
        );

setSelectedCarat(1.0);
      case 'SHAPE':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
            ({selectedShape} SELECTED)
              </span>
              <button className="text-sm text-gray-600 hover:text-gray-800">
            SHOW ALL
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {shapes.map((shape) => (
            <div
              key={shape.id}
              onClick={() => handleShapeSelect(shape.name)}
              className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                filters.shape.includes(shape.name)
                  ? 'border-gray-800 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={`/images/shapes/${shape.svg}`}
                alt={shape.name}
                className="w-8 h-8 brightness-0 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <span
                className="text-xs text-center text-gray-700"
                style={{ display: 'none' }}
              >
                {shape.name}
              </span>
            </div>
              ))}
            </div>
          </div>
        );
      case 'DEPTH':
        return (
          <div className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  value={filters.depth.min}
                  onChange={(e) => handleRangeChange('depth', 'min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  value={filters.depth.max}
                  onChange={(e) => handleRangeChange('depth', 'max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );
      case 'TABLE':
        return (
          <div className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  value={filters.table.min}
                  onChange={(e) => handleRangeChange('table', 'min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  value={filters.table.max}
                  onChange={(e) => handleRangeChange('table', 'max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );
      case 'L/W RATIO':
        return (
          <div className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.lwRatio.min}
                  onChange={(e) => handleRangeChange('lwRatio', 'min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.lwRatio.max}
                  onChange={(e) => handleRangeChange('lwRatio', 'max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-[9998] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Filter Panel */}
      <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] max-w-xl bg-white rounded-t-sm shadow-2xl z-[9999] transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Top Tabs */}
        <div className="border-b">
          <div className="flex">
            {topTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-[10px] font-semibold text-gintoNord transition-colors ${
                  activeTab === tab
                    ? 'flex-1 px-4 py-3 text-[10px] font-semibold text-gintoNord text-black bg-green-50 border-b-2 border-green-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Center Content Area */}
        <div className="min-h-96 bg-gray-50 max-h-[50vh] overflow-y-auto">
          {renderTabContent()}
        </div>

        {/* Footer with Reset/Apply buttons */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button
            onClick={() => {
              setFilters({
                clarity: [],
                colour: [],
                cut: [],
                carat: { min: 0, max: 10 },
                shape: ['ROUND'],
                depth: { min: 0, max: 100 },
                table: { min: 0, max: 100 },
                lwRatio: { min: 0, max: 3 }
              });
              setSelectedShape('ROUND');
            }}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Reset All
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onApplyFilters(filters)}
              className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Bottom Tabs */}
        <div className="border-t">
          <div className="flex">
            {bottomTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-[10px] font-semibold text-gintoNord transition-colors ${
                  activeTab === tab
                    ? 'flex-1 px-4 py-3 text-[10px] font-semibold text-gintoNord text-black bg-green-50 border-t-2 border-green-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowDiamondFilter;