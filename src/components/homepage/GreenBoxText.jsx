'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Diamond SVG ──────────────────────────────────────────────────────────── */
const DiamondIcon = ({ size = 10, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="currentColor" style={style}>
    <polygon points="5,0 10,5 5,10 0,5" />
  </svg>
);

/* ── Word splitter — wraps each word in an overflow-hidden + inner span ────── */
const SplitWords = ({ text, className = '', style = {}, wordClassName = '' }) => {
  if (!text) return null;
  return (
    <span className={className} style={{ ...style, display: 'inline', whiteSpace: 'normal' }}>
      {text.split(' ').map((word, i, arr) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <span className={`gb-word ${wordClassName}`} style={{ display: 'inline-block' }}>
            {word}
          </span>
          {i < arr.length - 1 && (
            <span style={{ display: 'inline-block', width: '0.28em' }} />
          )}
        </span>
      ))}
    </span>
  );
};

/* ── Fallback Data ─────────────────────────────────────────────────────────── */
const FALLBACK_STATS = [
  { _id: 'f1', label: 'Years of craft', value: 25, suffix: '+', float: false, order: 1 },
  { _id: 'f2', label: 'Bespoke pieces', value: 12000, suffix: '+', float: false, order: 2 },
  { _id: 'f3', label: 'Customer rating', value: 4.9, suffix: '★', float: true, order: 3 },
  { _id: 'f4', label: 'Countries served', value: 38, suffix: '+', float: false, order: 4 },
];

const FALLBACK_CONTENT = {
  eyebrow: 'Est. Since',
  headlineLine1: 'Fine jewellery to feel good about,',
  headlineLine2: 'made to love for a lifetime.',
  description: 'Cullen sets the standard in fine jewellery with a commitment to premium craftsmanship. From our Australian workshop, our jewellers blend tradition and innovation, creating lasting pieces, responsibly.',
};

/* ── Component ────────────────────────────────────────────────────────────── */
export default function GreenBoxText() {
  const sectionRef = useRef(null);
  const [dynamicStats, setDynamicStats] = useState([]);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, contentRes] = await Promise.all([
          fetch('/api/home-stats?status=active', { cache: 'no-store' }),
          fetch('/api/green-box', { cache: 'no-store' })
        ]);

        if (!statsRes.ok || !contentRes.ok) {
          console.warn(`GreenBox fetch non-ok: ${statsRes.status} / ${contentRes.status}`);

          // Try to parse any successful response, otherwise use fallback
          const statsData = statsRes.ok ? await statsRes.json() : null;
          const contentData = contentRes.ok ? await contentRes.json() : null;

          const statsBody = statsData?.body || statsData;
          const contentBody = contentData?.body || contentData;

          setDynamicStats((statsBody && statsBody.success && statsBody.data?.length > 0)
            ? statsBody.data
            : FALLBACK_STATS
          );

          setContent((contentBody && contentBody.success && contentBody.data)
            ? contentBody.data
            : FALLBACK_CONTENT
          );

          setLoading(false);
          return;
        }

        const statsData = await statsRes.json();
        const contentData = await contentRes.json();

        // Handle nested body structure if present, else use top level
        const statsBody = statsData.body || statsData;
        const contentBody = contentData.body || contentData;

        if (statsBody.success && statsBody.data?.length > 0) {
          setDynamicStats(statsBody.data);
        } else {
          setDynamicStats(FALLBACK_STATS);
        }

        if (contentBody.success && contentBody.data) {
          setContent(contentBody.data);
        } else {
          setContent(FALLBACK_CONTENT);
        }
      } catch (error) {
        console.error("Error fetching green box data:", error);
        setDynamicStats(FALLBACK_STATS);
        setContent(FALLBACK_CONTENT);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const memoStats = useMemo(() => {
    const s = dynamicStats.length > 0 ? [...dynamicStats] : [...FALLBACK_STATS];
    return s.sort((a, b) => (a.order || 99) - (b.order || 99));
  }, [dynamicStats]);

  const displayContent = content || FALLBACK_CONTENT;

  useEffect(() => {
    if (loading || !displayContent) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const st = {
        trigger: section,
        start: 'top 78%',
        toggleActions: 'play none none none',
      };

      // ── Gold border lines ─────────────────────────────────────────────
      gsap.from(['.gb-ornTop', '.gb-ornBot'], {
        scaleX: 0,
        transformOrigin: 'center',
        duration: 2.0,
        ease: 'expo.inOut',
        stagger: 0.1,
        scrollTrigger: st,
      });

      // ── Eyebrow rule lines ────────────────────────────────────────────
      gsap.from(['.gb-ruleLeft', '.gb-ruleRight'], {
        scaleX: 0,
        duration: 1.5,
        ease: 'expo.inOut',
        stagger: 0.15,
        delay: 0.1,
        scrollTrigger: st,
      });

      // ── Eyebrow text + diamond ────────────────────────────────────────
      gsap.from('.gb-eyebrow', {
        opacity: 0,
        y: 12,
        filter: 'blur(8px)',
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: st,
      });
      gsap.from('.gb-diamond', {
        opacity: 0,
        scale: 0,
        rotate: -45,
        duration: 1.0,
        ease: 'back.out(1.7)',
        delay: 0.25,
        scrollTrigger: st,
      });

      // ── Word-by-word headline reveal ──────────────────────────────────
      gsap.from('.gb-line1 .gb-word', {
        opacity: 0,
        y: 60,
        filter: 'blur(15px)',
        skewX: -5,
        stagger: 0.06,
        duration: 1.2,
        ease: 'expo.out',
        delay: 0.3,
        scrollTrigger: st,
      });

      gsap.from('.gb-line2 .gb-word', {
        opacity: 0,
        y: 60,
        filter: 'blur(15px)',
        skewX: -5,
        stagger: 0.06,
        duration: 1.2,
        ease: 'expo.out',
        delay: 0.6,
        scrollTrigger: st,
      });

      // ── Body paragraph ───────────────────────────────────────────────
      gsap.from('.gb-body .gb-word', {
        opacity: 0,
        y: 20,
        filter: 'blur(10px)',
        stagger: 0.02,
        duration: 1.0,
        ease: 'power2.out',
        delay: 1.0,
        scrollTrigger: st,
      });

      // ── Divider ───────────────────────────────────────────────────────
      gsap.from('.gb-divider', {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'center',
        duration: 1.5,
        ease: 'expo.inOut',
        delay: 1.2,
        scrollTrigger: st,
      });

      // ── Stat cards ────────────────────────────────────────────────────
      gsap.from('.gb-stat', {
        opacity: 0,
        y: 50,
        filter: 'blur(15px)',
        scale: 0.95,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.out',
        delay: 1.4,
        scrollTrigger: {
          trigger: '.gb-stats',
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
        onStart() {
          section.querySelectorAll('.gb-num').forEach((numEl) => {
            const target = parseFloat(numEl.dataset.target);
            const isFloat = numEl.dataset.float === 'true';
            gsap.fromTo(
              numEl,
              { innerText: 0 },
              {
                innerText: target,
                duration: 2.5,
                ease: 'power2.out',
                delay: 0.4,
                snap: { innerText: isFloat ? 0.1 : 1 },
                onUpdate() {
                  const v = parseFloat(this.targets()[0].innerText);
                  numEl.innerText = isFloat
                    ? v.toFixed(1)
                    : Math.round(v).toLocaleString();
                },
              }
            );
          });
        },
      });

      // Parallax noise
      gsap.to('.gb-noise', {
        y: '8%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

    }, section);

    return () => ctx.revert();
  }, [loading, displayContent, memoStats]);

  if (loading && !content) {
    return (
      <section className="h-[600px] flex items-center justify-center bg-[#002e29]">
        <div className="animate-pulse text-white/20 font-arizona text-xl">Loading craftsmanship...</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, #002e29 0%, #004f49 40%, #00736C 70%, #005a54 100%)',
      }}
    >
      {/* Grain */}
      <div
        className="gb-noise pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      />

      <div
        className="gb-ornTop absolute top-0 left-0 w-full h-px opacity-60"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,1) 50%, transparent)' }}
      />
      <div
        className="gb-ornBot absolute bottom-0 left-0 w-full h-px opacity-60"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,1) 50%, transparent)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-12 py-24 lg:py-40">

        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-12">
          <span
            className="gb-ruleLeft block w-20 sm:w-32 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))',
              transformOrigin: 'right center',
            }}
          />
          <span className="gb-diamond flex" style={{ color: 'rgba(212,175,55,0.85)' }}>
            <DiamondIcon size={8} />
          </span>
          <span
            className="gb-eyebrow font-gintoNord text-[10px] uppercase font-normal"
            style={{ color: 'rgba(212,175,55,0.8)', letterSpacing: '0.4em' }}
          >
            {displayContent.eyebrow}
          </span>
          <span className="flex" style={{ color: 'rgba(212,175,55,0.85)' }}>
            <DiamondIcon size={8} />
          </span>
          <span
            className="gb-ruleRight block w-20 sm:w-32 h-px"
            style={{
              background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)',
              transformOrigin: 'left center',
            }}
          />
        </div>

        {/* Headline */}
        <div className="flex flex-col items-center gap-1.5 mb-10">
          <h2
            className="gb-line1 font-arizona text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] px-4 leading-[1.2] font-light"
            style={{ color: '#f5f0e8' }}
          >
            <SplitWords text={displayContent.headlineLine1} />
          </h2>

          <h2
            className="gb-line2 font-arizona text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] px-4 leading-[1.2] italic font-light"
          >
            <SplitWords
              text={displayContent.headlineLine2}
              wordClassName="gb-gold-text"
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #f7e98e 45%, #d4af37 75%, #a07d1c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block'
              }}
            />
          </h2>
        </div>

        {/* Body */}
        <p
          className="gb-body font-gintoNormal text-base sm:text-lg lg:text-xl max-w-3xl leading-[1.8] font-light mb-16 px-4"
          style={{ color: 'rgba(245,240,232,0.65)', letterSpacing: '0.01em' }}
        >
          <SplitWords text={displayContent.description} />
        </p>

        {/* Divider */}
        <div className="gb-divider flex items-center gap-5 mb-16">
          <span className="block h-px w-16 sm:w-24"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
          <DiamondIcon size={7} style={{ color: 'rgba(212,175,55,0.5)', flexShrink: 0 }} />
          <span className="block h-px w-5" style={{ background: 'rgba(212,175,55,0.25)' }} />
          <DiamondIcon size={11} style={{ color: 'rgba(212,175,55,0.85)', flexShrink: 0 }} />
          <span className="block h-px w-5" style={{ background: 'rgba(212,175,55,0.25)' }} />
          <DiamondIcon size={7} style={{ color: 'rgba(212,175,55,0.5)', flexShrink: 0 }} />
          <span className="block h-px w-16 sm:w-24"
            style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
        </div>

        {/* Stats */}
        <div
          className="gb-stats grid grid-cols-2 sm:grid-cols-4 gap-px w-full max-w-4xl"
          style={{
            background: 'rgba(212,175,55,0.15)',
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          {memoStats.map((s, i) => (
            <div
              key={s._id || i}
              className="gb-stat flex flex-col items-center justify-center gap-3 py-10 px-4"
              style={{ background: 'rgba(0,46,41,0.6)', backdropFilter: 'blur(8px)' }}
            >
              <div
                className="font-arizona text-3xl sm:text-4xl lg:text-5xl font-light leading-none flex items-end gap-0.5"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f7e98e 50%, #d4af37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <span className="gb-num" data-target={s.value} data-float={s.float ? 'true' : 'false'}>
                  0
                </span>
                <span className="text-xl sm:text-2xl" style={{ WebkitTextFillColor: 'rgba(212,175,55,0.7)' }}>
                  {s.suffix}
                </span>
              </div>

              <span className="block w-10 h-px my-1.5" style={{ background: 'rgba(212,175,55,0.4)' }} />

              <span
                className="font-gintoNord text-[10px] uppercase tracking-[0.3em] font-normal"
                style={{ color: 'rgba(245,240,232,0.5)' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
      <style jsx global>{`
        .gb-gold-text {
            background: linear-gradient(135deg, #d4af37 0%, #f7e98e 45%, #d4af37 75%, #a07d1c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
      `}</style>
    </section>
  );
}
