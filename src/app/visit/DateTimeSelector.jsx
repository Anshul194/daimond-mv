// components/DateTimeSelector.jsx
import { useState } from 'react';

const DateTimeSelector = ({ onDateTimeSelect, selectedDateTime, onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5)); // June 2025
  const [selectedDate, setSelectedDate] = useState(null);

  const timeSlots = [
    '02:45 AM', '04:30 AM', '04:45 AM', '05:30 AM', 
    '06:30 AM', '07:30 AM', '08:30 AM', '09:30 AM', '11:30 AM'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (date, day) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, day);
  };

  const isDateAvailable = (day) => {
    if (!day) return false;
    const date = formatDate(currentDate, day);
    const today = new Date();
    return date >= today;
  };

  const handleDateSelect = (day) => {
    if (!isDateAvailable(day)) return;
    const date = formatDate(currentDate, day);
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    if (!selectedDate) return;
    onDateTimeSelect({
      date: selectedDate,
      time: time,
      formatted: `${selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })} at ${time}`
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
    setSelectedDate(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          ← Back to locations
        </button>
        
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">YOUR TIME: 02:42 PM ASIA/CALCUTTA</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ‹
          </button>
          <h2 className="text-xl font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ›
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {dayNames.map(day => (
            <div key={day} className="text-center font-medium text-gray-600 p-2">
              {day}
            </div>
          ))}
          
          {getDaysInMonth(currentDate).map((day, index) => (
            <div key={index} className="aspect-square">
              {day && (
                <button
                  onClick={() => handleDateSelect(day)}
                  disabled={!isDateAvailable(day)}
                  className={`w-full h-full flex items-center justify-center rounded transition-colors ${
                    !isDateAvailable(day)
                      ? 'text-gray-300 cursor-not-allowed'
                      : selectedDate && selectedDate.getDate() === day
                      ? 'bg-green-700 text-white'
                      : day === 6 || day === 11
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="border-t pt-6">
            <div className="text-center mb-4">
              <h3 className="font-medium text-gray-800">
                {selectedDate.getFullYear()}-{String(selectedDate.getMonth() + 1).padStart(2, '0')}-{String(selectedDate.getDate()).padStart(2, '0')}
              </h3>
              <p className="text-sm text-gray-600">Available times in the Asia/Calcutta time zone</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {timeSlots.map((time, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(time)}
                  className={`px-4 py-2 border rounded transition-colors ${
                    selectedDateTime?.time === time
                      ? 'bg-green-700 text-white border-green-700'
                      : 'border-gray-300 hover:border-green-700 hover:bg-green-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeSelector;