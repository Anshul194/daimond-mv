"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '../TransitionLink';

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);

    const mediaRef = useRef(null);
    const sectionRef = useRef(null);
    const wrapperRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await fetch('/api/story?status=active');
                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    setStory(data.data[0]); // Use the latest active story
                }
            } catch (error) {
                console.error("Failed to fetch story:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, []);

    useEffect(() => {
        if (loading || !story) return;

        const ctx = gsap.context(() => {
            // Scroll-driven: slide up from Y + expand 80% → 100%, rounded → square
            gsap.fromTo(
                wrapperRef.current,
                { width: '80%', borderRadius: '24px', y: 120 },
                {
                    width: '100%',
                    borderRadius: '0px',
                    y: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                        end: 'center center',
                        scrub: 1.2,
                    },
                }
            );

            // Parallax effect for Media
            gsap.fromTo(
                mediaRef.current,
                { yPercent: -5 },
                {
                    yPercent: 5,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    },
                }
            );

            // Text reveal
            if (textRef.current) {
                gsap.fromTo(
                    textRef.current.children,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.2,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: textRef.current,
                            start: 'top 80%',
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [loading, story]);

    if (loading || !story) return null;

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen flex items-center justify-center overflow-visible"
        >
            {/* Expanding wrapper */}
            <div
                ref={wrapperRef}
                className="relative overflow-hidden h-full"
                style={{ width: '80%', borderRadius: '24px' }}
            >
                {/* Media Background */}
                <div className="w-full h-full relative">
                    {story.mediaType === 'video' ? (
                        <video
                            ref={mediaRef}
                            className="w-full h-full object-cover scale-110"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                        >
                            <source src={story.mediaUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div ref={mediaRef} className="w-full h-full scale-110">
                            <img src={story.mediaUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                    )}

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40 z-10" />
                </div>

                {/* Content Container */}
                <div
                    ref={textRef}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center"
                >
                    <h2
                        className="text-white text-4xl md:text-5xl lg:text-7xl !text-white font-arizona tracking-wide mb-8 leading-tight"
                        dangerouslySetInnerHTML={{ __html: story.title }}
                    >
                    </h2>

                    <TransitionLink
                        href="/custom-made-engagement-rings"
                        className="group flex items-center space-x-4 bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 text-xs font-medium tracking-[0.2em] uppercase cursor-pointer hover:bg-white hover:text-[#00736C] transition-all duration-500 rounded-sm"
                    >
                        <span>EXPLORE CUSTOM RINGS</span>
                        <svg
                            className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </TransitionLink>
                </div>
            </div>
        </section>
    );
}
