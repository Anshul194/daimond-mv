"use client";

import axiosInstance from "@/axiosConfig/axiosInstance";
import {
  Instagram,
  Facebook,
  Youtube,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import ArdorLogo from "@/public/image/cropped-website-logo-1.png";
import TransitionLink from "./TransitionLink";

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

/* ─── Footer Component ──────────────────────────────────────────── */
export default function Footer() {
  const [otherCategory, setOtherCategory] = useState([]);
  const footerRef = useRef(null);
  const containerRef = useRef(null);

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
    getAttribute();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.from(".footer-col", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      })
      .from(".footer-bottom", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4")
      .from(".footer-logo", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      }, "-=1");

      // Hover animations for links
      const links = document.querySelectorAll(".footer-link");
      links.forEach(link => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, { x: 5, color: "#ffffff", opacity: 1, duration: 0.3 });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link, { x: 0, color: "inherit", opacity: 1, duration: 0.3 });
        });
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#00736C] text-white pt-20 pb-10 overflow-hidden font-light">
      <div ref={containerRef} className="container max-w-7xl mx-auto px-6">
        
        {/* Top Section: Branding & Newsletter */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div className="footer-logo space-y-8">
            <TransitionLink href="/" className="inline-block">
              {/* Added brightness/invert filter if a white logo isn't available to make it visible on dark teal */}
              <Image
                src={ArdorLogo}
                alt="Ardor Diamonds"
                width={200}
                height={80}
                className="object-contain brightness-0 invert"
              />
            </TransitionLink>
            <p className="!text-white max-w-sm leading-relaxed text-lg italic font-arizona">
              Curating brilliance, crafting legacies. Your journey into the extraordinary begins here.
            </p>
            <div className="flex items-center space-x-6">
               {[
                { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
                { icon: <TikTokIcon />,                    label: "TikTok" },
                { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
                { icon: <PinterestIcon />,                 label: "Pinterest" },
              ].map((social, i) => (
                <a key={i} href="#" aria-label={social.label} className="text-white hover:opacity-80 transition-opacity duration-300 transform hover:scale-110">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col space-y-6 lg:pl-10">
            <h3 className="text-[10px] font-gintoNord tracking-[0.3em] uppercase !text-white">Newsletter</h3>
            <h2 className="text-3xl font-extralight !text-white leading-tight">Join the Ardor Inner Circle</h2>
            <div className="relative max-w-md group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent border-b border-white py-4 pr-12 focus:border-white transition-all duration-500 outline-none text-white placeholder:text-white"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white hover:opacity-80 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] !text-white tracking-wider">Stay updated on our latest collections and exclusive invites.</p>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-t border-white/10 pt-20">
          
          {/* Jewelry Collection */}
          <div className="footer-col space-y-6">
            <h3 className="text-[10px] font-gintoNord tracking-[0.2em] uppercase !text-white">Collections</h3>
            <ul className="space-y-4">
              {[
                { label: "New Arrivals", href: "/new-arrivals" },
                { label: "Engagement Rings", href: "/engagement-230" },
                { label: "Wedding Rings", href: "/wedding-rings-873" },
                { label: "Fine Jewelry", href: "/fine-jewellery-807" },
                { label: "Bespoke Design", href: "/bespoke" },
              ].map((link) => (
                <li key={link.label}>
                  <TransitionLink href={link.href} className="footer-link text-sm text-white hover:opacity-80 transition-all duration-300 block">
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Categories Dynamically */}
          <div className="footer-col space-y-6">
            <h3 className="text-[10px] font-gintoNord tracking-[0.2em] uppercase !text-white">Explore Categories</h3>
            <ul className="space-y-4">
              {otherCategory.length > 0 ? (
                otherCategory.slice(0, 5).map((cat) => (
                  <li key={cat._id}>
                    <TransitionLink href={`/fine-jewellery-807?finejewellery=${cat._id}`} className="footer-link text-sm text-white hover:opacity-80 capitalize block">
                      {cat.name}
                    </TransitionLink>
                  </li>
                ))
              ) : (
                <>
                  <li><TransitionLink href="#" className="footer-link text-sm text-white hover:opacity-80 block">Diamond Rings</TransitionLink></li>
                  <li><TransitionLink href="#" className="footer-link text-sm text-white hover:opacity-80 block">Gold Necklaces</TransitionLink></li>
                  <li><TransitionLink href="#" className="footer-link text-sm text-white hover:opacity-80 block">Earrings</TransitionLink></li>
                </>
              )}
            </ul>
          </div>

          {/* Client Care */}
          <div className="footer-col space-y-6">
            <h3 className="text-[10px] font-gintoNord tracking-[0.2em] uppercase !text-white">Client Care</h3>
            <ul className="space-y-4">
              {["FAQs", "Shipping", "Returns", "Sizing Guide", "Book Appointment"].map((l) => (
                <li key={l}>
                  <TransitionLink href={`/${l.toLowerCase().replace(" ", "-")}`} className="footer-link text-sm text-white hover:opacity-80 block">
                    {l}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge / Contact */}
          <div className="footer-col space-y-6">
            <h3 className="text-[10px] font-gintoNord tracking-[0.2em] uppercase !text-white">Concierge</h3>
            <div className="space-y-4 text-sm text-white">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <Phone className="w-4 h-4 text-white hover:opacity-80 transition-colors" />
                <span className="group-hover:opacity-80 transition-colors">+61 1300 977 619</span>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <Mail className="w-4 h-4 text-white hover:opacity-80 transition-colors" />
                <span className="group-hover:opacity-80 transition-colors">sales@ardordiamonds.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-white" />
                <span>By Appointment Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-[10px] font-gintoNord tracking-widest text-white uppercase">
          <div className="flex space-x-6">
            <TransitionLink href="/privacy" className="hover:opacity-80 transition-colors">Privacy Policy</TransitionLink>
            <TransitionLink href="/terms" className="hover:opacity-80 transition-colors">Terms of Service</TransitionLink>
          </div>
          <div>
            © 2025 Ardor Diamonds. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             {['Visa', 'Mastercard', 'Amex', 'PayPal'].map(p => (
               <span key={p} className="px-2 border border-white/20 rounded-sm py-1 font-bold">{p}</span>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
