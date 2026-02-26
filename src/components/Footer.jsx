import axiosInstance from "@/axiosConfig/axiosInstance";
import {
  Instagram,
  Facebook,
  Youtube,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Custom SVG Icons ─────────────────────────────────────────── */
const TikTokIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.359-2.02-1.359-3.338h-3.064v13.814c0 1.355-1.104 2.459-2.459 2.459s-2.459-1.104-2.459-2.459 1.104-2.459 2.459-2.459c.26 0 .509.041.743.117V8.407c-.234-.023-.472-.035-.715-.035-3.384 0-6.123 2.739-6.123 6.123s2.739 6.123 6.123 6.123 6.123-2.739 6.123-6.123V9.25c1.336.95 2.97 1.513 4.73 1.513v-3.064c-1.14 0-2.184-.459-2.938-1.201-.481-.476-.812-1.089-.942-1.768a3.058 3.058 0 0 1-.094-.765V5.562h-.444z" />
  </svg>
);

const PinterestIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.219-.438-.219-1.085c0-1.016.592-1.776 1.332-1.776.627 0 .929.469.929 1.032 0 .629-.399 1.569-.606 2.441-.172.725.363 1.315 1.077 1.315 1.292 0 2.284-1.364 2.284-3.331 0-1.742-1.252-2.96-3.046-2.96-2.074 0-3.293 1.554-3.293 3.16 0 .626.241 1.296.542 1.66.059.073.068.137.05.211-.055.229-.177.717-.201.817-.031.129-.101.157-.233.094-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.969-.527-2.292-1.156 0 0-.502 1.911-.624 2.378-.226.868-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ─── Feature Icons ─────────────────────────────────────────────── */
const ShippingIcon = () => (
  <svg className="w-10 h-10 mb-3" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-2-2m0 0l2-2m-2 2h6" />
  </svg>
);

const ResizingIcon = () => (
  <svg className="w-10 h-10 mb-3" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
  </svg>
);

const WarrantyIcon = () => (
  <svg className="w-10 h-10 mb-3" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CustomizationIcon = () => (
  <svg className="w-10 h-10 mb-3" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="1">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

/* ─── Footer Component ──────────────────────────────────────────── */
export default function Footer() {
  const [openAccordions, setOpenAccordions] = useState({
    quickLinks: false,
    aboutUs: false,
    clientCare: false,
  });
  const [otherCategory, setOtherCategory] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  /* Refs for GSAP */
  const footerRef       = useRef(null);
  const featuresRef     = useRef(null);
  const featureItemRefs = useRef([]);
  const colRefs         = useRef([]);
  const newsletterRef   = useRef(null);
  const bottomRef       = useRef(null);
  const dividerRef      = useRef(null);

  const toggleAccordion = (section) =>
    setOpenAccordions((prev) => ({ ...prev, [section]: !prev[section] }));

  const getAttribute = async () => {
    try {
      const res = await axiosInstance.get(
        `api/category/subcategory?categoryId=6854fd3b5e53f236d75c07c1`
      );
      const categories = res.data?.body?.data || res.data?.data || [];
      setOtherCategory(Array.isArray(categories) ? categories : []);
    } catch {
      setOtherCategory([]);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    getAttribute();
  }, []);

  /* ── GSAP Animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* 1. Feature strip: icons pop in with stagger */
      gsap.set(featureItemRefs.current.filter(Boolean), { y: 30, opacity: 0, scale: 0.85 });
      gsap.to(featureItemRefs.current.filter(Boolean), {
        y: 0, opacity: 1, scale: 1,
        stagger: 0.12,
        duration: 0.7,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: featuresRef.current, start: "top 90%", once: true },
      });

      /* 2. Link columns slide up with stagger */
      gsap.set(colRefs.current.filter(Boolean), { y: 40, opacity: 0 });
      gsap.to(colRefs.current.filter(Boolean), {
        y: 0, opacity: 1,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: colRefs.current[0], start: "top 90%", once: true },
      });

      /* 3. Newsletter slides up */
      gsap.set(newsletterRef.current, { y: 36, opacity: 0 });
      gsap.to(newsletterRef.current, {
        y: 0, opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: newsletterRef.current, start: "top 90%", once: true },
      });

      /* 4. Divider line draws in */
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(dividerRef.current, {
        scaleX: 1,
        duration: 1.2,
        ease: "power2.inOut",
        scrollTrigger: { trigger: dividerRef.current, start: "top 95%", once: true },
      });

      /* 5. Bottom strip fades up */
      gsap.set(bottomRef.current, { y: 24, opacity: 0 });
      gsap.to(bottomRef.current, {
        y: 0, opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: bottomRef.current, start: "top 95%", once: true },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#00736C] !text-white">

      {/* ── 1. Feature Strip ─────────────────────────────────────── */}
      <div ref={featuresRef} className="border-b border-white/10 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 font-gintoNord">

            {[
              { icon: <ShippingIcon />,       line1: "WORLDWIDE",   line2: "EXPRESS SHIPPING" },
              { icon: <ResizingIcon />,        line1: "FREE",        line2: "RESIZING" },
              { icon: <WarrantyIcon />,        line1: "LIFETIME",    line2: "WARRANTY" },
              { icon: <CustomizationIcon />,   line1: "FREE RING",   line2: "CUSTOMISATION" },
            ].map(({ icon, line1, line2 }, i) => (
              <div
                key={i}
                ref={(el) => (featureItemRefs.current[i] = el)}
                className="text-center flex flex-col items-center group"
              >
                {/* icon with subtle hover lift */}
                <div className="transition-transform duration-300 group-hover:-translate-y-1 opacity-90 group-hover:opacity-100">
                  {icon}
                </div>
                <h3 className="!text-white font-bold text-[11px] tracking-widest leading-tight">{line1}</h3>
                <h3 className="!text-white font-bold text-[11px] tracking-widest leading-tight">{line2}</h3>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* ── 2. Main Links Grid ───────────────────────────────────── */}
      <div className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Quick Links */}
            <div ref={(el) => (colRefs.current[0] = el)}>
              {/* Desktop */}
              <div className="hidden lg:block">
                <h3 className="!text-white font-bold text-[11px] mb-5 tracking-widest uppercase">Quick Links</h3>
                <ul className="space-y-2.5">
                  {[
                    { label: "New Arrivals",           href: "/new-arrivals" },
                    { label: "Engagement Rings",       href: "/engagement-230" },
                    { label: "Wedding Rings",          href: "/wedding-rings-873" },
                    { label: "Fine Jewelry",           href: "/fine-jewellery-807?finejewellery=6874b552f2ed2bebef46ccec" },
                    { label: "Women's Wedding Rings",  href: "/wedding-rings-873?gender=woman" },
                    { label: "Men's Wedding Rings",    href: "/wedding-rings-873?gender=man" },
                    { label: "Education",              href: "#" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="text-[10px] text-white/70 hover:text-white transition-colors font-gintoNord hover:tracking-wider duration-300">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mobile accordion */}
              <div className="lg:hidden">
                <button onClick={() => toggleAccordion("quickLinks")} className="w-full flex justify-between items-center py-3 border-b border-white/10">
                  <h3 className="!text-white font-bold text-sm">QUICK LINKS</h3>
                  {openAccordions.quickLinks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.quickLinks && (
                  <ul className="space-y-2 pt-4">
                    {["New Arrivals","Engagement Rings","Wedding Rings","Fine Jewelry","Women's Wedding Rings","Men's Wedding Rings","Education"].map((l) => (
                      <li key={l}><Link href="#" className="text-[10px] hover:text-white/60 transition-colors font-gintoNord">{l}</Link></li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Other Categories */}
            <div ref={(el) => (colRefs.current[1] = el)}>
              {/* Desktop */}
              <div className="hidden lg:block">
                <h3 className="!text-white font-bold text-[11px] mb-5 tracking-widest uppercase">Other Categories</h3>
                <ul className="space-y-2.5">
                  {isMounted && Array.isArray(otherCategory) && otherCategory.length > 0 ? (
                    otherCategory.map((cat, i) => (
                      <li key={cat._id || i}>
                        <Link href={`/fine-jewellery-807?finejewellery=${cat._id}`} className="capitalize text-[10px] text-white/70 hover:text-white transition-colors font-gintoNord hover:tracking-wider duration-300">
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  ) : isMounted ? (
                    <li className="text-[10px] text-white/40">No categories available</li>
                  ) : (
                    <li className="text-[10px] text-white/40">Loading…</li>
                  )}
                </ul>
              </div>
              {/* Mobile accordion */}
              <div className="lg:hidden">
                <button onClick={() => toggleAccordion("aboutUs")} className="w-full flex justify-between items-center py-3 border-b border-white/10">
                  <h3 className="!text-white font-bold text-sm uppercase">Other Categories</h3>
                  {openAccordions.aboutUs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.aboutUs && (
                  <ul className="space-y-2 pt-4">
                    {isMounted && Array.isArray(otherCategory) && otherCategory.length > 0 ? (
                      otherCategory.map((cat, i) => (
                        <li key={cat._id || i}>
                          <Link href={`/fine-jewellery-807?finejewellery=${cat._id}`} className="capitalize text-[10px] hover:text-white/60 transition-colors font-gintoNord block">{cat.name}</Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-[10px] text-white/40">{isMounted ? "No categories" : "Loading…"}</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Client Care */}
            <div ref={(el) => (colRefs.current[2] = el)}>
              {/* Desktop */}
              <div className="hidden lg:block">
                <h3 className="!text-white font-bold text-[11px] mb-5 tracking-widest uppercase">Client Care</h3>
                <ul className="space-y-2.5">
                  {["FAQs","Blogs","Education","Size Guide","Book Appointment","Order Status"].map((l) => (
                    <li key={l}>
                      <Link href="#" className="text-[10px] text-white/70 hover:text-white transition-colors font-gintoNord hover:tracking-wider duration-300">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mobile accordion */}
              <div className="lg:hidden">
                <button onClick={() => toggleAccordion("clientCare")} className="w-full flex justify-between items-center py-3 border-b border-white/10">
                  <h3 className="!text-white font-bold text-sm">CLIENT CARE</h3>
                  {openAccordions.clientCare ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.clientCare && (
                  <ul className="space-y-2 pt-4">
                    {["FAQs","Blogs","Education","Size Guide","Book Appointment","Order Status"].map((l) => (
                      <li key={l}><Link href="#" className="text-[10px] hover:text-white/60 transition-colors font-gintoNord">{l}</Link></li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Contact Us */}
            <div ref={(el) => (colRefs.current[3] = el)}>
              <h3 className="!text-white font-bold text-[11px] mb-5 tracking-widest uppercase">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-light">📞</span>
                  <span className="text-[10px] text-white/80 font-gintoNord">+61 1300 977 619</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-light">✉</span>
                  <span className="text-[10px] text-white/80 font-gintoNord">sales@cullenjewellery.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-light">📅</span>
                  <span className="text-[10px] text-white/80 font-gintoNord">Appointment Only</span>
                </div>
              </div>

              <div className="mt-5 space-y-1">
                <div className="font-bold text-[9px] mb-2 tracking-widest text-white/60 uppercase">Contact Hours (AEST)</div>
                <div className="text-[10px] font-light text-white/60">MON–WED: 4:30 AM – 12:30 PM</div>
                <div className="text-[10px] font-light text-white/60">THU–FRI: 4:30 AM – 2:30 PM</div>
                <div className="text-[10px] font-light text-white/60">SAT: 3:30 AM – 11:30 AM</div>
              </div>

              <div className="space-y-1.5 pt-5">
                <div>
                  <a href="#" className="text-[10px] text-white/70 hover:text-white transition-colors font-gintoNord underline underline-offset-4">Get In Touch</a>
                </div>
                <div>
                  <a href="#" className="text-[10px] text-white/70 hover:text-white transition-colors font-gintoNord underline underline-offset-4">Feedback</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Newsletter ────────────────────────────────────────── */}
      <div ref={newsletterRef} className="border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-gintoNord mb-3">Stay in the loop</p>
          <h3 className="!text-white text-xl font-arizona mb-8 tracking-wider">
            RING ADVICE, STRAIGHT TO YOUR INBOX
          </h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-0 max-w-md mx-auto border border-white/20">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full sm:w-auto flex-1 px-6 py-4 text-white bg-transparent border-0 focus:outline-none placeholder:text-white/40 font-light text-sm"
            />
            <button className="w-full sm:w-auto px-10 py-4 bg-white text-[#00736C] font-semibold hover:bg-white/90 transition-all font-gintoNord uppercase text-xs tracking-widest">
              SUBMIT
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Bottom Strip ─────────────────────────────────────── */}
      <div className="border-t border-white/10 pt-1">
        {/* Animated divider line */}
        <div ref={dividerRef} className="h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mb-10" />

        <div ref={bottomRef} className="max-w-7xl mx-auto px-4 pb-12">

          {/* Certs + Social + Badge — three-column */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-8">

            {/* Certifications */}
            <div className="flex items-center space-x-6">
              <div className="text-[10px] text-white/60 leading-relaxed">
                <div>Proudly endorsed by</div>
                <div className="font-bold text-white">DQA</div>
                <div>Design Institute</div>
                <div>of Australia</div>
              </div>
              <div className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg tracking-tighter">IGI</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center space-x-6 text-white">
              {[
                { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
                { icon: <TikTokIcon />,                    label: "TikTok" },
                { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
                { icon: <Youtube className="w-5 h-5" />,  label: "YouTube" },
                { icon: <PinterestIcon />,                 label: "Pinterest" },
                { icon: <LinkedInIcon />,                  label: "LinkedIn" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 transform"
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Clear Neutral Badge */}
            <div className="bg-[#B8860B] text-white px-6 py-3 rounded-sm text-center border border-white/10">
              <div className="text-[10px] font-bold tracking-widest">CLEAR NEUTRAL</div>
              <div className="text-[10px] opacity-80">CERTIFIED</div>
            </div>
          </div>

          {/* Legal links */}
          <div className="text-center text-[10px] mb-6 opacity-50">
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-white">
              {["Terms and Conditions","Terms of Sale","Privacy","Returns","Site Map","Engagement Rings"].map((l) => (
                <a key={l} href="#" className="hover:opacity-100 transition-opacity">{l}</a>
              ))}
            </div>
          </div>

          {/* SSL */}
          <div className="text-center text-[10px] mb-6 opacity-30 uppercase tracking-[0.2em] text-white">
            All payments are 256-bit SSL secure and encrypted.
          </div>

          {/* Payment Methods */}
          <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
            {['AMEX','Apple Pay','G Pay','Discover','MC','PayPal','Shop Pay','Visa','Zip'].map((m) => (
              <div key={m} className="border border-white/10 px-3 py-1.5 rounded-sm text-[8px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-white/30 transition-all duration-200">
                {m}
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-[10px] opacity-30 tracking-widest uppercase text-white">
            © 2025 Cullen Jewellery
          </div>
        </div>
      </div>

    </footer>
  );
}
