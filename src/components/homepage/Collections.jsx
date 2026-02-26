'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Collections = ({ className = "" }) => {
  const [activeCollection, setActiveCollection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef(null);
  const imagePanelRef = useRef(null);
  const imageRef = useRef(null);
  const imageOverlayRef = useRef(null);
  const contentRef = useRef(null);
  const eyebrowRef = useRef(null);
  const navItemsRef = useRef([]);
  const shimmerLineRef = useRef(null);
  const counterRef = useRef(null);
  const prevActiveRef = useRef(0);

  const collections = [
    { name: 'READY-TO-SHIP', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop' },
    { name: 'STATEMENT',     image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop' },
    { name: 'MINIMAL',       image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop' },
    { name: 'STACKER',       image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop' },
    { name: 'BEZEL',         image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop' },
    { name: 'EAST-WEST',     image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop' },
  ];

  /* ── section entry animations ── */
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    const ctx = gsap.context(() => {
      // ── Immediately lock elements in their hidden FROM state ──
      // This ensures they are invisible BEFORE the scroll trigger fires,
      // no matter how fast the page loads.
      gsap.set(imagePanelRef.current, { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(imageRef.current,      { scale: 1.15 });
      gsap.set(eyebrowRef.current,    { y: 20, opacity: 0, filter: 'blur(8px)' });
      gsap.set(shimmerLineRef.current,{ scaleX: 0, transformOrigin: 'left center' });
      gsap.set(navItemsRef.current,   { y: 35, opacity: 0, filter: 'blur(10px)' });
      gsap.set(counterRef.current,    { y: 16, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          once: true,
        },
      });

      /* image panel: clip-path wipe from left */
      tl.to(imagePanelRef.current,
        { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power4.inOut' },
        0
      );

      /* image subtle zoom-in entry */
      tl.to(imageRef.current,
        { scale: 1, duration: 1.8, ease: 'power3.out' },
        0
      );

      /* eyebrow text */
      tl.to(eyebrowRef.current,
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
        0.5
      );

      /* shimmer line draws itself */
      tl.to(shimmerLineRef.current,
        { scaleX: 1, duration: 1, ease: 'power2.out' },
        0.6
      );

      /* nav items staggered blur+slide reveal */
      tl.to(navItemsRef.current,
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
        },
        0.7
      );

      /* counter */
      tl.to(counterRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        1.1
      );
    }, containerRef);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      ctx.revert();
    };
  }, []);

  /* ── image cross-fade on collection change (desktop) ── */
  useEffect(() => {
    if (isMobile) return;
    prevActiveRef.current = activeCollection;

    if (!imageRef.current || !imageOverlayRef.current) return;

    const tl = gsap.timeline();

    /* quick overlay flash → wipe in new image */
    tl.fromTo(
      imageOverlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.18, ease: 'power1.in' }
    )
      .set(imageRef.current, { opacity: 0 })
      .to(imageOverlayRef.current, { opacity: 0, duration: 0.15, ease: 'power1.out' })
      .fromTo(
        imageRef.current,
        { scale: 1.08, opacity: 0, filter: 'blur(6px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' }
      );
  }, [activeCollection, isMobile]);

  /* ── nav item mouse-enter parallel image preview ── */
  const handleNavEnter = (index) => {
    if (isAnimating || isMobile) return;
    setActiveCollection(index);
    /* subtle y nudge on hovered label */
    gsap.to(navItemsRef.current[index], {
      x: 6,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleNavLeave = (index) => {
    gsap.to(navItemsRef.current[index], {
      x: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    });
  };

  /* ── slide helpers ── */
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveCollection((prev) => (prev + 1) % collections.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveCollection((prev) => (prev - 1 + collections.length) % collections.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleDragStart  = (clientX) => { if (isAnimating) return; setIsDragging(true); setDragStart(clientX); setDragOffset(0); };
  const handleDragMove   = (clientX) => { if (!isDragging || isAnimating) return; const o = clientX - dragStart; setDragOffset(Math.max(-100, Math.min(100, o))); };
  const handleDragEnd    = () => { if (!isDragging || isAnimating) return; if (dragOffset > 50) prevSlide(); else if (dragOffset < -50) nextSlide(); setIsDragging(false); setDragOffset(0); };

  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove  = (e) => { if (Math.abs(e.touches[0].clientX - dragStart) > 10) { e.preventDefault(); handleDragMove(e.touches[0].clientX); } };
  const handleTouchEnd   = () => handleDragEnd();
  const handleMouseDown  = (e) => { if (isMobile) return; handleDragStart(e.clientX); };
  const handleMouseMove  = (e) => { if (isMobile) return; handleDragMove(e.clientX); };
  const handleMouseUp    = () => { if (isMobile) return; handleDragEnd(); };

  const getPrevIndex = () => (activeCollection - 1 + collections.length) % collections.length;
  const getNextIndex = () => (activeCollection + 1) % collections.length;

  return (
    <div
      ref={containerRef}
      className={`${isMobile ? 'flex flex-col' : `flex ${className}`} h-fit bg-[#FEFAF5] overflow-hidden`}
    >
      {isMobile ? (
        <>
          {/* ── Mobile header ── */}
          <div className="bg px-6 py-10 text-center flex-shrink-0">
            <h2 className="!text-white/60 text-[10px] font-medium font-gintoNord tracking-[0.2em] mb-4">
              RING COLLECTIONS
            </h2>
            <h3 className="!text-white text-3xl font-light tracking-wider font-arizona">
              {collections[activeCollection].name}
            </h3>
          </div>

          {/* ── Mobile slider ── */}
          <div
            className="bg relative h-fit py-12 overflow-hidden select-none lg:flex-1"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            <div className="flex items-center justify-center h-fit px-4">
              <div className="relative w-full max-w-xs h-[400px]">
                {/* Previous */}
                <div
                  className={`absolute left-0 top-1/2 w-56 h-full transition-all ease-out ${isDragging ? 'duration-0' : 'duration-600'}`}
                  style={{ transform: `translateY(-50%) translateX(${-20 + (dragOffset * 0.2)}px) scale(0.8)`, opacity: 0.4, zIndex: 1 }}
                  onClick={() => !isDragging && !isAnimating && prevSlide()}
                >
                  <div className="w-full h-full overflow-hidden">
                    <img src={collections[getPrevIndex()].image} alt={collections[getPrevIndex()].name} className="w-full h-full object-cover" draggable={false} />
                  </div>
                </div>

                {/* Current */}
                <div
                  className={`absolute left-1/2 top-1/2 w-64 h-full transition-all ease-out ${isDragging ? 'duration-0' : 'duration-600'}`}
                  style={{ transform: `translate(-50%, -50%) translateX(${dragOffset}px) scale(${1 - Math.abs(dragOffset) * 0.002})`, opacity: 1, zIndex: 10 }}
                >
                  <div className="w-full h-full overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <img src={collections[activeCollection].image} alt={collections[activeCollection].name} className="w-full h-full object-cover" draggable={false} />
                  </div>
                </div>

                {/* Next */}
                <div
                  className={`absolute right-0 top-1/2 w-56 h-full transition-all ease-out ${isDragging ? 'duration-0' : 'duration-600'}`}
                  style={{ transform: `translateY(-50%) translateX(${20 + (dragOffset * 0.2)}px) scale(0.8)`, opacity: 0.4, zIndex: 1 }}
                  onClick={() => !isDragging && !isAnimating && nextSlide()}
                >
                  <div className="w-full h-full overflow-hidden">
                    <img src={collections[getNextIndex()].image} alt={collections[getNextIndex()].name} className="w-full h-full object-cover" draggable={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ── Desktop: Image Panel ── */}
          <div
            ref={imagePanelRef}
            className="w-1/2 relative bg-gray-50 overflow-hidden select-none h-[600px]"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="h-full w-full flex items-center justify-center relative">
              {/* overlay flash layer */}
              <div
                ref={imageOverlayRef}
                className="absolute inset-0 bg-[#FEFAF5] z-10 pointer-events-none"
                style={{ opacity: 0 }}
              />

              <img
                ref={imageRef}
                src={collections[activeCollection].image}
                alt={collections[activeCollection].name}
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* subtle dark vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* collection name floating bottom-left */}
              <div className="absolute bottom-6 left-6 z-20">
                <p className="text-white/80 text-[10px] tracking-[0.25em] font-gintoNord uppercase">
                  {String(activeCollection + 1).padStart(2, '0')} / {String(collections.length).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          {/* ── Desktop: Content Panel ── */}
          <div className="w-1/2 bg flex flex-col justify-center items-center px-8 py-12 h-[600px]">
            <div ref={contentRef} className="text-center space-y-2 max-w-md w-full">

              {/* eyebrow */}
              <h2
                ref={eyebrowRef}
                className="!text-white/50 text-[10px] font-light font-gintoNord tracking-[0.35em] mb-3"
              >
                RING COLLECTIONS
              </h2>

              {/* shimmer line */}
              <div
                ref={shimmerLineRef}
                className="mx-auto mb-10 h-[1px] w-12 bg-gradient-to-r from-white/10 via-white/50 to-white/10"
                style={{ transformOrigin: 'left center', transform: 'scaleX(0)' }}
              />

              {/* nav */}
              <nav className="space-y-5">
                {collections.map((collection, index) => (
                  <div key={index} className="relative group">
                    <button
                      ref={(el) => (navItemsRef.current[index] = el)}
                      className={`text-white text-3xl font-light font-arizona tracking-wider transition-all duration-500 block w-full text-center relative overflow-hidden ${
                        index === activeCollection
                          ? 'opacity-100 scale-105 italic'
                          : 'opacity-35 hover:opacity-80'
                      }`}
                      onClick={() => setActiveCollection(index)}
                      onMouseEnter={() => handleNavEnter(index)}
                      onMouseLeave={() => handleNavLeave(index)}
                      disabled={isAnimating}
                    >
                      {collection.name}

                      {/* active underline that animates in */}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-white/40 transition-all duration-500 ${
                          index === activeCollection ? 'w-10 opacity-100' : 'w-0 opacity-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </nav>

              {/* counter */}
              <div
                ref={counterRef}
                className="mt-10 flex items-center justify-center gap-4"
              >
                <button
                  onClick={prevSlide}
                  disabled={isAnimating}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <span className="text-white/40 text-[10px] tracking-[0.3em] font-gintoNord">
                  {String(activeCollection + 1).padStart(2, '0')} &nbsp;/&nbsp; {String(collections.length).padStart(2, '0')}
                </span>

                <button
                  onClick={nextSlide}
                  disabled={isAnimating}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Collections;