// components/UserDetailsForm.jsx
import { useState } from 'react';

const UserDetailsForm = ({ selectedDateTime, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    consultationType: '',
    diamondInterest: '',
    specificRing: '',
    location: '',
    subscribeNewsletter: true,
    receiveMarketing: true,
    privacyPolicy: false,
    termsConditions: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.privacyPolicy || !formData.termsConditions) {
      alert('Please agree to the privacy policy and terms & conditions');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          ← Back to calendar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Phone Number *
          </label>
          <div className="flex">
            <div className="flex items-center px-3 py-2 border border-gray-300 border-r-0 rounded-l-md bg-gray-50">
              <img src="/api/placeholder/20/15" alt="IN" className="w-5 h-3 mr-2" />
              <span className="text-sm">IN</span>
            </div>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleInputChange}
              className="px-2 py-2 border border-gray-300 border-r-0 bg-white focus:outline-none"
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+61">+61</option>
            </select>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="081234 56789"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Consultation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What type of consultation are you after? *
          </label>
          <select
            name="consultationType"
            value={formData.consultationType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">-</option>
            <option value="engagement-rings">Engagement Rings</option>
            <option value="wedding-bands">Wedding Bands</option>
            <option value="custom-design">Custom Design</option>
            <option value="repairs">Repairs & Resizing</option>
            <option value="general">General Consultation</option>
          </select>
        </div>

        {/* Diamond Interest */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Are you interested in looking at lab grown diamonds, moissanite, or both? *
          </label>
          <select
            name="diamondInterest"
            value={formData.diamondInterest}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">-</option>
            <option value="lab-grown">Lab Grown Diamonds</option>
            <option value="moissanite">Moissanite</option>
            <option value="both">Both</option>
            <option value="not-sure">Not Sure</option>
          </select>
        </div>

        {/* Specific Ring */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            If you'd like to view a specific ring, please list it below. Note, some styles may be unavailable at the time of your appointment.
          </label>
          <textarea
            name="specificRing"
            value={formData.specificRing}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where are you joining us from?
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter your location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Appointment Details */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Date:</span>
              <span className="ml-2">
                {selectedDateTime?.date?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <div>
              <span className="font-medium">Starts at:</span>
              <span className="ml-2">{selectedDateTime?.time}</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-600 mt-2">
            (in the Asia/Calcutta time zone)
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="subscribeNewsletter"
              checked={formData.subscribeNewsletter}
              onChange={handleInputChange}
              className="mt-1 mr-3"
            />
            <span className="text-sm text-gray-700">Subscribe to our mailing list?</span>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              name="receiveMarketing"
              checked={formData.receiveMarketing}
              onChange={handleInputChange}
              className="mt-1 mr-3"
            />
            <span className="text-sm text-gray-700">Receive support and marketing messages via text message</span>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              name="privacyPolicy"
              checked={formData.privacyPolicy}
              onChange={handleInputChange}
              className="mt-1 mr-3"
              required
            />
            <span className="text-sm text-gray-700">
              I agree with the <a href="#" className="text-blue-600 underline">Cullen Jewellery Privacy Policy</a> *
            </span>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              name="termsConditions"
              checked={formData.termsConditions}
              onChange={handleInputChange}
              className="mt-1 mr-3"
              required
            />
            <span className="text-sm text-gray-700">
              I agree with the <a href="#" className="text-blue-600 underline">SimplyBook.me Terms & Conditions</a> *
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 px-4 rounded-md font-medium hover:bg-green-800 transition-colors"
        >
          CONFIRM BOOKING
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;