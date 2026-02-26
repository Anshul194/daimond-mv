'use client';

import React, { useState } from 'react';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import axiosInstance from '@/axiosConfig/axiosInstance';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const ReviewForm = ({ onSuccess, onCancel }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="bg-white p-6 max-w-md mx-auto rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-4 text-[#004643]">Please Sign In</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to share your experience with us.</p>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onCancel} 
            className="flex-1 border border-[#004643] text-[#004643] py-2 rounded font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <Link 
            href="/signin" 
            className="flex-1 bg-[#004643] text-white py-2 rounded font-semibold hover:bg-[#003633] flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('comment', comment);
      formData.append('isWebsiteReview', true);
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axiosInstance.post('/api/review', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onSuccess?.();
      } else {
        setError(response.data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 max-w-md mx-auto rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#004643]">Share Your Experience</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#004643] focus:border-[#004643] outline-none"
            rows="4"
            placeholder="Tell us what you loved..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photos (Optional)</label>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => {
                let url = "";
                try {
                    url = URL.createObjectURL(image);
                } catch (e) {}
                return (
                    <div key={index} className="relative w-16 h-16 border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img src={url} alt="preview" className="object-cover w-full h-full" />
                        <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"
                        >
                        <X className="w-3 h-3" />
                        </button>
                    </div>
                )
            })}
            <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-[#004643] text-gray-400 hover:text-[#004643]">
              <Upload className="w-6 h-6" />
              <span className="text-[10px]">Add</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-[#004643] text-[#004643] py-2 rounded font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#004643] text-white py-2 rounded font-semibold hover:bg-[#003633] disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
