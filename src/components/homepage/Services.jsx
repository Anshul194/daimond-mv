import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const FALLBACK_SERVICES = [
  {
    title: "SHOWROOMS",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Jewelry showroom with display cases and seating area",
    link: "/meet",
  },
  {
    title: "APPOINTMENTS",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Hand trying on engagement ring during consultation",
    link: "/meet",
  },
  {
    title: "CUSTOM RINGS",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Craftsperson working on custom jewelry with tools",
    link: "/custom-made-engagement-rings",
  },
  {
    title: "GET IN TOUCH",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Jewelry consultation with rings on display tray",
    link: "/contact",
  },
];

const ServicesGrid = () => {
  const containerRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/service?status=active&limit=20`);
        if (res.ok) {
          const data = await res.json();
          const docs = data?.data?.docs || [];
          setServices(docs.length > 0 ? docs : FALLBACK_SERVICES);
        } else {
          setServices(FALLBACK_SERVICES);
        }
      } catch (_) {
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (loading || services.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".service-tile",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading, services]);

  const getImageSrc = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image}`;
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 py-24">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-arizona font-light text-black mb-6 tracking-wide">
          Our Services
        </h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed font-light tracking-wide uppercase">
          Receive custom engagement ring guidance from our expert team in person
          and online.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {services.map((service, index) => {
          const content = (
            <div key={service.title || index} className="service-tile group cursor-pointer opacity-0">
              {/* Service Image Container */}
              <div className="relative overflow-hidden bg-gray-50 mb-6">
                <div className="aspect-[4/5] md:aspect-[3/4]">
                  <img
                    src={getImageSrc(service.image)}
                    alt={service.alt || service.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Service Title with Arrow */}
              <div className="flex items-center justify-start gap-4">
                <h3 className="text-[10px] font-semibold font-gintoNord text-gray-900 tracking-[0.2em] uppercase">
                  {service.title}
                </h3>
                <svg
                  className="w-5 h-4 text-gray-400 group-hover:translate-x-2 transition-all duration-500 group-hover:text-[#004643]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                  <line
                    x1="0"
                    y1="12"
                    x2="15"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          );

          if (service.link) {
            return (
              <a href={service.link} key={service.title || index} className="block">
                {content}
              </a>
            );
          }
          return content;
        })}
      </div>
    </div>
  );
};

export default ServicesGrid;
