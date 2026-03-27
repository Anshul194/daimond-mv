'use client';

import React, { useState } from 'react';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import axiosInstance from '@/axiosConfig/axiosInstance';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const ReviewForm = ({ onSuccess, onCancel, productId = null }) => {
  const { isAuthenticated, user: loggedInUser } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(loggedInUser?.name || '');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      formData.append('reviewerName', reviewerName || 'Anonymous');

      if (productId) {
        formData.append('product', productId);
        formData.append('isWebsiteReview', 'false');
      } else {
        formData.append('isWebsiteReview', 'true');
      }

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
    <div className="bg-[#FEFAF5] p-6 md:p-8 max-w-xl mx-auto rounded-none shadow-xl border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-arizona font-normal text-[#004643]">Share Your Experience</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-black transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-2">Display Name</label>
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="w-full border-b border-gray-300 bg-transparent py-2 focus:border-[#004643] outline-none transition-colors font-gintoNormal text-sm text-black"
            placeholder="e.g. Jane Smith"
          />
          {!isAuthenticated && (
            <p className="text-[10px] text-gray-400 mt-1">Submit as a guest or <Link href="/signin" className="underline hover:text-[#004643]">sign in</Link></p>
          )}
        </div>

        {/* Rating Field */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none group"
              >
                <Star
                  className={`w-8 h-8 transition-all ${star <= rating ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-200 hover:text-yellow-200'}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Field */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-2">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 bg-white rounded-none p-4 focus:border-[#004643] outline-none transition-colors font-gintoNormal text-sm text-black h-32 resize-none"
            placeholder="Describe your journey with us..."
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-2">Attach Photos (Optional)</label>
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => {
              let url = "";
              try { url = URL.createObjectURL(image); } catch (e) { }
              return (
                <div key={index} className="relative w-20 h-20 border border-gray-200 bg-white flex items-center justify-center overflow-hidden transition-all hover:scale-105">
                  <img src={url} alt="preview" className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-[#004643] text-white rounded-full p-1 shadow-md hover:bg-black transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            <label className="w-20 h-20 border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-[#004643] group transition-all">
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#004643]" />
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Upload</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-[10px] p-3 border border-red-100 uppercase tracking-widest">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-[#004643] text-[#004643] py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-[#004643] hover:text-white transition-all duration-300"
          >
            Go Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#004643] text-white py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
