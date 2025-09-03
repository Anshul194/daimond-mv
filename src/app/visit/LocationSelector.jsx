// components/LocationSelector.jsx
import { useState } from 'react';

const LocationSelector = ({ onLocationSelect, selectedLocation }) => {
  const locations = [
    {
      id: 'virtual',
      name: 'Virtual Consultation',
      description: 'Experience a personalised and in-depth online consultation with one of our jewellery specialists.',
      duration: '40 MINUTES',
      image: '/api/placeholder/150/100'
    },
    {
      id: 'melbourne',
      name: 'Melbourne',
      address: '401/322 High St, Kew, VIC, AU',
      phone: '+61130087670',
      image: '/api/placeholder/150/100'
    },
    {
      id: 'sydney',
      name: 'Sydney',
      address: 'Level 7/14 Castlereagh St, Sydney, NSW, AU',
      phone: '+61296550412',
      image: '/api/placeholder/150/100'
    },
    {
      id: 'brisbane',
      name: 'Brisbane',
      address: '12 Lvl 34 Queen St, Brisbane, 4000, AU',
      phone: '+61730150702',
      image: '/api/placeholder/150/100'
    },
    {
      id: 'perth',
      name: 'Perth',
      address: '6/94 Rokeby Rd, Subiaco, 6008, AU',
      phone: '+61864580836',
      image: '/api/placeholder/150/100'
    },
    {
      id: 'adelaide',
      name: 'Adelaide',
      address: 'Office 1, Level 2, 104 Frome Street, Adelaide, 5000, AU',
      phone: '+61870051719',
      image: '/api/placeholder/150/100'
    },
    {
      id: 'auckland',
      name: 'Auckland',
      address: 'Level 5, 9 High Street, Auckland Central, 1010, NZ',
      phone: '+6496731896',
      image: '/api/placeholder/150/100'
    },
    {
      id: 'london',
      name: 'London',
      address: '89 Great Eastern Street, Hackney, London, EC2A 3HX, GB',
      phone: '+447883406054',
      image: '/api/placeholder/150/100'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-gray-800 mb-4">Book An Appointment</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Book an appointment today at one of our conveniently located showrooms and view a range of our most 
          popular engagement rings and wedding bands. We can also assist you with jewellery repairs, resizing and 
          custom made pieces.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex border-b justify-between">
          <button className="px-6 py-5 flex-1 text-sm font-gintoNord bg-green-700 text-white font-medium">
            CHOOSE A LOCATION
          </button>
          <button className="px-6 py-5 flex-1 text-sm font-gintoNord text-gray-500">
            CHOOSE A SERVICE
          </button>
          <button className="px-6 py-5 flex-1 text-sm font-gintoNord text-gray-500">
            DATE/TIME
          </button>
          <button className="px-6 py-5 flex-1 text-sm font-gintoNord text-gray-500">
            YOUR DETAILS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {locations.map((location) => (
          <div 
            key={location.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedLocation?.id === location.id ? 'border-green-700 shadow-lg' : 'border-gray-200'
            }`}
            onClick={() => onLocationSelect(location)}
          >
            <div className="h-32 bg-gray-200">
              <img 
                src={location.image} 
                alt={location.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800 mb-2">{location.name}</h3>
              {location.description && (
                <p className="text-sm text-gray-600 mb-2">{location.description}</p>
              )}
              {location.address && (
                <p className="text-sm text-gray-600 mb-1">📍 {location.address}</p>
              )}
              {location.phone && (
                <p className="text-sm text-gray-600 mb-2">📞 {location.phone}</p>
              )}
              {location.duration && (
                <p className="text-[10px] text-gray-500 mb-3">{location.duration}</p>
              )}
              <button 
                className={`w-full py-2 px-4 text-white font-medium transition-colors ${
                  selectedLocation?.id === location.id 
                    ? 'bg-green-800' 
                    : 'bg-green-700 hover:bg-green-800'
                }`}
              >
                {selectedLocation?.id === location.id ? 'SELECTED' : 'SELECT'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSelector;