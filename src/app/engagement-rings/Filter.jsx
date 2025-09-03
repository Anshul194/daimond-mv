import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const JewelryFilter = () => {
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedMetal, setSelectedMetal] = useState('platinum');
  const [selectedSetting, setSelectedSetting] = useState('');
  const [selectedBand, setSelectedBand] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [twoTone, setTwoTone] = useState(false);
  const [shapeStartIndex, setShapeStartIndex] = useState(0);

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

  const metals = [
    { id: 'platinum', name: '18K WHITE GOLD', color: 'bg-gray-300' },
    { id: 'yellow-gold', name: '18K YELLOW GOLD', color: 'bg-yellow-300' },
    { id: 'rose-gold', name: '18K ROSE GOLD', color: 'bg-rose-300' },
    { id: 'white-gold', name: '18K WHITE GOLD', color: 'bg-gray-400' }
  ];

  const settings = [
    { id: 'trilogy', name: 'TRILOGY', svg: 'Trilogy.svg' },
    { id: 'solitaire', name: 'SOLITAIRE', svg: 'Solitaires.svg' },
    { id: 'halo', name: 'HALO', svg: 'Halo.svg' },
    { id: 'toi-et-moi', name: 'TOI ET MOI', svg: 'Toi et Moi.svg' },
    { id: 'bezel', name: 'BEZEL', svg: 'Bezel.svg' },
    { id: 'east-west', name: 'EAST WEST', svg: 'East West.svg' }
  ];

  const bands = [
    { id: 'plain', name: 'PLAIN', svg: 'Plain.svg' },
    { id: 'pave', name: 'PAVÉ', svg: 'Pavé.svg' },
    { id: 'accents', name: 'ACCENTS', svg: 'Accents.svg' }
  ];

  const profiles = [
    { id: 'high-set', name: 'HIGH SET', svg: 'HighSet.svg' },
    { id: 'low-set', name: 'LOW SET', svg: 'LowSet.svg' }
  ];

  const visibleShapes = shapes.slice(shapeStartIndex, shapeStartIndex + 8);
  const canScrollLeft = shapeStartIndex > 0;
  const canScrollRight = shapeStartIndex + 8 < shapes.length;

  const scrollShapes = (direction) => {
    if (direction === 'left' && canScrollLeft) {
      setShapeStartIndex(shapeStartIndex - 1);
    } else if (direction === 'right' && canScrollRight) {
      setShapeStartIndex(shapeStartIndex + 1);
    }
  };

  // Calculate progress percentage properly
  const totalPages = Math.ceil(shapes.length / 8);
  const currentPage = Math.ceil((shapeStartIndex + 8) / 8);
  const progressPercentage = (currentPage / totalPages) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      {/* Top Two Sections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Shape Section */}
        <div className=" ">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord">SHAPE ?</h3>
          </div>
        
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollShapes('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full ${canScrollLeft ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-50 cursor-not-allowed'}`}
            >
              <ChevronLeft className={`w-4 h-4 ${canScrollLeft ? 'text-gray-600' : 'text-gray-300'}`} />
            </button>
            
            <div className="flex gap-4 flex-1 overflow-hidden">
              {visibleShapes.map((shape) => (
                <div
                  key={shape.id}
                  onClick={() => setSelectedShape(shape.id)}
                  className={`flex flex-col items-center cursor-pointer  rounded-lg transition-all ${
                    selectedShape === shape.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-14 h-14 flex items-center justify-center mb-2 ${
                    selectedShape === shape.id ? 'border-gray-400 bg-white' : 'border-gray-200'
                  }`}>
                    <img 
                      src={`/images/shapes/${shape.svg}`} 
                      alt={shape.name}
                      className="w-8 h-8 brightness-0 object-contain"
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="text-lg text-gray-400 hidden">◈</span>
                  </div>
                  <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord">{shape.name}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => scrollShapes('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full ${canScrollRight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-50 cursor-not-allowed'}`}
            >
              <ChevronRight className={`w-4 h-4 ${canScrollRight ? 'text-gray-600' : 'text-gray-300'}`} />
            </button>
          </div>
        
          {/* Progress indicator - contained within the box */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-gray-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metal Type Section */}
        <div className=" ">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord">METAL TYPE ?</h3>
            <label className="flex items-center gap-2 text-[10px] font-gintoNord text-gray-600">
              <input
                type="checkbox"
                checked={twoTone}
                onChange={(e) => setTwoTone(e.target.checked)}
                className="rounded "
              />
              TWO TONE
            </label>
          </div>
          
          <div className="flex gap-4 justify-center">
            {metals.map((metal) => (
              <div
                key={metal.id}
                onClick={() => setSelectedMetal(metal.id)}
                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${
                  selectedMetal === metal.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full mb-2 border-2 ${
                  selectedMetal === metal.id ? 'border-gray-400' : 'border-gray-200'
                } ${metal.color}`}></div>
                <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord">{metal.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Three Sections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-8">
        {/* Setting Style - take 3 out of 6 columns (half) */}
        <div className="lg:col-span-3">
          <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord mb-4">SETTING STYLE ?</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {settings.map((setting) => (
              <div
                key={setting.id}
                onClick={() => setSelectedSetting(setting.id)}
                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all min-w-[80px] ${
                  selectedSetting === setting.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-10 flex items-center justify-center mb-2 border ${
                  selectedSetting === setting.id ? 'border-gray-400 bg-white' : 'border-gray-200'
                } rounded`}>
                  <img 
                    src={`/images/settings/${setting.svg}`} 
                    alt={setting.name}
                    className="w-8 h-6 object-contain brightness-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="w-6 h-4 bg-gray-300 rounded-sm hidden"></div>
                </div>
                <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap">{setting.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Band Type - take 1.5 out of 6 columns */}
        <div className="lg:col-span-2 w-fit">
          <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord mb-4">BAND TYPE ?</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {bands.map((band) => (
              <div
                key={band.id}
                onClick={() => setSelectedBand(band.id)}
                className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all min-w-[80px] ${
                  selectedBand === band.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-16 h-8 flex items-center justify-center mb-2 border ${
                  selectedBand === band.id ? 'border-gray-400 bg-white' : 'border-gray-200'
                } rounded`}>
                  <img 
                    src={`/images/bands/${band.svg}`} 
                    alt={band.name}
                    className="w-12 h-6 object-contain brightness-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="w-12 h-4 bg-gray-300 rounded-sm hidden"></div>
                </div>
                <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap">{band.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Setting Profile - take 1.5 out of 6 columns */}
        <div className="lg:col-span-1">
          <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord mb-4">SETTING PROFILE ?</h3>
          <div className="flex gap-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => setSelectedProfile(profile.id)}
                className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all min-w-[100px] ${
                  selectedProfile === profile.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-16 h-12 flex items-center justify-center mb-2 border ${
                  selectedProfile === profile.id ? 'border-gray-400 bg-white' : 'border-gray-200'
                } rounded`}>
                  <img 
                    src={`/images/setting-profile/${profile.svg}`} 
                    alt={profile.name}
                    className="w-12 h-8 object-contain brightness-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="w-12 h-6 bg-gray-300 rounded-sm hidden"></div>
                </div>
                <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap font-gintoNord">{profile.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryFilter;