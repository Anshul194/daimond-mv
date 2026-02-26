"use client";

/**
 * TransitionLink — drop-in replacement for next/link that fires the
 * __page-transition-start event before navigation, giving the curtain
 * time to slide in before the new page renders.
 *
 * Usage:  <TransitionLink href="/products/rings">Shop Rings</TransitionLink>
 */

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function TransitionLink({ href, children, className, style, ...rest }) {
  const router = useRouter();
  const clicked = useRef(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (clicked.current) return;
    clicked.current = true;

    // Dispatch transition-start so the curtain slides in
    window.dispatchEvent(new Event("__page-transition-start"));

    // Navigate after curtain animation starts (sync with 550ms GSAP duration)
    setTimeout(() => {
      router.push(href);
      clicked.current = false;
    }, 420);
  };

  return (
    <a href={href} onClick={handleClick} className={className} style={style} {...rest}>
      {children}
    </a>
  );
}
