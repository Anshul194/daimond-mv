import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const GreenBoxText = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline for the reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      });

      tl.fromTo(".reveal-text", 
        { 
          y: 100, 
          opacity: 0,
          skewY: 7,
          clipPath: "inset(0 0 100% 0)"
        },
        { 
          y: 0, 
          opacity: 1, 
          skewY: 0,
          clipPath: "inset(0 0 0% 0)",
          stagger: 0.3, 
          duration: 1.5, 
          ease: "expo.out"
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className='bg text-center flex flex-col justify-center items-center lg:py-32 gap-8 p-8 overflow-hidden'>
        <div className="overflow-hidden">
          <p className="reveal-text !text-white text-xl md:text-2xl lg:text-3xl font-arizona max-w-4xl leading-relaxed">
            Fine jewellery to feel good about,{" "}
            <span className="italic !text-white/90">
              made to love for a lifetime.
            </span>
          </p>
        </div>
        <div className="overflow-hidden">
          <p className='reveal-text !text-white/80 text-sm md:text-md lg:text-lg font-gintoNormal max-w-3xl leading-loose font-light tracking-wide'>
            Cullen sets the standard in fine jewellery with a commitment to premium craftsmanship. From our Australian workshop, our jewellers blend tradition and innovation, creating lasting pieces, responsibly.
          </p>
        </div>
    </div>
  )
}

export default GreenBoxText