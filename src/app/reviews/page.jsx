'use client';

import React, { useState, useEffect } from 'react';
import Reviews from '@/components/homepage/Reviews';

const AllReviewsPage = () => {
    return (
        <main className="min-h-screen bg-[#FEFAF5] pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-arizona font-normal text-black mb-6">
                        Our Client Stories
                    </h1>
                    <p className="text-lg text-gray-700 font-gintoNormal max-w-2xl mx-auto leading-relaxed">
                        Discover the experiences of our clients who found their perfect piece at Cullen Jewelry.
                        We take pride in our craftsmanship and dedicated service.
                    </p>
                </div>

                {/* Reusing the Reviews component but we can also build a grid here if preferred */}
                {/* For now, the user wants "Read Our Reviews" which usually leads to a dedicated list */}

                <div className="space-y-12">
                    <Reviews isProductReview={false} />
                </div>

                <div className="mt-20 border-t border-gray-200 pt-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="text-3xl font-bold text-[#004643] mb-2">9,700+</div>
                            <div className="text-sm uppercase tracking-widest text-gray-600">Happy Clients</div>
                        </div>
                        <div className="p-6">
                            <div className="text-3xl font-bold text-[#004643] mb-2">4.9/5</div>
                            <div className="text-sm uppercase tracking-widest text-gray-600">Average Rating</div>
                        </div>
                        <div className="p-6">
                            <div className="text-3xl font-bold text-[#004643] mb-2">100%</div>
                            <div className="text-sm uppercase tracking-widest text-gray-600">Conflict Free</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AllReviewsPage;
