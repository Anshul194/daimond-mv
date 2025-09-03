'use client';

import React, { useState, useRef, useEffect } from 'react'

const Reviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)
  const [expandedReviews, setExpandedReviews] = useState({})
  const [maxHeight, setMaxHeight] = useState(240)
  const sliderRef = useRef(null)
  const cardRefs = useRef([])

  const reviews = [
    {
      type: 'summary',
      googleRating: '5.0',
      googleReviews: '9727 reviews',
      trustpilotRating: '5.0'
    },
    {
      type: 'review',
      platform: 'Google',
      name: 'ERIC KENT',
      rating: 5,
      timeAgo: '13 hours ago',
      review: 'Jack was a great guy me and my missus enjoyed his people skills',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      type: 'review', 
      platform: 'Google',
      name: 'DAVID TRAN',
      rating: 5,
      timeAgo: '13 hours ago',
      review: 'A fantastic experience with this Jeweller. We got engaged without a ring, and so my partner was able to design the ring she always wanted with Cullen. And what a result. Mock ups, photoshop and email communication led to the creation of a cad drawing by Cullen\'s designers. Then we chose a diamond — from their incredible collection of high-quality stones. The entire process was seamless and professional, with excellent customer service throughout. I would highly recommend Cullen to anyone looking for custom jewelry work.',
      readMore: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      type: 'review',
      platform: 'Google', 
      name: 'KERRY',
      rating: 5,
      timeAgo: '1 day ago',
      review: 'How did I not know about this place before! Incredible knowledge of their craft and nothing was too much trouble. Would definitely recommend to anyone looking for quality jewelry and exceptional service. The team went above and beyond to ensure we were completely satisfied with our purchase.',
      readMore: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      type: 'review',
      platform: 'Google',
      name: 'SARAH JOHNSON',
      rating: 5,
      timeAgo: '2 days ago',
      review: 'Absolutely stunning work! The team at Cullen created the perfect engagement ring. Professional service from start to finish.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b632?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      type: 'review',
      platform: 'Google',
      name: 'MICHAEL BROWN',
      rating: 5,
      timeAgo: '3 days ago',
      review: 'Exceptional quality and craftsmanship. The custom design process was seamless and the final result exceeded all expectations.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      type: 'review',
      platform: 'Google',
      name: 'EMMA WILSON',
      rating: 5,
      timeAgo: '4 days ago',
      review: 'Beautiful rings and outstanding customer service. The staff were knowledgeable and helped us find exactly what we were looking for. The entire experience was wonderful from consultation to final purchase. I couldn\'t be happier with the quality and service provided by the Cullen team.',
      readMore: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      type: 'review',
      platform: 'Google',
      name: 'JAMES MILLER',
      rating: 5,
      timeAgo: '5 days ago',
      review: 'Incredible attention to detail and superb quality. Highly recommend Cullen for anyone looking for exceptional jewelry.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      type: 'review',
      platform: 'Google',
      name: 'OLIVIA DAVIS',
      rating: 5,
      timeAgo: '1 week ago',
      review: 'Amazing experience from consultation to delivery. The ring is absolutely perfect and the service was exceptional throughout.',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      type: 'review',
      platform: 'Google',
      name: 'RYAN GARCIA',
      rating: 5,
      timeAgo: '1 week ago',
      review: 'Top-notch service and beautiful jewelry. The team made the entire process easy and enjoyable. Couldn\'t be happier with our rings. The craftsmanship is outstanding and the customer service exceeded our expectations. We will definitely be returning for future jewelry needs.',
      readMore: true,
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  ]

  // Function to determine items per view based on screen size
  const updateItemsPerView = () => {
    const width = window.innerWidth
    if (width < 768) {
      setItemsPerView(1) // Mobile: 1 item
    } else if (width < 1024) {
      setItemsPerView(2) // Tablet: 2 items
    } else if (width < 1280) {
      setItemsPerView(3) // Small desktop: 3 items
    } else {
      setItemsPerView(4) // Large desktop: 4 items
    }
  }

  // Set up resize listener
  useEffect(() => {
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  // Reset slide when items per view changes
  useEffect(() => {
    setCurrentSlide(0)
  }, [itemsPerView])

  const maxSlides = Math.max(0, reviews.length - itemsPerView)
  const slideWidth = 100 / itemsPerView

  const nextSlide = () => {
    if (currentSlide < maxSlides) {
      setCurrentSlide(prev => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  // Function to calculate and update max height
  const updateMaxHeight = () => {
    // Check if any reviews are expanded
    const hasExpandedReviews = Object.values(expandedReviews).some(expanded => expanded)
    
    if (!hasExpandedReviews) {
      setMaxHeight(240)
      return
    }

    // Calculate heights for all cards, considering expanded state
    const heights = cardRefs.current.map((ref, index) => {
      if (ref) {
        if (expandedReviews[index]) {
          // For expanded reviews, calculate the height needed for full content
          const contentHeight = ref.scrollHeight
          return Math.max(contentHeight, 240)
        } else {
          // For non-expanded reviews, use minimum height
          return 240
        }
      }
      return 240
    })
    
    const newMaxHeight = Math.max(240, ...heights)
    setMaxHeight(newMaxHeight)
  }

  // Update max height when expanded reviews change
  useEffect(() => {
    // Use a longer timeout to ensure DOM has updated after text expansion
    setTimeout(updateMaxHeight, 150)
  }, [expandedReviews])

  // Reset max height when no reviews are expanded
  useEffect(() => {
    const hasExpandedReviews = Object.values(expandedReviews).some(expanded => expanded)
    if (!hasExpandedReviews) {
      setMaxHeight(240)
    }
  }, [expandedReviews])

  // Function to toggle review expansion
  const toggleReviewExpansion = (index) => {
    setExpandedReviews(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Function to truncate text to approximately 4 lines
  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - sliderRef.current.offsetLeft)
    setScrollLeft(currentSlide)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 0.5
    const newSlide = Math.round(scrollLeft - walk / 100)
    const clampedSlide = Math.max(0, Math.min(maxSlides, newSlide))
    setCurrentSlide(clampedSlide)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setScrollLeft(currentSlide)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const x = e.touches[0].clientX
    const walk = (x - startX) * 0.5
    const newSlide = Math.round(scrollLeft - walk / 100)
    const clampedSlide = Math.max(0, Math.min(maxSlides, newSlide))
    setCurrentSlide(clampedSlide)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const GoogleLogo = () => (
    <div className="inline-flex items-center gap-1">
      <span className="text-blue-500 text-lg font-medium">G</span>
      <span className="text-red-500 text-lg font-medium">o</span>
      <span className="text-yellow-500 text-lg font-medium">o</span>
      <span className="text-blue-500 text-lg font-medium">g</span>
      <span className="text-green-500 text-lg font-medium">l</span>
      <span className="text-red-500 text-lg font-medium">e</span>
    </div>
  )

  const TrustpilotLogo = () => (
    <div className="inline-flex items-center gap-2">
      <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <span className="text-green-600 font-semibold text-lg">Trustpilot</span>
    </div>
  )

  const StarRating = ({ rating }) => (
    <div className="inline-flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )

  return (
    <div className="relative py-16">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-arizona font-light text-black mb-3">
            What Our Clients Say
          </h2>
          <p className="text-black font-gintoNormal text-sm font-light">
            Here's what our clients have to say about their Cullen experience.
          </p>
        </div>

        {/* Reviews Slider Container */}
        <div className="bg p-6 relative">
          <div className=" overflow-hidden">
            <div
              ref={sliderRef}
              className={`flex transition-transform duration-500 ease-in-out items-start ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{
                transform: `translateX(-${currentSlide * slideWidth}%)`,
              }}
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
                  style={{ 
                    width: `${slideWidth}%`
                  }}
                >
                  <div 
                    ref={el => cardRefs.current[index] = el}
                    className="bg-white p-4 md:p-6 transition-all  duration-300 shadow-sm border border-gray-100"
                    style={{ height: `${maxHeight}px` }}
                  >
                    {item.type === 'summary' ? (
                      // Summary Card
                      <div className="space-y-6">
                        {/* Google Section */}
                        <div className="text-center flex items-center justify-between">
                          <GoogleLogo />
                          <TrustpilotLogo />
                        </div>

                        {/* Trustpilot Section */}
                        <div className="text-center">
                          <div className="mt-3">
                             <div className="mt-3 flex items-center justify-between">
                            <div className='flex items-center gap-2'>
                                <div className="text-2xl font-bold text-gray-900 mb-1">{item.googleRating}</div>
                            <StarRating rating={5} />
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{item.googleReviews}</div>
                          </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <button className="w-full bg-green-700 text-white py-3 px-4 text-[10px] font-semibold uppercase tracking-wide hover:bg-green-800 transition-colors">
                            WRITE A REVIEW
                          </button>
                          <button className="w-full bg-green-600 text-white py-3 px-4 text-[10px] font-semibold uppercase tracking-wide hover:bg-green-700 transition-colors">
                            READ OUR REVIEWS
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Review Card
                      <div className="space-y-4">
                        {/* Platform Logo */}
                        <GoogleLogo />
                        
                        {/* Reviewer Info */}
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

                        {/* Review Text */}
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

          {/* Navigation arrows */}
          {maxSlides > 0 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200 z-10 group"
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide === maxSlides}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200 z-10 group"
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reviews