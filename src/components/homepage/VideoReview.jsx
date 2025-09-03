"use client"

import { useState, useRef, useEffect } from "react"

const VideoReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const sliderRef = useRef(null)

  const reelData = [
    {
      image: "/images/home-slide-one/one.webp",
      reelUrl: "https://www.instagram.com/cullenjewellery/reel/DIxxgBsRSNc/",
    },
    {
      image: "/images/home-slide-one/two.webp",
      reelUrl: "https://www.instagram.com/cullenjewellery/reel/DI2bo4CSDft/",
    },
    {
      image: "/images/home-slide-one/three.jpg",
      reelUrl: "https://www.instagram.com/cullenjewellery/reel/DIxxgBsRSNc/",
    },
    {
      image: "/images/home-slide-one/four.webp",
      reelUrl: "https://www.instagram.com/cullenjewellery/reel/DI2bo4CSDft/",
    },
  ]

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4) // lg: show 4
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2) // md: show 2
      } else {
        setItemsPerView(1) // sm: show 1
      }
    }

    updateItemsPerView()
    window.addEventListener("resize", updateItemsPerView)
    return () => window.removeEventListener("resize", updateItemsPerView)
  }, [])

  const maxSlides = Math.max(0, reelData.length - itemsPerView)

  const nextSlide = () => {
    if (currentSlide < maxSlides) {
      setCurrentSlide((prev) => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
    }
  }

  const slideWidth = 100 / itemsPerView

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
    const walk = (x - startX) * 0.5 // Adjust sensitivity
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
    const walk = (x - startX) * 0.5 // Adjust sensitivity
    const newSlide = Math.round(scrollLeft - walk / 100)
    const clampedSlide = Math.max(0, Math.min(maxSlides, newSlide))
    setCurrentSlide(clampedSlide)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleReelClick = (reelUrl) => {
    window.open(reelUrl, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-arizona font-light text-gray-800 mb-3">
          Instagram
        </h1>
        <p className="text-gray-600 font-gintoNormal text-[10px]">
          Learn, engage and grow. Connect with Cullen for all things engagement, wedding and fine jewellery.
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden">
        <div
          ref={sliderRef}
          className={`flex transition-transform duration-500 ease-in-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
          {reelData.map((reel, index) => (
            <div key={index} className="flex-shrink-0 px-4" style={{ width: `${slideWidth}%` }}>
              <div className="group cursor-pointer" onClick={() => handleReelClick(reel.reelUrl)}>
                {/* Reel Image Container */}
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden mb-6 relative transition-transform duration-300 ease-in-out hover:scale-105">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${reel.image})`,
                      backgroundPosition: "center center",
                    }}
                  />
                  
                  {/* Instagram Reel Icon */}
                  <div className="absolute top-3 right-3">
                    <svg
                      className="w-6 h-6 text-white drop-shadow-lg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.5 1.25a.5.5 0 01.5.5v5.5a.5.5 0 01-.5.5H12a.5.5 0 01-.5-.5V1.75a.5.5 0 01.5-.5h5.5zm-1 1H13v4.5h3.5V2.25zm-8.25 2a.5.5 0 01.5-.5H14a.5.5 0 01.5.5v1.5a.5.5 0 01-.5.5H8.75a.5.5 0 01-.5-.5v-1.5zm1 .5v.5h4.5v-.5h-4.5zM7.25 8a.5.5 0 01.5-.5h8.5a.5.5 0 01.5.5v12a.5.5 0 01-.5.5h-8.5a.5.5 0 01-.5-.5V8zm1 .5V19.5h7.5V8.5h-7.5z"/>
                      <rect x="2" y="2" width="20" height="20" rx="3" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoReviews