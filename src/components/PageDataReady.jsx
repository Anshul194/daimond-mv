"use client";
import { useEffect } from "react";

export default function PageDataReady() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("__page-data-ready"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
