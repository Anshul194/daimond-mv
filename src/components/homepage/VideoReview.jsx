"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const FALLBACK_REELS = [
  { image: "/images/home-slide-one/one.webp", reelUrl: "https://www.instagram.com/cullenjewellery/reel/DIxxgBsRSNc/" },
  { image: "/images/home-slide-one/two.webp", reelUrl: "https://www.instagram.com/cullenjewellery/reel/DI2bo4CSDft/" },
  { image: "/images/home-slide-one/three.jpg", reelUrl: "https://www.instagram.com/cullenjewellery/reel/DIxxgBsRSNc/" },
  { image: "/images/home-slide-one/four.webp", reelUrl: "https://www.instagram.com/cullenjewellery/reel/DI2bo4CSDft/" },
]

const FALLBACK_HEADER = {
  title: 'Instagram',
  description: 'Learn, engage and grow. Connect with Cullen for all things engagement, wedding and fine jewellery.'
}

const VideoReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const [reels, setReels] = useState(FALLBACK_REELS)
  const [header, setHeader] = useState(FALLBACK_HEADER)
  const [loading, setLoading] = useState(true)

  const sliderRef = useRef(null)
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const subTextRef = useRef(null)
  const dividerRef = useRef(null)
  const reelRefs = useRef([])

  /* 
  // STATIC CONTENT (KEEPING AS COMMENT PER USER REQUEST)
  const reelData = [
    { image: "/images/home-slide-one/one.webp",   reelUrl: "https://www.instagram.com/cullenjewellery/reel/DIxxgBsRSNc/" },
    { image: "/images/home-slide-one/two.webp",   reelUrl: "https://www.instagram.com/cullenjewellery/reel/DI2bo4CSDft/" },
    { image: "/images/home-slide-one/three.jpg",  reelUrl: "https://www.instagram.com/cullenjewellery/reel/DIxxgBsRSNc/" },
    { image: "/images/home-slide-one/four.webp",  reelUrl: "https://www.instagram.com/cullenjewellery/reel/DI2bo4CSDft/" },
  ]
  */

  // ── Fetch Dynamic Data ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reelsRes, headerRes] = await Promise.all([
          fetch('/api/instagram-reels', { cache: 'no-store' }),
          fetch('/api/instagram-header', { cache: 'no-store' })
        ]);

        const [reelsData, headerData] = await Promise.all([
          reelsRes.json(),
          headerRes.json()
        ]);

        if (reelsData.success && reelsData.data?.length > 0) {
          setReels(reelsData.data);
        }
        if (headerData.success && headerData.data) {
          setHeader(headerData.data);
        }
      } catch (error) {
        console.error("Error fetching Instagram content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Responsive items per view ──
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setItemsPerView(4)
      else if (window.innerWidth >= 768) setItemsPerView(2)
      else setItemsPerView(1)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const maxSlides = Math.max(0, reels.length - itemsPerView)
  const slideWidth = 100 / itemsPerView

  const nextSlide = () => { if (currentSlide < maxSlides) setCurrentSlide(p => p + 1) }
  const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(p => p - 1) }

  // ── Drag / touch ──
  const handleMouseDown = (e) => { setIsDragging(true); setStartX(e.pageX - sliderRef.current.offsetLeft); setScrollLeft(currentSlide); e.preventDefault() }
  const handleMouseMove = (e) => { if (!isDragging) return; e.preventDefault(); const x = e.pageX - sliderRef.current.offsetLeft; const walk = (x - startX) * 0.5; setCurrentSlide(Math.max(0, Math.min(maxSlides, Math.round(scrollLeft - walk / 100)))) }
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => setIsDragging(false)
  const handleTouchStart = (e) => { setIsDragging(true); setStartX(e.touches[0].clientX); setScrollLeft(currentSlide) }
  const handleTouchMove = (e) => { if (!isDragging) return; const x = e.touches[0].clientX; const walk = (x - startX) * 0.5; setCurrentSlide(Math.max(0, Math.min(maxSlides, Math.round(scrollLeft - walk / 100)))) }
  const handleTouchEnd = () => setIsDragging(false)

  const handleReelClick = (url) => window.open(url, "_blank")

  // ── GSAP Animations ──
  useEffect(() => {
    if (loading && reels.length === FALLBACK_REELS.length) {
      // Just proceed if we're using fallback
    }

    const ctx = gsap.context(() => {
      // Lock all elements in hidden FROM state immediately on mount
      gsap.set(headingRef.current, { y: 30, opacity: 0, filter: "blur(10px)" })
      gsap.set(subTextRef.current, { y: 18, opacity: 0, filter: "blur(6px)" })
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "center center", opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          once: true,
        },
      })

      // Heading blur→sharp slide-up
      tl.to(headingRef.current, {
        y: 0, opacity: 1, filter: "blur(0px)",
        duration: 1, ease: "power3.out",
      })

        // Subtext
        .to(subTextRef.current, {
          y: 0, opacity: 1, filter: "blur(0px)",
          duration: 0.8, ease: "power3.out",
        }, "-=0.65")

        // Decorative divider line draws itself out from center
        .to(dividerRef.current, {
          scaleX: 1, opacity: 1,
          duration: 0.9, ease: "power2.inOut",
        }, "-=0.5")

      // Reel cards cascade up with clip-path reveal
      if (reelRefs.current.length > 0) {
        gsap.set(reelRefs.current.filter(Boolean), {
          y: 60,
          opacity: 0,
          clipPath: "inset(100% 0% 0% 0%)",
        })
        tl.to(reelRefs.current.filter(Boolean), {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          stagger: 0.12,
          duration: 0.9,
          ease: "power4.out",
        }, "-=0.4")
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [loading, reels.length])

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto px-4 py-16">

      {/* ── Header ── */}
      <div className="text-center mb-12">
        <h1
          ref={headingRef}
          className="text-2xl md:text-3xl font-arizona font-light text-gray-800 mb-3"
        >
          {header.title}
        </h1>

        {/* decorative divider */}
        <div
          ref={dividerRef}
          className="mx-auto mb-4 h-[1px] w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
          style={{ transform: "scaleX(0)", opacity: 0 }}
        />

        <p
          ref={subTextRef}
          className="text-gray-600 font-gintoNormal text-[10px]"
        >
          {header.description}
        </p>
      </div>

      {/* ── Slider ── */}
      <div className="relative overflow-hidden">
        <div
          ref={sliderRef}
          className={`flex transition-transform duration-500 ease-in-out ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ transform: `translateX(-${currentSlide * slideWidth}%)` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {reels.map((reel, index) => (
            <div
              key={reel._id || index}
              ref={el => reelRefs.current[index] = el}
              className="flex-shrink-0 px-4"
              style={{ width: `${slideWidth}%` }}
            >
              <div
                className="group cursor-pointer"
                onClick={() => handleReelClick(reel.reelUrl)}
              >
                {/* Reel Image */}
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden mb-6 relative">
                  {/* inner image scales on hover */}
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${reel.image})`, backgroundPosition: "center center" }}
                  />

                  {/* dark gradient overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                  {/* Instagram icon */}
                  <div className="absolute top-3 right-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 1.25a.5.5 0 01.5.5v5.5a.5.5 0 01-.5.5H12a.5.5 0 01-.5-.5V1.75a.5.5 0 01.5-.5h5.5zm-1 1H13v4.5h3.5V2.25zm-8.25 2a.5.5 0 01.5-.5H14a.5.5 0 01.5.5v1.5a.5.5 0 01-.5.5H8.75a.5.5 0 01-.5-.5v-1.5zm1 .5v.5h4.5v-.5h-4.5zM7.25 8a.5.5 0 01.5-.5h8.5a.5.5 0 01.5.5v12a.5.5 0 01-.5.5h-8.5a.5.5 0 01-.5-.5V8zm1 .5V19.5h7.5V8.5h-7.5z" />
                      <rect x="2" y="2" width="20" height="20" rx="3" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* play icon overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
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