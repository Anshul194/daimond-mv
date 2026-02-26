"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchFaqs } from "../store/slices/faq";

gsap.registerPlugin(ScrollTrigger);

/* ── Single FAQ Row ── */
const FAQItem = ({ question, answer, isOpen, onToggle, animRef }) => {
  const answerRef = useRef(null);

  // Animate answer panel open/close with GSAP for a smoother feel than CSS max-height
  useEffect(() => {
    if (!answerRef.current) return;
    if (isOpen) {
      gsap.fromTo(
        answerRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.45, ease: "power3.out" }
      );
    } else {
      gsap.to(answerRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  return (
    <div ref={animRef} className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-7 flex items-center justify-between text-left group transition-colors duration-300"
        onClick={onToggle}
      >
        <span
          className={`text-[11px] font-gintoNord uppercase tracking-[0.2em] transition-colors duration-300 font-semibold ${isOpen ? "text-[#00736C]" : "text-gray-800 group-hover:text-[#00736C]"
            }`}
        >
          {question}
        </span>

        <div className="flex-shrink-0 ml-6">
          <ChevronDown
            className={`w-4 h-4 transition-all duration-500 ease-in-out ${isOpen
                ? "rotate-180 text-[#00736C]"
                : "rotate-0 text-gray-400 group-hover:text-[#00736C]"
              }`}
          />
        </div>
      </button>

      {/* Answer — height animated by GSAP */}
      <div ref={answerRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <div className="text-gray-500 font-gintoNormal text-sm leading-relaxed max-w-3xl pb-7">
          {answer}
        </div>
      </div>
    </div>
  );
};

/* ── Main FAQ Section ── */
export default function Faq() {
  const [openItems, setOpenItems] = useState({});
  const dispatch = useDispatch();

  // Use Redux state for FAQs
  const { faqs, loading, error } = useSelector((state) => state.faq);

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subTextRef = useRef(null);
  const dividerRef = useRef(null);
  const rowRefs = useRef([]);

  /*
  const faqs_static = [
    {
      question: "How long will it take to get my order?",
      answer: "Crafting of your ring typically takes 50 business days, with expediting options available if you need it sooner. The exact completion date can be conveniently found on each product page. Please note that shipping is not included within this date and you can find all our shipping information on our shipping page. For all timeframe information please visit our crafting timeframes page.",
    },
    ...
  ];
  */

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  const toggleItem = (index) => {
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  /* ── GSAP Entry Animations ── */
  useEffect(() => {
    if (faqs && faqs.length > 0) {
      const ctx = gsap.context(() => {
        // Immediately hide all animated elements
        gsap.set(headingRef.current, { y: 32, opacity: 0, filter: "blur(10px)" });
        gsap.set(subTextRef.current, { y: 18, opacity: 0, filter: "blur(6px)" });
        gsap.set(dividerRef.current, { scaleX: 0, opacity: 0, transformOrigin: "center" });
        gsap.set(rowRefs.current.filter(Boolean), { x: -30, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            once: true,
          },
        });

        tl.to(headingRef.current, {
          y: 0, opacity: 1, filter: "blur(0px)",
          duration: 1, ease: "power3.out",
        })
          .to(subTextRef.current, {
            y: 0, opacity: 1, filter: "blur(0px)",
            duration: 0.75, ease: "power3.out",
          }, "-=0.65")
          .to(dividerRef.current, {
            scaleX: 1, opacity: 1,
            duration: 0.8, ease: "power2.inOut",
          }, "-=0.55")
          .to(rowRefs.current.filter(Boolean), {
            x: 0, opacity: 1,
            stagger: 0.07,
            duration: 0.55,
            ease: "power3.out",
          }, "-=0.4");
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [faqs]);

  if (loading) {
    return <div className="py-24 text-center text-gray-400">Loading FAQs...</div>;
  }

  return (
    <div ref={sectionRef}>
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 text-center">
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl font-light mb-4 font-arizona tracking-wide text-gray-900"
        >
          Common Questions
        </h2>

        {/* decorative center line */}
        <div
          ref={dividerRef}
          className="mx-auto mb-4 h-[1px] w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
          style={{ transform: "scaleX(0)", opacity: 0 }}
        />

        <p
          ref={subTextRef}
          className="text-gray-500 font-gintoNormal text-[10px] uppercase tracking-[0.2em]"
        >
          Refining your engagement ring journey
        </p>
      </div>

      {/* ── FAQ Rows ── */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div>
          {(!faqs || faqs.length === 0) && !loading && (
            <p className="text-center py-12 text-gray-400">No FAQs available.</p>
          )}
          {faqs && faqs.map((item, index) => (
            <FAQItem
              key={item._id || index}
              question={item.title}
              answer={item.description}
              isOpen={openItems[index] || false}
              onToggle={() => toggleItem(index)}
              animRef={(el) => (rowRefs.current[index] = el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
