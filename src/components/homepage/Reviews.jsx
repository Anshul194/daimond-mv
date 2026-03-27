'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReviewForm from '../ReviewForm';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Reviews = ({ isProductReview = false, productId = null }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [maxHeight, setMaxHeight] = useState(240);
  const [showForm, setShowForm] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const sliderRef = useRef(null);
  const cardRefs = useRef([]);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subTextRef = useRef(null);
  const sliderWrapRef = useRef(null);
  const navBtnRefs = useRef([]);

  /* 
  const reviews = [
    {
      type: 'summary',
      googleRating: '5.0',
      googleReviews: '9727 reviews',
      trustpilotRating: '5.0',
    },
    { type: 'review', platform: 'Google', name: 'ERIC KENT',      rating: 5, timeAgo: '13 hours ago', review: 'Jack was a great guy me and my missus enjoyed his people skills', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { type: 'review', platform: 'Google', name: 'DAVID TRAN',     rating: 5, timeAgo: '13 hours ago', review: "A fantastic experience with this Jeweller. We got engaged without a ring, and so my partner was able to design the ring she always wanted with Cullen. And what a result. Mock ups, photoshop and email communication led to the creation of a cad drawing by Cullen's designers. Then we chose a diamond — from their incredible collection of high-quality stones. The entire process was seamless and professional, with excellent customer service throughout. I would highly recommend Cullen to anyone looking for custom jewelry work.", readMore: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { type: 'review', platform: 'Google', name: 'KERRY',          rating: 5, timeAgo: '1 day ago',    review: "How did I not know about this place before! Incredible knowledge of their craft and nothing was too much trouble. Would definitely recommend to anyone looking for quality jewelry and exceptional service. The team went above and beyond to ensure we were completely satisfied with our purchase.", readMore: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { type: 'review', platform: 'Google', name: 'SARAH JOHNSON',  rating: 5, timeAgo: '2 days ago',   review: 'Absolutely stunning work! The team at Cullen created the perfect engagement ring. Professional service from start to finish.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b632?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { type: 'review', platform: 'Google', name: 'MICHAEL BROWN',  rating: 5, timeAgo: '3 days ago',   review: 'Exceptional quality and craftsmanship. The custom design process was seamless and the final result exceeded all expectations.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { type: 'review', platform: 'Google', name: 'EMMA WILSON',    rating: 5, timeAgo: '4 days ago',   review: "Beautiful rings and outstanding customer service. The staff were knowledgeable and helped us find exactly what we were looking for. The entire experience was wonderful from consultation to final purchase. I couldn't be happier with the quality and service provided by the Cullen team.", readMore: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { type: 'review', platform: 'Google', name: 'JAMES MILLER',   rating: 5, timeAgo: '5 days ago',   review: 'Incredible attention to detail and superb quality. Highly recommend Cullen for anyone looking for exceptional jewelry.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { type: 'review', platform: 'Google', name: 'OLIVIA DAVIS',   rating: 5, timeAgo: '1 week ago',   review: 'Amazing experience from consultation to delivery. The ring is absolutely perfect and the service was exceptional throughout.', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { type: 'review', platform: 'Google', name: 'RYAN GARCIA',    rating: 5, timeAgo: '1 week ago',   review: "Top-notch service and beautiful jewelry. The team made the entire process easy and enjoyable. Couldn't be happier with our rings. The craftsmanship is outstanding and the customer service exceeded our expectations. We will definitely be returning for future jewelry needs.", readMore: true, avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
  ];
  */

  const [reviews, setReviews] = useState([
    {
      type: 'summary',
      googleRating: '5.0',
      googleReviews: '9727 reviews',
      trustpilotRating: '5.0',
    }
  ]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) return 'Just now';
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let url = '/api/review?limit=20';
        if (isProductReview && productId) {
          url += `&product=${productId}`;
        } else {
          url += '&isWebsiteReview=true';
        }

        const filters = { status: 'approved' };
        if (isProductReview && productId) filters.product = productId;
        else filters.isWebsiteReview = true;

        url = `/api/review?limit=20&filters=${encodeURIComponent(JSON.stringify(filters))}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.data.results) {
          const stats = data.data.stats || { averageRating: 5.0, totalReviews: data.data.totalDocuments };

          const dynamicReviews = data.data.results.map(rev => ({
            type: 'review',
            platform: 'Google',
            name: rev.reviewerName || rev.user?.name || 'Anonymous',
            rating: rev.rating,
            timeAgo: formatTimeAgo(rev.createdAt),
            review: rev.comment,
            avatar: rev.user?.profilepic || rev.user?.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
          }));

          setReviews([
            {
              type: 'summary',
              googleRating: stats.averageRating.toFixed(1),
              googleReviews: `${stats.totalReviews} reviews`,
              trustpilotRating: stats.averageRating.toFixed(1),
            },
            ...dynamicReviews
          ]);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [fetchTrigger]);

  // ── Responsive items-per-view ──
  const updateItemsPerView = () => {
    const w = window.innerWidth;
    if (w < 768) setItemsPerView(1);
    else if (w < 1024) setItemsPerView(2);
    else if (w < 1280) setItemsPerView(3);
    else setItemsPerView(4);
  };

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  useEffect(() => { setCurrentSlide(0); }, [itemsPerView, reviews.length]);

  const maxSlides = Math.max(0, reviews.length - itemsPerView);
  const slideWidth = 100 / itemsPerView;

  const nextSlide = () => { if (currentSlide < maxSlides) setCurrentSlide(p => p + 1); };
  const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(p => p - 1); };

  // ── Max height logic ──
  const updateMaxHeight = () => {
    const hasExpanded = Object.values(expandedReviews).some(Boolean);
    if (!hasExpanded) { setMaxHeight(240); return; }
    const heights = cardRefs.current.map((ref, i) =>
      ref ? (expandedReviews[i] ? Math.max(ref.scrollHeight, 240) : 240) : 240
    );
    setMaxHeight(Math.max(240, ...heights));
  };

  useEffect(() => { setTimeout(updateMaxHeight, 150); }, [expandedReviews]);

  useEffect(() => {
    if (!Object.values(expandedReviews).some(Boolean)) setMaxHeight(240);
  }, [expandedReviews]);

  const toggleReviewExpansion = (i) =>
    setExpandedReviews(prev => ({ ...prev, [i]: !prev[i] }));

  const truncateText = (text, max = 120) =>
    text.length <= max ? text : text.substring(0, max).trim() + '...';

  // ── Drag / touch handlers ──
  const handleMouseDown = (e) => { setIsDragging(true); setStartX(e.pageX - sliderRef.current.offsetLeft); setScrollLeft(currentSlide); e.preventDefault(); };
  const handleMouseMove = (e) => { if (!isDragging) return; e.preventDefault(); const x = e.pageX - sliderRef.current.offsetLeft; const walk = (x - startX) * 0.5; setCurrentSlide(Math.max(0, Math.min(maxSlides, Math.round(scrollLeft - walk / 100)))); };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);
  const handleTouchStart = (e) => { setIsDragging(true); setStartX(e.touches[0].clientX); setScrollLeft(currentSlide); };
  const handleTouchMove = (e) => { if (!isDragging) return; const x = e.touches[0].clientX; const walk = (x - startX) * 0.5; setCurrentSlide(Math.max(0, Math.min(maxSlides, Math.round(scrollLeft - walk / 100)))); };
  const handleTouchEnd = () => setIsDragging(false);

  // ── GSAP Animations ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Immediately set all animated elements to hidden FROM state
      gsap.set(headingRef.current, { y: 30, opacity: 0, filter: 'blur(8px)' });
      gsap.set(subTextRef.current, { y: 20, opacity: 0, filter: 'blur(6px)' });
      gsap.set(sliderWrapRef.current, { y: 50, opacity: 0 });
      const visibleCards = cardRefs.current.filter(Boolean);
      gsap.set(visibleCards, { y: 40, opacity: 0, filter: 'blur(6px)' });
      gsap.set(navBtnRefs.current.filter(Boolean), { scale: 0.7, opacity: 0 });

      // ── Header timeline ──
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          once: true,
        },
      });

      headerTl
        .to(headingRef.current, {
          y: 0, opacity: 1, filter: 'blur(0px)',
          duration: 1, ease: 'power3.out',
        })
        .to(subTextRef.current, {
          y: 0, opacity: 1, filter: 'blur(0px)',
          duration: 0.8, ease: 'power3.out',
        }, '-=0.6')
        .to(sliderWrapRef.current, {
          y: 0, opacity: 1,
          duration: 0.9, ease: 'power3.out',
        }, '-=0.5')
        // staggered card cascade
        .to(visibleCards, {
          y: 0, opacity: 1, filter: 'blur(0px)',
          stagger: 0.08,
          duration: 0.65,
          ease: 'power3.out',
        }, '-=0.4')
        // nav buttons pop in
        .to(navBtnRefs.current.filter(Boolean), {
          scale: 1, opacity: 1,
          stagger: 0.1,
          duration: 0.4,
          ease: 'back.out(1.7)',
        }, '-=0.3');

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Static sub-components ──
  const GoogleLogo = () => (
    <div className="inline-flex items-center gap-1">
      <span className="text-blue-500 text-lg font-medium">G</span>
      <span className="text-red-500 text-lg font-medium">o</span>
      <span className="text-yellow-500 text-lg font-medium">o</span>
      <span className="text-blue-500 text-lg font-medium">g</span>
      <span className="text-green-500 text-lg font-medium">l</span>
      <span className="text-red-500 text-lg font-medium">e</span>
    </div>
  );

  const TrustpilotLogo = () => (
    <div className="inline-flex items-center gap-2">
      <div className="w-6 h-6 bg-[#004643] rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      <span className="text-[#004643] font-semibold text-lg">Trustpilot</span>
    </div>
  );

  const StarRating = ({ rating }) => (
    <div className="inline-flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div ref={sectionRef} className="relative py-16">
      <div className="w-full mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <h2
            ref={headingRef}
            className="text-2xl md:text-3xl font-arizona font-light text-black mb-3"
          >
            What Our Clients Say
          </h2>
          <p
            ref={subTextRef}
            className="text-black font-gintoNormal text-sm font-light"
          >
            Here's what our clients have to say about their Cullen experience.
          </p>
        </div>


        {/* ── Slider Container ── */}
        <div ref={sliderWrapRef} className="bg-[#004643] p-6 md:p-12 relative">
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className={`flex transition-transform duration-500 ease-in-out items-start ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ transform: `translateX(-${currentSlide * slideWidth}%)` }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {reviews.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${slideWidth}%` }}
                >
                  <div
                    ref={el => cardRefs.current[index] = el}
                    className="bg-[#FEFAF5] p-4 md:p-6 transition-all duration-300 shadow-sm border border-gray-100"
                    style={{ height: `${maxHeight}px` }}
                  >
                    {item.type === 'summary' ? (
                      <div className="space-y-6">
                        <div className="text-center flex items-center justify-between">
                          <GoogleLogo />
                          <TrustpilotLogo />
                        </div>
                        <div className="text-center">
                          <div className="mt-3">
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="text-2xl font-bold text-gray-900 mb-1">{item.googleRating}</div>
                                <StarRating rating={item.googleRating} />
                              </div>
                              <div className="text-sm text-gray-600 mt-1">{item.googleReviews}</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <button
                            onClick={() => setShowForm(true)}
                            className="w-full bg-[#004643] text-white py-3 px-4 text-[10px] font-semibold uppercase tracking-widest hover:bg-black transition-all duration-300"
                          >
                            WRITE A REVIEW
                          </button>
                          <Link
                            href="/reviews"
                            className="block w-full bg-[#3D6B68] text-white py-3 px-4 text-[10px] font-semibold uppercase tracking-widest hover:bg-[#004643] transition-all duration-300 text-center"
                          >
                            READ OUR REVIEWS
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <GoogleLogo />
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                            <div className="flex items-center gap-2">
                              <StarRating rating={item.rating} />
                              <span className="text-[10px] text-gray-500">{item.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-700 leading-relaxed">
                          {expandedReviews[index] ? item.review : truncateText(item.review)}
                          {(item.readMore || item.review.length > 120) && (
                            <button
                              className="text-blue-600 hover:underline ml-1"
                              onClick={() => toggleReviewExpansion(index)}
                            >
                              {expandedReviews[index] ? 'Hide' : 'Read more'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Navigation Arrows ── */}
          {maxSlides > 0 && (
            <>
              <button
                ref={el => navBtnRefs.current[0] = el}
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200 z-10 group hover:scale-110"
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                ref={el => navBtnRefs.current[1] = el}
                onClick={nextSlide}
                disabled={currentSlide === maxSlides}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200 z-10 group hover:scale-110"
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl animate-in fade-in zoom-in duration-300">
              <ReviewForm
                productId={productId}
                onCancel={() => setShowForm(false)}
                onSuccess={() => {
                  setShowForm(false);
                  setFetchTrigger(p => p + 1);
                }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reviews;