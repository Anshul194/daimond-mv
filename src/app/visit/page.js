'use client';

import { useState } from 'react';
import LocationSelector from './LocationSelector';
import DateTimeSelector from './DateTimeSelector';
import UserDetailsForm from './UserDetailsForm';

const Visit = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // Skip service selection step since it's always Virtual Consultation
    setCurrentStep(3); // Go directly to date/time
  };

  const handleDateTimeSelect = (dateTime) => {
    setSelectedDateTime(dateTime);
    setCurrentStep(4); // Go to user details
  };

  const handleFormSubmit = (formData) => {
    // Here you would typically send the data to your backend
    console.log('Booking submitted:', {
      location: selectedLocation,
      dateTime: selectedDateTime,
      userDetails: formData
    });
    
    setBookingConfirmed(true);
    
    // You could also redirect or show a success message
    alert('Booking confirmed! You will receive a confirmation email shortly.');
  };

  const goBackToLocations = () => {
    setCurrentStep(1);
    setSelectedLocation(null);
    setSelectedDateTime(null);
  };

  const goBackToDateTime = () => {
    setCurrentStep(3);
    setSelectedDateTime(null);
  };

  const renderProgressBar = () => {
    const steps = [
      { id: 1, label: 'CHOOSE A LOCATION', active: currentStep === 1 },
      { id: 2, label: 'CHOOSE A SERVICE', active: false, skipped: true },
      { id: 3, label: 'DATE/TIME', active: currentStep === 3 },
      { id: 4, label: 'YOUR DETAILS', active: currentStep === 4 }
    ];

    return (
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="flex relative">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative flex-1 ${index === 0 ? '' : 'ml-[-1px]'}`}
            >
              <div
                className={`relative px-8 py-4 font-medium text-sm transition-colors ${
                  step.active
                    ? 'bg-green-700 text-white'
                    : step.skipped
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-100 text-gray-500'
                } `}
              >
                {step.label}
              </div>
              <div className="absolute -right-4 top-0 bottom-0 w-0 h-0 border-t-[2rem] border-b-[1.9rem] border-l-[1rem] border-t-transparent border-b-transparent border-l-green-700 z-10"></div>

            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderServiceInfo = () => {
    if (currentStep === 1) return null;
    
    return (
      <div className="w-full max-w-6xl mx-auto mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">SERVICE</h3>
            <p className="text-gray-600">Virtual Consultation</p>
          </div>
        </div>
      </div>
    );
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for booking your appointment. You will receive a confirmation email shortly with all the details.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-medium text-gray-800 mb-2">Appointment Details:</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Location:</strong> {selectedLocation?.name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Service:</strong> Virtual Consultation
              </p>
              <p className="text-sm text-gray-600">
                <strong>Date & Time:</strong> {selectedDateTime?.formatted}
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentStep(1);
                setSelectedLocation(null);
                setSelectedDateTime(null);
                setBookingConfirmed(false);
              }}
              className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-colors"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-4">
        {currentStep !== 1 && renderProgressBar()}
        {renderServiceInfo()}
        
        {currentStep === 1 && (
          <LocationSelector
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
        )}
        
        {currentStep === 3 && (
          <DateTimeSelector
            onDateTimeSelect={handleDateTimeSelect}
            selectedDateTime={selectedDateTime}
            onBack={goBackToLocations}
          />
        )}
        
        {currentStep === 4 && (
          <UserDetailsForm
            selectedDateTime={selectedDateTime}
            onBack={goBackToDateTime}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Visit;