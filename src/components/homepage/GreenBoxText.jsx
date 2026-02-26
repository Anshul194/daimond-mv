'use client';

import React, { useEffect, useRef } from 'react';
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
const SplitWords = ({ text, className = '', style = {}, wordClassName = '' }) => (
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

const stats = [
  { label: 'Years of craft',   value: 25,    suffix: '+',  float: false },
  { label: 'Bespoke pieces',   value: 12000, suffix: '+',  float: false },
  { label: 'Customer rating',  value: 4.9,   suffix: '★',  float: true  },
  { label: 'Countries served', value: 38,    suffix: '+',  float: false },
];

/* ── Component ────────────────────────────────────────────────────────────── */
export default function GreenBoxText() {
  const sectionRef = useRef(null);

  useEffect(() => {
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
        duration: 1.8,
        ease: 'expo.inOut',
        stagger: 0.1,
        scrollTrigger: st,
      });

      // ── Eyebrow rule lines ────────────────────────────────────────────
      gsap.from(['.gb-ruleLeft', '.gb-ruleRight'], {
        scaleX: 0,
        duration: 1.3,
        ease: 'expo.inOut',
        stagger: 0.12,
        delay: 0.1,
        scrollTrigger: st,
      });

      // ── Eyebrow text + diamond ────────────────────────────────────────
      gsap.from('.gb-eyebrow', {
        opacity: 0,
        y: 10,
        filter: 'blur(8px)',
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.15,
        scrollTrigger: st,
      });
      gsap.from('.gb-diamond', {
        opacity: 0,
        scale: 0,
        rotate: -45,
        duration: 0.8,
        ease: 'back.out(2)',
        delay: 0.2,
        scrollTrigger: st,
      });

      // ── Word-by-word headline reveal (rise + blur per word) ───────────
      // First line words
      gsap.from('.gb-line1 .gb-word', {
        opacity: 0,
        y: 55,
        filter: 'blur(14px)',
        skewX: -4,
        stagger: 0.055,
        duration: 1.0,
        ease: 'expo.out',
        delay: 0.25,
        scrollTrigger: st,
      });

      // Second line words (gold italic) — starts slightly after first line
      gsap.from('.gb-line2 .gb-word', {
        opacity: 0,
        y: 55,
        filter: 'blur(14px)',
        skewX: -4,
        stagger: 0.055,
        duration: 1.0,
        ease: 'expo.out',
        delay: 0.55,          // offset so line 2 flows after line 1
        scrollTrigger: st,
      });

      // ── Body paragraph — word by word ────────────────────────────────
      gsap.from('.gb-body .gb-word', {
        opacity: 0,
        y: 24,
        filter: 'blur(8px)',
        stagger: 0.03,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.9,
        scrollTrigger: st,
      });

      // ── Divider ───────────────────────────────────────────────────────
      gsap.from('.gb-divider', {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'center',
        duration: 1.2,
        ease: 'expo.inOut',
        delay: 1.1,
        scrollTrigger: st,
      });

      // ── Stat cards ────────────────────────────────────────────────────
      gsap.from('.gb-stat', {
        opacity: 0,
        y: 45,
        filter: 'blur(12px)',
        scale: 0.96,
        stagger: 0.13,
        duration: 1.0,
        ease: 'power3.out',
        delay: 1.2,
        scrollTrigger: {
          trigger: '.gb-stats',
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        onStart() {
          section.querySelectorAll('.gb-num').forEach((numEl) => {
            const target  = parseFloat(numEl.dataset.target);
            const isFloat = numEl.dataset.float === 'true';
            gsap.fromTo(
              numEl,
              { innerText: 0 },
              {
                innerText: target,
                duration: 2.2,
                ease: 'power2.out',
                delay: 0.3,
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

      // ── Noise parallax scrub ─────────────────────────────────────────
      gsap.to('.gb-noise', {
        y: '10%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });

    }, section);

    return () => ctx.revert();
  }, []);

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
        className="gb-noise pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />

      {/* Gold glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Top rule */}
      <div
        className="gb-ornTop absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.9) 50%, transparent)' }}
      />
      {/* Bottom rule */}
      <div
        className="gb-ornBot absolute bottom-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.9) 50%, transparent)' }}
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-12 py-24 lg:py-36">

        {/* Eyebrow */}
        <div className="flex items-center gap-5 mb-10">
          <span
            className="gb-ruleLeft block w-24 sm:w-40 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6))',
              transformOrigin: 'right center',
            }}
          />
          <span className="gb-diamond flex" style={{ color: 'rgba(212,175,55,0.85)' }}>
            <DiamondIcon size={8} />
          </span>
          <span
            className="gb-eyebrow font-gintoNord text-[9px] uppercase"
            style={{ color: 'rgba(212,175,55,0.75)', letterSpacing: '0.35em' }}
          >
            Est. Since
          </span>
          <span className="flex" style={{ color: 'rgba(212,175,55,0.85)' }}>
            <DiamondIcon size={8} />
          </span>
          <span
            className="gb-ruleRight block w-24 sm:w-40 h-px"
            style={{
              background: 'linear-gradient(90deg, rgba(212,175,55,0.6), transparent)',
              transformOrigin: 'left center',
            }}
          />
        </div>

        {/* Headline — split into words */}
        <div className="flex flex-col items-center gap-1 mb-8">
          {/* Line 1 */}
          <h2
            className="gb-line1 font-arizona text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.3] font-light"
            style={{ color: '#f5f0e8' }}
          >
            <SplitWords text="Fine jewellery to feel good about," />
          </h2>

          {/* Line 2 — gold italic */}
          <h2
            className="gb-line2 font-arizona text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.3] italic font-light"
          >
            <SplitWords
              text="made to love for a lifetime."
              style={{
                background:
                  'linear-gradient(135deg, #d4af37 0%, #f7e98e 45%, #d4af37 75%, #a07d1c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            />
          </h2>
        </div>

        {/* Body — split into words */}
        <p
          className="gb-body font-gintoNormal text-sm sm:text-base lg:text-lg max-w-2xl leading-[1.9] font-light mb-14"
          style={{ color: 'rgba(245,240,232,0.6)', letterSpacing: '0.02em' }}
        >
          <SplitWords
            text="Cullen sets the standard in fine jewellery with a commitment to premium craftsmanship. From our Australian workshop, our jewellers blend tradition and innovation, creating lasting pieces, responsibly."
          />
        </p>

        {/* Divider */}
        <div className="gb-divider flex items-center gap-4 mb-14">
          <span className="block h-px w-20 sm:w-32"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.45))' }} />
          <DiamondIcon size={7} style={{ color: 'rgba(212,175,55,0.55)', flexShrink: 0 }} />
          <span className="block h-px w-6" style={{ background: 'rgba(212,175,55,0.3)' }} />
          <DiamondIcon size={11} style={{ color: 'rgba(212,175,55,0.8)', flexShrink: 0 }} />
          <span className="block h-px w-6" style={{ background: 'rgba(212,175,55,0.3)' }} />
          <DiamondIcon size={7} style={{ color: 'rgba(212,175,55,0.55)', flexShrink: 0 }} />
          <span className="block h-px w-20 sm:w-32"
            style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.45), transparent)' }} />
        </div>

        {/* Stats */}
        <div
          className="gb-stats grid grid-cols-2 sm:grid-cols-4 gap-px w-full max-w-3xl"
          style={{
            background: 'rgba(212,175,55,0.12)',
            border: '1px solid rgba(212,175,55,0.15)',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="gb-stat flex flex-col items-center justify-center gap-2 py-8 px-4"
              style={{ background: 'rgba(0,46,41,0.55)', backdropFilter: 'blur(6px)' }}
            >
              <div
                className="font-arizona text-3xl sm:text-4xl font-light leading-none flex items-end gap-0.5"
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
                <span className="text-xl" style={{ WebkitTextFillColor: 'rgba(212,175,55,0.7)' }}>
                  {s.suffix}
                </span>
              </div>

              <span className="block w-8 h-px my-1" style={{ background: 'rgba(212,175,55,0.35)' }} />

              <span
                className="font-gintoNord text-[9px] uppercase tracking-[0.25em]"
                style={{ color: 'rgba(245,240,232,0.45)' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}