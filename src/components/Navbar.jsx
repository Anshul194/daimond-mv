"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Instagram,
  Facebook,
  Youtube,
  ChevronDown,
  ChevronUp,
  User,
  SearchIcon,
  XIcon,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/slices/categorySlice";
import axiosInstance from "@/axiosConfig/axiosInstance";
import ArdorLogo from "@/public/image/cropped-website-logo-1.png";
import TransitionLink from "./TransitionLink";

import { gsap } from "gsap";
import { useRef } from "react";

const TikTokIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.359-2.02-1.359-3.338h-3.064v13.814c0 1.355-1.104 2.459-2.459 2.459s-2.459-1.104-2.459-2.459 1.104-2.459 2.459-2.459c.26 0 .509.041.743.117V8.407c-.234-.023-.472-.035-.715-.035-3.384 0-6.123 2.739-6.123 6.123s2.739 6.123 6.123 6.123 6.123-2.739 6.123-6.123V9.25c1.336.95 2.97 1.513 4.73 1.513v-3.064c-1.14 0-2.184-.459-2.938-1.201-.481-.476-.812-1.089-.942-1.768a3.058 3.058 0 0 1-.094-.765V5.562h-.444z" />
  </svg>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showJewelleryDropdown, setShowJewelleryDropdown] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [showWeddingDropdown, setShowWeddingDropdown] = useState(false);
  const [showEngagementDropdown, setShowEngagementDropdown] = useState(false);
  const [openMenuData, setOpenMenuData] = useState(null);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: categories } = useSelector((state) => state.category);
  const [attributesData, setAttributesData] = useState({});
  const [educationCategories, setEducationCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [fineJewellerSubCategories, setFineJewellerSubCategories] = useState(
    []
  );
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();

  const navRef = useRef(null);
  const leftNavRef = useRef(null);
  const rightNavRef = useRef(null);
  const logoRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef([]);
  const mobileOverlayRef = useRef(null);
  const mobileCloseBtnRef = useRef(null);
  const mobileMenuTimeline = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(navRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
      
      tl.fromTo(logoRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, "-=0.5");

      const navElements = [];
      if (leftNavRef.current) navElements.push(...leftNavRef.current.children);
      if (rightNavRef.current) navElements.push(...rightNavRef.current.children);

      if (navElements.length > 0) {
        tl.fromTo(
          navElements,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.8 },
          "-=0.5"
        );
      }
    }, navRef);

    return () => ctx.revert();
  }, [categories]); // Re-run when categories load to animate them

  // Mobile Menu GSAP Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(mobileMenuRef.current, {
        clipPath: "circle(0% at 24px 32px)",
        visibility: "hidden",
      });
      gsap.set(mobileOverlayRef.current, { opacity: 0, visibility: "hidden" });
      gsap.set(".mobile-nav-item", { x: -20, opacity: 0 });

      mobileMenuTimeline.current = gsap.timeline({ paused: true })
        .to(mobileOverlayRef.current, {
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.inOut",
        })
        .to(mobileMenuRef.current, {
          autoAlpha: 1,
          clipPath: "circle(150% at 24px 32px)",
          duration: 0.8,
          ease: "power4.inOut",
        }, "-=0.2")
        .to(".mobile-nav-item", {
          x: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.6,
          ease: "power3.out",
        }, "-=0.4");
    }, mobileMenuRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      mobileMenuTimeline.current?.play();
      document.body.style.overflow = "hidden";
    } else {
      mobileMenuTimeline.current?.reverse();
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "NEW ARRIVALS", href: "/new-arrivals" },
    ...(categories && categories.length > 0
      ? [...categories].reverse().map((category) => ({
          name: category.name.toUpperCase(),
          href: `/${category.slug}`,
          hasDropdown: true,
        }))
      : []),
  ];

  const visiblePriority = ["WEDDING RINGS", "ENGAGEMENT RINGS", "FINE JEWELLERY"];

  const visibleLeftNavItems = navItems
    .filter((item) => visiblePriority.includes(item.name))
    .sort((a, b) => visiblePriority.indexOf(a.name) - visiblePriority.indexOf(b.name));

  const hiddenLeftNavItems = navItems.filter(
    (item) => !visiblePriority.includes(item.name)
  );

  const getAttribute = async () => {
    try {
      const data = await axiosInstance.get(
        "/api/navbar-categories-with-attributes"
      );
      let datas = {};
      (data.data?.body?.data || []).map((item) => {
        const att = {};
        (item.attributes || []).map((attr) => {
          att[attr.title] = attr.terms;
        });
        datas[item.name] = att;
      });
      setAttributesData(datas);

      const res = await axiosInstance.get(
        `api/category/subcategory?categoryId=6854fd3b5e53f236d75c07c1`
      );
      setFineJewellerSubCategories(res.data?.data || []);

      const educationData = await axiosInstance.get(
        "/api/blog/category/6878cbb596dfc8337a3359b4/blogs"
      );

      console.log("Education Data:", educationData.data.body.data);
      setEducationCategories(educationData.data?.body?.data || []);
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  };

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      getAttribute();
    }
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rightNavItems = [
    { name: "EDUCATION", href: "/education", hasDropdown: true },
    { name: "CONTACT", href: "/contact", hasDropdown: true },
    {
      name: "MEET WITH US",
      href: "/meet",
    },
  ];

  const jewelleryCategories = [
    {
      title: "JEWELLERY",
      items: [
        { name: "Rings", href: "/rings" },
        { name: "Earrings", href: "/products/earrings" },
        { name: "Bracelets", href: "/products/bracelets" },
        { name: "Chains", href: "/products/chains" },
        { name: "Pendants", href: "/products/pendants" },
      ],
    },
    {
      title: "STATEMENT RINGS",
      items: [],
      image: "/api/placeholder/400/200",
    },
    {
      title: "STACKER RINGS",
      items: [],
      image: "/api/placeholder/400/200",
    },
    {
      title: "MINIMAL RINGS",
      items: [],
      image: "/api/placeholder/400/200",
    },
    {
      title: "INITIAL SIGNET RING",
      items: [],
      image: "/api/placeholder/400/200",
    },
  ];

  // Mobile accordion categories
  const mobileAccordionItems = [
    {
      title: "ENGAGEMENT RINGS",
      subcategories: [
        {
          name: "BUILD A RING",
          items: [
            { name: "Browse Settings", href: "/engagement-rings/build-rings" },
            {
              name: "Ready-to-Ship Rings",
              href: "/engagement-rings/build-rings",
            },
            {
              name: "Custom-Made Rings",
              href: "/engagement-rings/build-rings",
            },
          ],
        },
        {
          name: "SHOP BY METAL",
          items: [
            { name: "Platinum", href: "/engagement-rings/build-rings" },
            { name: "Yellow Gold", href: "/engagement-rings/build-rings" },
            { name: "Rose Gold", href: "/engagement-rings/build-rings" },
            { name: "White Gold", href: "/engagement-rings/build-rings" },
          ],
        },
        {
          name: "SHOP BY STYLE",
          items: [
            { name: "Solitaire", href: "/engagement-rings/build-rings" },
            { name: "Trilogy", href: "/engagement-rings/build-rings" },
            { name: "Halo", href: "/engagement-rings/build-rings" },
            { name: "Toi et Moi", href: "/engagement-rings/build-rings" },
            { name: "Bezel", href: "/engagement-rings/build-rings" },
            { name: "East West", href: "/engagement-rings/build-rings" },
          ],
        },
        {
          name: "ENGAGEMENT RING GUIDANCE",
          items: [
            { name: "Design Basics", href: "/engagement-rings/build-rings" },
            {
              name: "Engagement Ring Guide",
              href: "/engagement-rings/build-rings",
            },
            {
              name: "Find Your Ring Size",
              href: "/engagement-rings/build-rings",
            },
            {
              name: "Precious Metals Guide",
              href: "/engagement-rings/build-rings",
            },
            {
              name: "Our Crafting Process",
              href: "/engagement-rings/build-rings",
            },
            { name: "Ring Care Guide", href: "/engagement-rings/build-rings" },
          ],
        },
      ],
    },
    {
      title: "WEDDING RINGS",
      subcategories: [
        {
          name: "WOMEN",
          items: [
            { name: "All Women's Wedding Rings", href: "/wedding-rings/women" },
            { name: "Pavé Wedding Rings", href: "/wedding-rings/women" },
            { name: "Curved Wedding Rings", href: "/wedding-rings/women" },
            { name: "Accent Wedding Rings", href: "/wedding-rings/women" },
          ],
        },
        {
          name: "WOMEN'S BY METAL",
          items: [
            { name: "Platinum", href: "/wedding-rings/women" },
            { name: "18k Yellow Gold", href: "/wedding-rings/women" },
            { name: "18k Rose Gold", href: "/wedding-rings/women" },
            { name: "18k White Gold", href: "/wedding-rings/women" },
          ],
        },
        {
          name: "MEN",
          items: [
            { name: "All Men's Wedding Rings", href: "/wedding-rings/women" },
            { name: "Classic Wedding Rings", href: "/wedding-rings/women" },
            {
              name: "Multi-Colour Wedding Rings",
              href: "/wedding-rings/women",
            },
            { name: "Unique Wedding Rings", href: "/wedding-rings/women" },
          ],
        },
        {
          name: "MEN'S BY METAL",
          items: [
            { name: "Platinum", href: "/wedding-rings/women" },
            { name: "Yellow Gold", href: "/wedding-rings/women" },
            { name: "Rose Gold", href: "/wedding-rings/women" },
            { name: "White Gold", href: "/wedding-rings/women" },
            { name: "Titanium", href: "/wedding-rings/women" },
            { name: "Tantalum", href: "/wedding-rings/women" },
            { name: "Carbon Fibre", href: "/wedding-rings/women" },
          ],
        },
        {
          name: "WEDDING RING GUIDANCE",
          items: [
            { name: "Wedding Ring Guide", href: "/wedding-rings/women" },
            { name: "Design Basics", href: "/wedding-rings/women" },
            { name: "Find Your Ring Size", href: "/wedding-rings/women" },
            { name: "Precious Metals Guide", href: "/wedding-rings/women" },
            { name: "Our Crafting Process", href: "/wedding-rings/women" },
          ],
        },
      ],
    },
    {
      title: "FINE JEWELLERY",
      subcategories: [
        {
          name: "JEWELLERY",
          items: [
            { name: "Rings", href: "/wedding-rings/women" },
            { name: "Earrings", href: "/wedding-rings/women" },
            { name: "Bracelets", href: "/wedding-rings/women" },
            { name: "Chains", href: "/wedding-rings/women" },
            { name: "Pendants", href: "/wedding-rings/women" },
          ],
        },
        { name: "STATEMENT RINGS", href: "/wedding-rings/women" },
        { name: "STACKER RINGS", href: "/wedding-rings/women" },
        { name: "MINIMAL RINGS", href: "/wedding-rings/women" },
        { name: "INITIAL SIGNET RING", href: "/wedding-rings/women" },
      ],
    },
  ];

  const [expandedSubAccordion, setExpandedSubAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedAccordion(expandedAccordion === index ? null : index);
    setExpandedSubAccordion(null);
  };

  const toggleSubAccordion = (id) => {
    setExpandedSubAccordion(expandedSubAccordion === id ? null : id);
  };

  const handelProfileClick = async () => {
    if (isAuthenticated) {
      window.location.href = "/my-orders";
    } else {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchValue.trim() === "") {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/search?searchproductandblog=${searchValue}`
        );
        const data = response.data.body.data;
        console.log("Search Results:", [
          ...(Array.isArray(data.blogs) ? data.blogs : []),
          ...(Array.isArray(data.products) ? data.products : []),
        ]);
        setSearchResults([
          ...(Array.isArray(data.blogs) ? data.blogs : []),
          ...(Array.isArray(data.products) ? data.products : []),
        ]);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchValue]);

  return (
    <>
      <div
        className={`fixed inset-0 w-full h-screen bg-black/20 z-[9999] transition-all duration-300 ${
          showSearch
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`h-24 max-sm:h-20 max-sm:px-10 px-32 ${
            showSearch ? "mt-0" : "-mt-24 max-sm:-mt-20"
          } bg-white flex justify-between items-center transition-all duration-300`}
        >
          <div className="w-2/3 flex gap-4 items-center">
            <SearchIcon className="text-gray-900" />
            <input
              type="text"
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSearch(true);
              }}
              placeholder="Search for products"
              className="w-full outline-none h-10 pl-8 pr-4 bg-white text-gray-900 placeholder-gray-500 rounded-md transition-colors duration-200"
            />
          </div>
          <XIcon
            onClick={() => {
              setShowSearch(false);
              setSearchValue("");
              setSearchResults([]);
              setSearchLoading(false);
            }}
            className="cursor-pointer text-gray-900"
          />
        </div>

        <div className="h-fit w-full px-32 pt-10 max-sm:px-10 bg-[#f5f5f5] pb-10">
          {searchLoading ? (
            <div className="h-20 w-full bg-[#f5f5f5] flex justify-center items-center text-gray-900">
              Loading...
            </div>
          ) : (
            <div className="text-gray-900 w-full bg-[#f5f5f5] h-fit grid grid-cols-5 max-md:grid-cols-2 max-sm:grid-cols-2 max-sm:h-[80vh] overflow-y-auto gap-4">
              {searchResults &&
                searchResults?.length > 0 &&
                searchResults?.map((result) => (
                  <Link
                    href={
                      result?.coverImage
                        ? `/blogs/${result?.BlogCategory?._id}/${result?.BlogSubCategory?._id}/${result?._id}`
                        : `/${result?.category_id?.slug}/${result?.slug}`
                    }
                    key={result?._id}
                  >
                    <div className="flex cursor-pointer group w-full flex-col items-center">
                      <Image
                        src={result?.image?.[0] || result?.coverImage}
                        alt={result?.name}
                        width={100}
                        height={100}
                        className="w-full h-32 group-hover:scale-105 object-cover mb-2 transition-transform duration-200"
                      />
                      <h2 className="text-center text-black">
                        {result?.name || result?.title}
                      </h2>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>


      {/* Desktop Navbar */}
      <nav
        ref={navRef}
        className={`sticky top-0 w-full h-16 lg:h-20 bg-white z-50 border-b border-gray-100 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button - Left side on mobile */}
            <div className="lg:hidden w-12 flex justify-start">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-black hover:text-black transition-colors duration-200"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Left Navigation Items - Desktop only */}
            <div ref={leftNavRef} className="hidden lg:flex lg:w-[40%] items-center justify-end md:gap-6 xl:gap-12">
              {visibleLeftNavItems.map((item) => (
                <div
                  key={item.name}
                  className="relative font-cullen h-full flex items-center"
                  onMouseEnter={() => {
                    if (item.hasDropdown) {
                      if (item.name === "FINE JEWELLERY") {
                        setShowJewelleryDropdown(true);
                        setOpenMenuData(attributesData[item.name] || {});
                      } else if (item.name === "WEDDING RINGS") {
                        setShowWeddingDropdown(true);
                        setOpenMenuData(attributesData[item.name] || {});
                      } else if (item.name === "ENGAGEMENT RINGS") {
                        setShowEngagementDropdown(true);
                        setOpenMenuData(attributesData[item.name] || {});
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.hasDropdown) {
                      if (item.name === "FINE JEWELLERY") {
                        setShowJewelleryDropdown(false);
                      } else if (item.name === "WEDDING RINGS") {
                        setShowWeddingDropdown(false);
                      } else if (item.name === "ENGAGEMENT RINGS") {
                        setShowEngagementDropdown(false);
                      }
                    }
                  }}
                >
                  <TransitionLink
                    href={
                      item.name === "FINE JEWELLERY"
                        ? "/fine-jewellery-807?finejewellery=6874b552f2ed2bebef46ccec"
                        : item.name === "WEDDING RINGS"
                          ? "/wedding-rings-105"
                          : item.name === "ENGAGEMENT RINGS"
                            ? "/engagement-rings-334"
                            : item.name === "RINGS"
                              ? "/rings-945"
                              : item?.href
                    }
                    className="group relative text-black hover:text-[#00736C] text-[10px] font-semibold font-gintoNord tracking-wide transition-colors duration-300"
                  >
                    {item.name}
                    <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-[#00736C] transition-all duration-300 group-hover:w-full" />
                  </TransitionLink>
                </div>
              ))}

              {/* MORE Dropdown */}
              {hiddenLeftNavItems.length > 0 && (
                <div
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setShowMoreDropdown(true)}
                  onMouseLeave={() => setShowMoreDropdown(false)}
                >
                  <span className="group relative text-black cursor-pointer hover:text-[#00736C] text-[10px] font-semibold font-gintoNord tracking-wide transition-colors duration-300 inline-block">
                    MORE
                    <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-[#00736C] transition-all duration-300 group-hover:w-full" />
                  </span>

                  <div
                    className={`absolute top-full left-0 w-48 bg-white shadow-md border border-gray-100 py-2 z-50 flex flex-col transition-all duration-300 ease-in-out ${
                      showMoreDropdown
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                      <div className="w-full h-full absolute top-[-40px] left-0 bg-transparent"></div>
                      {hiddenLeftNavItems.map((item) => (
                        <div
                          key={item.name}
                          className="relative px-6 py-3 hover:bg-gray-50"
                          onMouseEnter={() => {
                            if (item.hasDropdown) {
                              if (item.name === "FINE JEWELLERY") {
                                setShowJewelleryDropdown(true);
                                setOpenMenuData(attributesData[item.name] || {});
                              } else if (item.name === "WEDDING RINGS") {
                                setShowWeddingDropdown(true);
                                setOpenMenuData(attributesData[item.name] || {});
                              } else if (item.name === "ENGAGEMENT RINGS") {
                                setShowEngagementDropdown(true);
                                setOpenMenuData(attributesData[item.name] || {});
                              }
                            }
                          }}
                          onMouseLeave={() => {
                            if (item.hasDropdown) {
                              if (item.name === "FINE JEWELLERY") {
                                setShowJewelleryDropdown(false);
                              } else if (item.name === "WEDDING RINGS") {
                                setShowWeddingDropdown(false);
                              } else if (item.name === "ENGAGEMENT RINGS") {
                                setShowEngagementDropdown(false);
                              }
                            }
                          }}
                        >
                          <a
                            href={
                              item.name === "FINE JEWELLERY"
                                ? "/fine-jewellery-807?finejewellery=6874b552f2ed2bebef46ccec"
                                : item.name === "WEDDING RINGS"
                                  ? "/wedding-rings-105"
                                  : item.name === "ENGAGEMENT RINGS"
                                    ? "/engagement-rings-334"
                                    : item.name === "RINGS"
                                      ? "/rings-945"
                                      : item?.href
                            }
                            className="group relative text-black hover:text-[#00736C] text-[10px] font-semibold font-gintoNord tracking-wide transition-colors duration-300 block"
                          >
                            {item.name}
                            <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-[#00736C] transition-all duration-300 group-hover:w-full" />
                          </a>
                        </div>
                      ))}
                    </div>
                </div>
              )}
            </div>

            {/* Logo - Centered on mobile, normal position on desktop */}
            <div ref={logoRef} className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 opacity-0">
              <Link href="/">
                <Image
                  src={ArdorLogo}
                  alt="Ardor Diamonds"
                  width={125}
                  height={50}
                  className="object-contain w-[60px] md:w-[105px] lg:w-[125px]"
                  priority
                />
              </Link>
            </div>

            {/* Right side - Desktop: Navigation + Icons, Mobile: Shopping bag only */}
            <div className="flex lg:w-[40%] w-fit items-center gap-6">
              {/* Desktop Navigation */}
              <div ref={rightNavRef} className="hidden lg:flex items-center justify-start md:gap-6 xl:gap-12 w-full">
                {rightNavItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative font-cullen h-full flex items-center"
                    onMouseEnter={() => {
                      if (item.hasDropdown && item.name === "CONTACT") {
                        setShowContactDropdown(true);
                      }
                      if (item.hasDropdown && item.name === "EDUCATION") {
                        setShowEducationDropdown(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (item.hasDropdown && item.name === "CONTACT") {
                        setShowContactDropdown(false);
                      }
                      if (item.hasDropdown && item.name === "EDUCATION") {
                        setShowEducationDropdown(false);
                      }
                    }}
                  >
                      <Link
                        href={item.href}
                        className="group relative text-black hover:text-[#00736C] text-[10px] font-semibold font-gintoNord tracking-wide transition-colors duration-300 inline-block"
                      >
                        {item.name}
                        <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-[#00736C] transition-all duration-300 group-hover:w-full" />
                      </Link>
                  </div>
                ))}

                {/* Icons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowSearch(true)}
                    className="text-black hover:text-black transition-colors duration-200"
                  >
                    <Search className="text-black" size={20} />
                  </button>
                  <Link href={"/cart"}>
                    <button className="text-black hover:text-[#00736C] transition-colors duration-200">
                      <ShoppingBag className="text-black" size={20} />
                    </button>
                  </Link>
                  <button
                    onClick={handelProfileClick}
                    className="text-black hover:text-[#00736C] transition-colors duration-200"
                  >
                    <User className="text-black" size={20} />
                  </button>
                </div>
              </div>

              {/* Mobile Shopping Bag Icon */}
              <div className="lg:hidden w-12 flex justify-end">
                <Link href={"/cart"}>
                  <button className="text-black hover:text-[#00736C] transition-colors duration-200">
                    <ShoppingBag className="text-black" size={20} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div>
        {/* Fine Jewellery Dropdown Menu */}
        <div
          className={`fixed top-16 lg:top-20 left-0 w-full border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out ${
            showJewelleryDropdown
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          onMouseEnter={() => setShowJewelleryDropdown(true)}
          onMouseLeave={() => setShowJewelleryDropdown(false)}
        >
          <div className="absolute top-[-40px] left-0 w-full h-[40px] bg-transparent" />
          <div className="w-full bg-white border-gray-200 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex gap-12">
                {/* Left Side - Text Categories */}
                <div className="w-48">
                  <div>
                    <h3 className="text-black text-sm font-medium font-gintoNord tracking-wide mb-6">
                      JEWELLERY
                    </h3>
                    <div className="space-y-4">
                      {fineJewellerSubCategories.map((item, index) => {
                        if (
                          item.name.includes("Stacker") ||
                          item.name.includes("Statement") ||
                          item.name.includes("Minimal") ||
                          item.name.includes("Initial Signet")
                        ) {
                          return null;
                        }
                        return (
                          <TransitionLink
                            key={index}
                            href={`/fine-jewellery-807?finejewellery=${item._id}`}
                            className="block capitalize text-black hover:text-[#00736C] text-sm font-gintoNormal transition-colors duration-200"
                          >
                            {item.name}
                          </TransitionLink>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Side - 2x2 Grid of Ring Categories */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4 max-w-full">
                    {/* Statement Rings */}
                    <TransitionLink
                      href={`/fine-jewellery-807?finejewellery=${
                        fineJewellerSubCategories.filter((e) =>
                          e.name.includes("Statement")
                        )[0]?._id
                      }`}
                    >
                      <div className="group cursor-pointer">
                        <div className="relative overflow-hidden lg:mb-2 h-44">
                          <h3 className="text-black text-sm font-medium tracking-wide group-hover:text-[#00736C] font-gintoNord transition-colors duration-200">
                            STATEMENT RINGS
                          </h3>
                          <div className="w-full h-full bg-slate-300 flex items-center justify-center">
                            <Image
                              src={
                                fineJewellerSubCategories.filter((e) =>
                                  e.name.includes("Statement")
                                )[0]?.image || "/images/statement-ring.webp"
                              }
                              width={400}
                              height={400}
                              alt="Statement Ring"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </TransitionLink>

                    {/* Stacker Rings */}
                    <TransitionLink
                      href={`/fine-jewellery-807?finejewellery=${
                        fineJewellerSubCategories.filter((e) =>
                          e.name.includes("Stacker")
                        )[0]?._id
                      }`}
                    >
                      <div className="group cursor-pointer">
                        <div className="relative overflow-hidden lg:mb-2 h-44">
                          <h3 className="text-black text-sm font-medium tracking-wide group-hover:text-[#00736C] font-gintoNord transition-colors duration-200">
                            STACKER RINGS
                          </h3>
                          <div className="w-full h-full bg-yellow-200 flex items-center justify-center">
                            <Image
                              src={
                                fineJewellerSubCategories.filter((e) =>
                                  e.name.includes("Stacker")
                                )[0]?.image || "/images/stacker-ring.webp"
                              }
                              width={400}
                              height={400}
                              alt="Stacker Ring"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </TransitionLink>

                    {/* Minimal Rings */}
                    <TransitionLink
                      href={
                        `/fine-jewellery-807?finejewellery=${
                          fineJewellerSubCategories.filter((e) =>
                            e.name.includes("Minimal")
                          )[0]?._id
                        }` ||
                        "/fine-jewellery-807?finejewellery=6874b552f2ed2bebef46ccec"
                      }
                    >
                      <div className="group cursor-pointer">
                        <div className="relative overflow-hidden lg:mb-2 h-44">
                          <h3 className="text-black text-sm font-medium tracking-wide group-hover:text-[#00736C] font-gintoNord transition-colors duration-200">
                            MINIMAL RINGS
                          </h3>
                          <div className="w-full h-full bg-pink-200 flex items-center justify-center">
                            <Image
                              src={
                                fineJewellerSubCategories.filter((e) =>
                                  e.name.includes("Minimal")
                                )[0]?.image || "/images/minimal-ring.webp"
                              }
                              width={400}
                              height={400}
                              alt="Minimal Ring"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </TransitionLink>

                    {/* Initial Signet Ring */}
                    <TransitionLink href={`/fine-jewellery-807/initial-signet-ring-317`}>
                      <div className="group cursor-pointer">
                        <div className="relative overflow-hidden lg:mb-2 h-44">
                          <h3 className="text-black text-sm font-medium tracking-wide group-hover:text-[#00736C] font-gintoNord transition-colors duration-200">
                            INITIAL SIGNET RING
                          </h3>
                          <div className="w-full h-full bg-blue-200 flex items-center justify-center">
                            <Image
                              src={
                                fineJewellerSubCategories.filter((e) =>
                                  e.name.includes("Initial Signet")
                                )[0]?.image || "/images/signet-ring.webp"
                              }
                              width={400}
                              height={400}
                              alt="Initial Signet Ring"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </TransitionLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Rings Dropdown Menu */}
      <div
        className={`fixed top-16 lg:top-20 left-0 w-full border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out ${
          showEngagementDropdown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        onMouseEnter={() => setShowEngagementDropdown(true)}
        onMouseLeave={() => setShowEngagementDropdown(false)}
      >
        <div className="absolute top-[-40px] left-0 w-full h-[40px] bg-transparent" />
        <div className="w-full bg-white border-gray-100 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex gap-12">
              {/* BUILD A RING */}
              <div className="w-60">
                <h3 className="text-black text-sm font-gintoNord font-bold tracking-wide mb-6">
                  BUILD A RING
                </h3>
                <div className="space-y-4">
                  <TransitionLink
                    href="/engagement-230"
                    className="flex items-center font-gintoNord text-black hover:text-[#00736C] text-sm transition-colors duration-200"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-gray-400 mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    Browse Settings
                  </TransitionLink>
                </div>

                <Link href="/new-arrivals">
                  <div className="mt-8">
                    <h4 className="text-black text-[10px] font-gintoNord font-medium tracking-wide mb-4">
                      NEW ARRIVALS
                    </h4>
                  </div>
                </Link>

                <Link href="/custom-made-engagement-rings">
                  <div className="mt-3">
                    <h4 className="text-black text-[10px] font-gintoNord font-medium tracking-wide mb-4">
                      CUSTOM-MADE RINGS
                    </h4>
                  </div>
                </Link>
              </div>

              {/* SHOP BY METAL */}
              <div className="w-60">
                <h3 className="text-black font-gintoNord text-sm font-medium tracking-wide mb-6">
                  SHOP BY METAL
                </h3>
                <div className="space-y-4">
                  {openMenuData &&
                    openMenuData["METAL TYPE"]?.map((metal, index) => (
                      <TransitionLink
                        key={index}
                        href={`/engagement-230?metal=${metal.value.toLowerCase()}`}
                        className="flex gap-2 items-center text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                      >
                        <Image
                          height={24}
                          width={24}
                          src={metal.image}
                          alt={metal.value}
                        />
                        {metal.value}
                      </TransitionLink>
                    ))}
                </div>
              </div>

              {/* SHOP BY STYLE */}
              <div className="w-60">
                <h3 className="text-black font-gintoNord text-sm font-medium tracking-wide mb-6">
                  SHOP BY STYLE
                </h3>
                <div className="space-y-4">
                  {openMenuData &&
                    openMenuData["Style"]?.map((style, index) => (
                      <TransitionLink
                        key={index}
                        href={`/engagement-230?style=${style.value.toLowerCase()}`}
                        className="flex gap-4 items-center text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                      >
                        <Image
                          height={32}
                          width={40}
                          src={style.image}
                          alt={style.value}
                          className="object-contain brightness-0"
                        />
                        {style.value}
                      </TransitionLink>
                    ))}
                </div>
              </div>

              {/* ENGAGEMENT RING GUIDANCE */}
              <div className="w-60">
                <h3 className="text-black font-bold font-gintoNord font-medium tracking-wide mb-6">
                  ENGAGEMENT RING GUIDANCE
                </h3>
                <div className="space-y-4">
                  <a
                    href="/engagement-rings/build-rings"
                    className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                  >
                    Design Basics
                  </a>
                  <a
                    href="/engagement-rings/build-rings"
                    className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                  >
                    Engagement Ring Guide
                  </a>
                  <a
                    href="/engagement-rings/build-rings"
                    className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                  >
                    Find Your Ring Size
                  </a>
                  <a
                    href="/engagement-rings/build-rings"
                    className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                  >
                    Precious Metals Guide
                  </a>
                  <a
                    href="/engagement-rings/build-rings"
                    className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                  >
                    Our Crafting Process
                  </a>
                  <a
                    href="/engagement-rings/build-rings"
                    className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                  >
                    Ring Care Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Wedding Rings Dropdown Menu */}
        <div
          className={`fixed top-16 lg:top-20 left-0 w-full border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out ${
            showWeddingDropdown
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          onMouseEnter={() => setShowWeddingDropdown(true)}
          onMouseLeave={() => setShowWeddingDropdown(false)}
        >
          <div className="absolute top-[-40px] left-0 w-full h-[40px] bg-transparent" />
          <div className="bg-white border-gray-100 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex gap-12">
                {/* Left Side - Women's Section */}
                <div className="w-60">
                  <h3 className="text-black text-sm font-medium tracking-wide mb-6 font-gintoNord">
                    WOMEN
                  </h3>
                  <div className="space-y-4">
                    <TransitionLink
                      href="/wedding-rings-873?gender=woman"
                      className="block text-black hover:text-[#00736C] font-gintoNormal text-sm transition-colors duration-200"
                    >
                      All Women's Wedding Rings
                    </TransitionLink>
                    {openMenuData &&
                      openMenuData["Style"]?.map((band, index) => (
                        <TransitionLink
                          key={index}
                          href={`/wedding-rings-873?gender=woman&style=${band.value.toLowerCase()}`}
                          className="block text-black hover:text-[#00736C] text-sm font-gintoNormal transition-colors duration-200"
                        >
                          {band.value} Women's Wedding Rings
                        </TransitionLink>
                      ))}
                  </div>
                </div>

                {/* Middle - Rings by Metal */}
                <div className="w-60">
                  <h3 className="text-black text-sm font-medium tracking-wide mb-6 font-gintoNord">
                    RINGS BY METAL
                  </h3>
                  <div className="space-y-4">
                    {openMenuData &&
                      openMenuData["METAL TYPE"]?.map((metal, index) => (
                        <a
                          key={index}
                          href={`/engagement-230?metal=${metal.value.toLowerCase()}`}
                          className="flex gap-2 items-center text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                        >
                          <Image
                            height={24}
                            width={24}
                            src={metal.image}
                            alt={metal.value}
                          />
                          {metal.value}
                        </a>
                      ))}
                  </div>
                </div>

                {/* Right Side - Men's Section */}
                <div className="w-60">
                  <h3 className="text-black text-sm font-medium tracking-wide mb-6 font-gintoNord">
                    MEN
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="/wedding-rings-873?gender=man"
                      className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                    >
                      All Men's Wedding Rings
                    </a>
                    {openMenuData &&
                      openMenuData["Style"]?.map((band, index) => (
                        <a
                          key={index}
                          href={`/wedding-rings-873?gender=man&style=${band.value.toLowerCase()}`}
                          className="block text-black hover:text-[#00736C] text-sm font-gintoNormal transition-colors duration-200"
                        >
                          {band.value} Man's Wedding Rings
                        </a>
                      ))}
                  </div>
                </div>

                {/* Wedding Ring Guidance */}
                <div className="w-60">
                  <h3 className="text-black text-sm font-medium tracking-wide mb-6 font-gintoNord">
                    WEDDING RING GUIDANCE
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="/wedding-rings/women"
                      className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                    >
                      Wedding Ring Guide
                    </a>
                    <a
                      href="/wedding-rings/women"
                      className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                    >
                      Design Basics
                    </a>
                    <a
                      href="/wedding-rings/women"
                      className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                    >
                      Find Your Ring Size
                    </a>
                    <a
                      href="/precious-metals-guide"
                      className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                    >
                      Precious Metals Guide
                    </a>
                    <a
                      href="/crafting-process"
                      className="block text-black hover:text-[#00736C] text-sm transition-colors duration-200 font-gintoNormal"
                    >
                      Our Crafting Process
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Dropdown Menu */}
      <div
        className={`fixed top-16 lg:top-20 left-0 w-full border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out ${
          showContactDropdown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        onMouseEnter={() => setShowContactDropdown(true)}
        onMouseLeave={() => setShowContactDropdown(false)}
      >
        <div className="absolute top-[-40px] left-0 w-full h-[40px] bg-transparent" />
        <div className="w-full bg-white border-gray-100 shadow-lg z-50">
          <div className="max-w-5xl p-4 mx-auto px-4 sm:px-6 lg:px-8 pt-12">
            <div className="flex gap-12">
              {/* Left Side - Contact Options */}
              <div className="w-48 lg:w-[30%]">
                <div>
                  <h3 className="text-black text-sm font-medium font-gintoNord tracking-wide mb-6">
                    CONTACT US
                  </h3>
                  <div>
                    <a
                      href="/contact"
                      className="block text-black hover:bg-[#00736C]/5 py-3 px-1 text-sm font-gintoNormal transition-colors duration-200"
                    >
                      Get In Touch
                    </a>
                    <a
                      href="/meet"
                      className="block text-black hover:bg-[#00736C]/5 py-3 px-1 text-sm font-gintoNormal transition-colors duration-200"
                    >
                      Book an Appointment
                    </a>
                    <a
                      href="/faqs"
                      className="block text-black hover:bg-[#00736C]/5 py-3 px-1 text-sm font-gintoNormal transition-colors duration-200"
                    >
                      FAQs
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side - Images */}
              <div className="flex-1 lg:w-[70%]">
                <div className="grid grid-cols-1 gap-4">
                  {/* Get In Touch */}
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden lg:mb-2 h-44">
                      <h3 className="text-black text-sm font-medium tracking-wide group-hover:text-[#00736C] font-gintoNord transition-colors duration-200">
                        GET IN TOUCH
                      </h3>
                      <div className="w-full h-full bg-slate-300 flex items-center justify-center">
                        <Image
                          src="/images/getintouch.webp"
                          width={400}
                          height={400}
                          alt="Get In Touch"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Book Appointment */}
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden lg:mb-2 h-44">
                      <h3 className="text-black text-sm font-medium tracking-wide group-hover:text-[#00736C] font-gintoNord transition-colors duration-200">
                        BOOK AN APPOINTMENT
                      </h3>
                      <div className="w-full h-full bg-yellow-200 flex items-center justify-center">
                        <Image
                          src="/images/appointment.webp"
                          width={400}
                          height={400}
                          alt="Book Appointment"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Education Dropdown Menu */}
      <div
        className={`fixed top-16 lg:top-20 left-0 w-full border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out ${
          showEducationDropdown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        onMouseEnter={() => setShowEducationDropdown(true)}
        onMouseLeave={() => setShowEducationDropdown(false)}
      >
        <div className="absolute top-[-40px] left-0 w-full h-[40px] bg-transparent" />
        <div className="w-full bg-white border-gray-100 shadow-lg z-50">
          <div className="max-w-7xl p-4 mx-auto px-4 sm:px-6 lg:px-8 pt-12">
            <div className="grid grid-cols-4 space-x-10 space-y-4">
              {educationCategories?.map((category, index) => (
                <div className="" key={index}>
                  <Link
                    href={
                      "/blogs/" +
                      "6878cbb596dfc8337a3359b4/" +
                      category.subCategory._id
                    }
                  >
                    <h2 className="block w-full text-black hover:bg-[#00736C]/5 py-2 px-2 text-lg font-medium font-gintoNormal transition-colors duration-200">
                      {category.subCategory.name}
                    </h2>
                  </Link>
                  {category.blogs.slice(0, 2).map((blog) => (
                    <Link
                      href={
                        "/blogs/" +
                        "6878cbb596dfc8337a3359b4/" +
                        category.subCategory._id +
                        "/" +
                        blog._id
                      }
                      key={blog._id}
                    >
                      <h2 className="block w-full text-black/60 hover:bg-[#00736C]/5 py-2 ml-4 px-2 text-sm font-medium font-gintoNormal transition-colors duration-200">
                        {blog.title}
                      </h2>
                    </Link>
                  ))}
                  <Link
                    href={"#"}
                    className="block w-full text-black/40 hover:text-[#00736C] py-2 ml-4 px-2 text-sm font-medium italic underline transition-colors duration-200"
                  >
                    View more
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileOverlayRef}
        className="lg:hidden fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm transition-all duration-300 pointer-events-none"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        ref={mobileMenuRef}
        className="lg:hidden fixed inset-0 z-[10000] w-full h-screen bg-white flex flex-col pointer-events-none"
      >
        <div className="flex flex-col h-full pointer-events-auto">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-6 h-16 lg:h-20 border-b border-gray-100 bg-white">
            <button
              onClick={() => {
                setShowSearch(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-black hover:text-[#00736C] transition-colors duration-200"
            >
              <Search size={22} />
            </button>
            <button
              ref={mobileCloseBtnRef}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-black hover:text-[#00736C] transition-colors duration-200"
            >
              <X size={28} />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 px-6 py-10 overflow-y-auto">
            <div className="space-y-8 flex flex-col items-start">
              {/* Dynamic Categories from State & Right Nav */}
              {[...navItems, ...rightNavItems].map((cat, catIndex) => {
                const isExpanded = expandedAccordion === catIndex;
                const hasSubMenu = ["ENGAGEMENT RINGS", "WEDDING RINGS", "FINE JEWELLERY", "EDUCATION", "CONTACT"].includes(cat.name);
                
                return (
                  <div key={cat.name} className="mobile-nav-item w-full border-b border-gray-50 pb-4">
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={cat.href}
                        className="text-black hover:text-[#00736C] text-2xl font-light font-gintoNord tracking-tighter transition-colors duration-200"
                        onClick={() => !hasSubMenu && setIsMobileMenuOpen(false)}
                      >
                        {cat.name}
                      </a>
                      {hasSubMenu && (
                        <button
                          onClick={() => toggleAccordion(catIndex)}
                          className="p-2 text-gray-300 hover:text-[#00736C] transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      )}
                    </div>

                    <div 
                      className={`grid transition-all duration-500 ease-in-out ${isExpanded && hasSubMenu ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0 mt-0"}`}
                    >
                      <div className="overflow-hidden ml-2 space-y-6">
                        {/* ENGAGEMENT RINGS SUBMENU */}
                        {cat.name === "ENGAGEMENT RINGS" && (
                          <>
                            {[
                              { title: "BUILD A RING", items: [
                                { name: "Browse Settings", href: "/engagement-230" },
                                { name: "Ready-to-Ship Rings", href: "/engagement-230" },
                                { name: "Custom-Made Rings", href: "/custom-made-engagement-rings" }
                              ]},
                              { title: "SHOP BY METAL", items: attributesData["ENGAGEMENT RINGS"]?.["METAL TYPE"]?.map(m => ({ name: m.value, href: `/engagement-230?metal=${m.value.toLowerCase()}` })) || [] },
                              { title: "SHOP BY STYLE", items: attributesData["ENGAGEMENT RINGS"]?.["Style"]?.map(s => ({ name: s.value, href: `/engagement-230?style=${s.value.toLowerCase()}` })) || [] },
                              { title: "GUIDANCE", items: [
                                { name: "Engagement Ring Guide", href: "/engagement-rings/build-rings" },
                                { name: "Design Basics", href: "/engagement-rings/build-rings" },
                                { name: "Find Your Ring Size", href: "/engagement-rings/build-rings" },
                                { name: "Precious Metals Guide", href: "/engagement-rings/build-rings" },
                                { name: "Our Crafting Process", href: "/engagement-rings/build-rings" },
                                { name: "Ring Care Guide", href: "/engagement-rings/build-rings" }
                              ]}
                            ].map((sub, idx) => (
                              <div key={idx} className="space-y-4">
                                <button 
                                  onClick={() => toggleSubAccordion(`eng-${idx}`)}
                                  className="text-[#00736C] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-between w-full group"
                                >
                                  {sub.title}
                                  <ChevronDown 
                                    size={12} 
                                    className={`transition-transform duration-300 ${expandedSubAccordion === `eng-${idx}` ? "rotate-180" : ""}`} 
                                  />
                                </button>
                                <div className={`grid transition-all duration-300 ease-in-out ${expandedSubAccordion === `eng-${idx}` ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                  <div className="overflow-hidden ml-2 space-y-3 flex flex-col items-start pt-2">
                                    {sub.items?.map((item, i) => (
                                      <a key={i} href={item.href} className="text-black/60 hover:text-black text-sm font-light py-1" onClick={() => setIsMobileMenuOpen(false)}>{item.name}</a>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}

                        {/* WEDDING RINGS SUBMENU */}
                        {cat.name === "WEDDING RINGS" && (
                          <>
                            {[
                              { title: "WOMEN", items: [
                                { name: "All Women's Wedding Rings", href: "/wedding-rings-873?gender=woman" },
                                ...(attributesData["WEDDING RINGS"]?.["Style"]?.map(s => ({ name: `${s.value} Women's`, href: `/wedding-rings-873?gender=woman&style=${s.value.toLowerCase()}` })) || [])
                              ]},
                              { title: "MEN", items: [
                                { name: "All Men's Wedding Rings", href: "/wedding-rings-873?gender=man" },
                                ...(attributesData["WEDDING RINGS"]?.["Style"]?.map(s => ({ name: `${s.value} Men's`, href: `/wedding-rings-873?gender=man&style=${s.value.toLowerCase()}` })) || [])
                              ]},
                              { title: "RINGS BY METAL", items: attributesData["WEDDING RINGS"]?.["METAL TYPE"]?.map(m => ({ name: m.value, href: `/engagement-230?metal=${m.value.toLowerCase()}` })) || [] },
                              { title: "GUIDANCE", items: [
                                { name: "Wedding Ring Guide", href: "/wedding-rings/women" },
                                { name: "Design Basics", href: "/wedding-rings/women" },
                                { name: "Find Your Ring Size", href: "/wedding-rings/women" },
                                { name: "Precious Metals Guide", href: "/precious-metals-guide" },
                                { name: "Our Crafting Process", href: "/crafting-process" }
                              ]}
                            ].map((sub, idx) => (
                              <div key={idx} className="space-y-4">
                                <button 
                                  onClick={() => toggleSubAccordion(`wed-${idx}`)}
                                  className="text-[#00736C] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-between w-full group"
                                >
                                  {sub.title}
                                  <ChevronDown 
                                    size={12} 
                                    className={`transition-transform duration-300 ${expandedSubAccordion === `wed-${idx}` ? "rotate-180" : ""}`} 
                                  />
                                </button>
                                <div className={`grid transition-all duration-300 ease-in-out ${expandedSubAccordion === `wed-${idx}` ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                  <div className="overflow-hidden ml-2 space-y-3 flex flex-col items-start pt-2">
                                    {sub.items?.map((item, i) => (
                                      <a key={i} href={item.href} className="text-black/60 hover:text-black text-sm font-light py-1" onClick={() => setIsMobileMenuOpen(false)}>{item.name}</a>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}

                        {/* FINE JEWELLERY SUBMENU */}
                        {cat.name === "FINE JEWELLERY" && (
                          <div className="space-y-4 pt-2 pb-4">
                            <div className="text-[#00736C] text-[10px] font-bold tracking-[0.2em] uppercase">COLLECTIONS</div>
                            <div className="ml-2 grid grid-cols-2 gap-y-4 gap-x-2">
                              {fineJewellerSubCategories.map((sub, i) => (
                                <a key={i} href={`/fine-jewellery-807?finejewellery=${sub._id}`} className="text-black/60 hover:text-black text-sm font-light border-l border-gray-100 pl-3 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                                  {sub.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* EDUCATION SUBMENU */}
                        {cat.name === "EDUCATION" && (
                          <div className="space-y-6 pt-2 pb-4">
                            {educationCategories?.map((category, idx) => (
                              <div key={idx} className="space-y-3">
                                <Link 
                                  href={`/blogs/6878cbb596dfc8337a3359b4/${category.subCategory._id}`}
                                  className="text-[#00736C] text-[10px] font-bold tracking-[0.2em] uppercase block"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {category.subCategory.name}
                                </Link>
                                <div className="ml-2 space-y-2 flex flex-col">
                                  {category.blogs?.slice(0, 3).map((blog) => (
                                    <Link key={blog._id} href={`/blogs/6878cbb596dfc8337a3359b4/${category.subCategory._id}/${blog._id}`} className="text-black/60 hover:text-black text-[13px] font-light" onClick={() => setIsMobileMenuOpen(false)}>
                                      {blog.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* CONTACT SUBMENU */}
                        {cat.name === "CONTACT" && (
                          <div className="space-y-4 pt-2 pb-4">
                            {[
                              { name: "Get In Touch", href: "/contact" },
                              { name: "Book an Appointment", href: "/meet" },
                              { name: "FAQs", href: "/faqs" }
                            ].map((link, i) => (
                              <a key={i} href={link.href} className="text-black/70 hover:text-[#00736C] text-lg font-light block" onClick={() => setIsMobileMenuOpen(false)}>
                                {link.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Meet With Us & User actions explicitly added if not in navItems */}
              <div className="mobile-nav-item w-full flex items-center justify-between border-b border-gray-50 pb-4">
                 <button onClick={handelProfileClick} className="text-black hover:text-[#00736C] text-2xl font-light font-gintoNord tracking-tighter">
                   MY ACCOUNT
                 </button>
              </div>

              {/* Book Appointment emphasized */}
              <div className="mobile-nav-item pt-4 w-full">
                <a
                  href="/meet"
                  className="inline-flex items-center gap-4 text-[#00736C] text-sm font-bold tracking-[0.2em] uppercase border-b border-[#00736C] pb-2 hover:opacity-70 transition-opacity duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  BOOK APPOINTMENT
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mobile-nav-item px-6 pb-12 mt-auto">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-8 pt-8 border-t border-gray-100">
              {[
                { icon: <Instagram size={24} />, href: "#" },
                { icon: <TikTokIcon />, href: "#" },
                { icon: <Facebook size={24} />, href: "#" },
                { icon: <Youtube size={24} />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="text-gray-400 hover:text-[#00736C] transition-all duration-300 transform hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="mt-10 text-[10px] text-gray-400 tracking-widest uppercase">
              © 2025 Ardor Diamonds
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;