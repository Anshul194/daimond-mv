"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image"; // Correct import for Next.js Image component
import Link from "next/link"; // Ensure this is the correct import
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import {
  fetchBlogById,
  fetchBlogBySubCategoryId,
  fetchSubCategoryById,
} from "@/store/slices/blogCategory";
import { convertDateToReadableFormat } from "../page";

const page = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const params = useParams();
  const { Id, subCategory } = params;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(fetchBlogById(Id));
      if (fetchBlogById.fulfilled.match(result)) {
        console.log("Fetched Blog Data:", result.payload);
        setData(result.payload);
      }
      const res = await dispatch(fetchBlogBySubCategoryId(subCategory));
      console.log("Fetched SubCategory Data:", res.payload);
      setOtherBlogs(res.payload || {});
    };
    fetchData();
  }, [dispatch, Id]);

  // Static blog data matching the image
  const blogItems = useMemo(
    () => [
      {
        id: 1,
        title: "The Cullen Guide to Styling Stacker Rings",
        date: "Mar 14, 2025",
        image:
          "https://media.cullenjewellery.com/cdn-cgi/image/width=600,height=600/content/pages/education/engagement-ring-guidance/engagement-ring-setting-styles-the-ultimate-guide/your-guide-to-thicker-band-engagement-rings/soroya_on_hand.jpg",
      },
      {
        id: 2,
        title: "The Best Wedding Band and Engagement Ring Combinations",
        date: "Oct 11, 2024",
        image:
          "https://media.cullenjewellery.com/cdn-cgi/image/width=600,height=600/content/pages/education/engagement-ring-guidance/engagement-ring-setting-styles-the-ultimate-guide/your-guide-to-thicker-band-engagement-rings/03_Pia_Still_Life_4x5.jpg",
      },
      {
        id: 3,
        title: "The Ban",
        date: "Jul 16, 2025",
        image:
          "https://media.cullenjewellery.com/cdn-cgi/image/width=600,height=600/content/pages/education/engagement-ring-guidance/engagement-ring-setting-styles-the-ultimate-guide/your-guide-to-thicker-band-engagement-rings/soroya_on_hand.jpg",
      },
    ],
    []
  );

  // Update items per view based on screen size
  const updateItemsPerView = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setItemsPerView(4);
    } else if (width >= 768) {
      setItemsPerView(3);
    } else {
      setItemsPerView(1);
    }
  }, []);

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [updateItemsPerView]);

  const maxSlides = useMemo(
    () => Math.max(0, otherBlogs.length - itemsPerView),
    [otherBlogs.length, itemsPerView]
  );

  const nextSlide = useCallback(() => {
    if (currentSlide < maxSlides) {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, maxSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  const slideWidth = useMemo(() => 100 / itemsPerView, [itemsPerView]);

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative h-96 bg-cover bg-center bg-no-repeat mb-8"
        style={{
          backgroundImage: `url('${data?.thumbnailImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/20 bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-5xl font-light font-arizona mb-2 tracking-wide">
              {data?.title || "Blog Title"}
            </h1>
            <p className="text-lg md:text-sm font-gintoNord font-light">
              {data?.BlogCategory.name} {">"} {data?.BlogSubCategory.name}
            </p>
            <p className="text-lg md:text-sm font-gintoNord font-light">
              {convertDateToReadableFormat(data?.createdAt)} — by Cullen
              Jewellery
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Main Content Placeholder */}
        <div className="mt-8 prose max-w-none">
          <p className="text-gray-700 text-xs leading-relaxed">
            {data?.description}
          </p>
        </div>

        <div>
          <div
            className="text-gray-800"
            dangerouslySetInnerHTML={{ __html: data?.content }}
          ></div>
          <style jsx>{`
            ul {
              list-style-type: disc;
              margin-left: 1.5rem;
            }
            li {
              margin-bottom: 0.5rem;
            }
            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              margin-top: 1rem;
              color: #1a202c; /* Customize the color as needed */
            }
            h1 {
              font-size: 2.25rem;
              font-weight: 700;
              line-height: 1.3;
            }
            h2 {
              font-size: 1.875rem;
              font-weight: 700;
              line-height: 1.3;
            }
            h3 {
              font-size: 1.5rem;
              font-weight: 700;
              line-height: 1.3;
            }
            h4 {
              font-size: 1.25rem;
              font-weight: 600;
              line-height: 1.3;
            }
            h5 {
              font-size: 1rem;
              font-weight: 600;
              line-height: 1.3;
            }
            h6 {
              font-size: 0.875rem;
              font-weight: 600;
              line-height: 1.3;
            }
            a {
              color: blue; /* Link color */
            }

            figure {
              margin: 1.5rem 0;
              text-align: center;
              width: 100%;
              border: 1px solid #e2e8f0; /* Border color */
            }
            figure img {
              max-width: 100%;
              height: auto;
            }

            figure figcaption {
              font-size: 0.875rem;
              color: #4a5568; /* Customize the color as needed */
            }
          `}</style>
        </div>

        {/* Section: Thicker bands are having a moment */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-light font-arizona mb-6 text-gray-800">
            Thicker bands are having a moment
          </h2>

          <p className="text-gray-700 text-xs leading-relaxed mb-8">
            Why are thicker bands so popular? It could be because of their
            versatility, as a wider band can make a statement more easily or
            there is extra room to add a touch of sparkle or an additional
            design element. They can also be dressed down to let the metal speak
            for itself with a simple setting such as our Soraya, making them
            super versatile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         
            <div className="bg-gray-100 overflow-hidden">
              <img
                src="https://media.cullenjewellery.com/cdn-cgi/image/width=600,height=600/content/pages/education/engagement-ring-guidance/engagement-ring-setting-styles-the-ultimate-guide/your-guide-to-thicker-band-engagement-rings/soroya_on_hand.jpg"
                alt="Soraya - East West Oval With Cigar Band"
                width={600}
                height={350}
                className="w-full h-[350px] object-cover"
              />
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600 font-medium">
                  Soraya - East West Oval With Cigar Band
                </p>
              </div>
            </div>

            <div className="bg-gray-100 overflow-hidden">
              <img
                src="https://media.cullenjewellery.com/cdn-cgi/image/width=600,height=600/content/pages/education/engagement-ring-guidance/engagement-ring-setting-styles-the-ultimate-guide/your-guide-to-thicker-band-engagement-rings/03_Pia_Still_Life_4x5.jpg"
                alt="Pia - Marquise Solitaire with Twist Band in Platinum"
                width={600}
                height={350}
                className="w-full h-[350px] object-cover"
              />
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600 font-medium">
                  Pia - Marquise Solitaire with Twist Band in Platinum
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="mt-12">
          <h2 className="text-2xl font-light font-arizona mb-6 text-gray-800">
            What makes a thick band engagement ring?
          </h2>

          <p className="text-gray-700 text-xs leading-relaxed mb-8">
            Thicker band engagement rings are a dream to stack, as the higher
            surface area and greater amount of metal compliments other bands to
            give a flush and elegant look. The width of the band, which can
            generally range from around 2.5mm to 5mm also makes the thick band
            engagement ring a perfect stand alone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-100 overflow-hidden">
              <img
                src="https://media.cullenjewellery.com/cdn-cgi/image/width=600,height=600/content/pages/education/engagement-ring-guidance/engagement-ring-setting-styles-the-ultimate-guide/your-guide-to-thicker-band-engagement-rings/soroya_on_hand.jpg"
                alt="Gigi - Marquise Solitaire with Hidden Halo and Cigar Band"
                width={600}
                height={350}
                className="w-full h-[350px] object-cover"
              />
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600 font-medium">
                  Gigi - Marquise Solitaire with Hidden Halo and Cigar Band
                </p>
              </div>
            </div>

            <div className="bg-gray-100 overflow-hidden">
              <img
                src="https://media.cullenjewellery.com/cdn-cgi/image/width=600,height=600/content/pages/education/engagement-ring-guidance/engagement-ring-setting-styles-the-ultimate-guide/your-guide-to-thicker-band-engagement-rings/03_Pia_Still_Life_4x5.jpg"
                alt="Our Collection of Statement Rings with thicker bands"
                width={600}
                height={350}
                className="w-full h-[350px] object-cover"
              />
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600 font-medium">
                  Our Collection of Statement Rings with thicker bands
                </p>
              </div>
            </div>
          </div>
        </div> */}
        {/* 
        <div className="mt-12">
          <h2 className="text-2xl font-light font-arizona mb-6 text-gray-800">
            What makes a thick band engagement ring?
          </h2>

          <p className="text-gray-700 text-xs leading-relaxed mb-8">
            If you are a fan of the thicker band which is certainly growing in
            popularity recently, then naturally the thickness becomes an
            important consideration. How thick the band is will differ from
            person to person based on their personal style and tastes. Ring size
            can also be a key factor in deciding on the thickness, as someone
            with a smaller ring size may benefit from a slightly thinner band
            width to keep things proportional. The best way to determine what
            thickness you prefer is to try on different band widths in person,
            as it can be harder to gauge just looking at photos. Here at Cullen,
            we have a wide variety of different bandwidth options for you to try
            on in one of our showrooms where you can book an appointment here .
          </p>
        </div> */}

        {/* <div className="mt-12">
          <h2 className="text-2xl font-light font-arizona mb-6 text-gray-800">
            How wide should my engagement ring be?
          </h2>

          <p className="text-gray-700 text-xs leading-relaxed mb-8">
            If you are a fan of the thicker band which is certainly growing in
            popularity recently, then naturally the thickness becomes an
            important consideration. How thick the band is will differ from
            person to person based on their personal style and tastes. Ring size
            can also be a key factor in deciding on the thickness, as someone
            with a smaller ring size may benefit from a slightly thinner band
            width to keep things proportional. The best way to determine what
            thickness you prefer is to try on different band widths in person,
            as it can be harder to gauge just looking at photos. Here at Cullen,
            we have a wide variety of different bandwidth options for you to try
            on in one of our showrooms where you can book an appointment here .
          </p>
        </div> */}

        {/* Section: 3 Reasons to go with a thicker band */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-light font-arizona mb-6 text-gray-800">
            3 Reasons to go with a thicker band
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-gray-100 overflow-hidden mb-4">
                <img
                  src="https://media.cullenjewellery.com/cdn-cgi/image/width=600,height=600/content/pages/education/engagement-ring-guidance/engagement-ring-setting-styles-the-ultimate-guide/your-guide-to-thicker-band-engagement-rings/soroya_on_hand.jpg"
                  alt="Bronte - Cigar Band Oval Solitaire & Clara - Pavé Edge Cigar Band"
                  width={600}
                  height={176}
                  className="w-full h-44 object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 font-medium mb-4">
                Bronte - Cigar Band Oval Solitaire & Clara - Pavé Edge Cigar
                Band
              </p>
              <h3 className="text-lg !text-start font-medium text-gray-800 mb-3">
                Balanced and Proportional
              </h3>
              <p className="text-gray-700 !text-start text-xs leading-relaxed">
                Engagement rings with a more substantial width tend to create
                visual balance with wedding bands or eternity bands more
                effectively than thinner bands. Thinner bands can sometimes
                create a top heavy look when stacked with thicker bands, which
                for some visually is not as aesthetic as a balanced look of
                equal thicknesses that are complementary.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-100 overflow-hidden mb-4">
                <img
                  src="https://media.cullenjewellery.com/cdn-cgi/image/width=600,height=600/content/pages/education/engagement-ring-guidance/engagement-ring-setting-styles-the-ultimate-guide/your-guide-to-thicker-band-engagement-rings/03_Pia_Still_Life_4x5.jpg"
                  alt="Angie - Marquise East West Bezel Solitaire in Platinum"
                  width={600}
                  height={176}
                  className="w-full h-44 object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 font-medium mb-4">
                Angie - Marquise East West Bezel Solitaire in Platinum
              </p>
              <h3 className="text-lg !text-start font-medium text-gray-800 mb-3">
                Practical and stunning, its a win win
              </h3>
              <p className="text-gray-700 !text-start text-xs leading-relaxed">
                There are also several practical reasons for going with a wider
                band. Diamonds and gemstones in thicker bands can often be set
                more securely than in thinner bands, and can be larger as there
                is more surface area to work with, which also makes them more
                durable. For some, wearing thicker bands can be more comfortable
                too.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-100 overflow-hidden mb-4">
                <img
                  src="https://media.cullenjewellery.com/cdn-cgi/image/width=600,height=600/content/pages/education/engagement-ring-guidance/engagement-ring-setting-styles-the-ultimate-guide/your-guide-to-thicker-band-engagement-rings/soroya_on_hand.jpg"
                  alt="Hayley - Oval Twist Band Solitaire & Moana - Pavé Curved Wedding Band"
                  width={600}
                  height={176}
                  className="w-full h-44 object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 font-medium mb-4">
                Hayley - Oval Twist Band Solitaire & Moana - Pavé Curved Wedding
                Band
              </p>
              <h3 className="text-lg !text-start font-medium text-gray-800 mb-3">
                Design Flexibility
              </h3>
              <p className="text-gray-700 !text-start text-xs leading-relaxed">
                Thicker bands have the added benefit of being flexible in the
                sense that they can have flat or a more curved profile, or even
                the band can be entirely curved such as our Hayley Oval
                Solitaire. This gives a more cohesive, stacked look that is
                intentional.
              </p>
            </div>
          </div>
        </div> */}

        {/* Section: Summary */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-light font-arizona mb-6 text-gray-800">
            Summary
          </h2>

          <p className="text-gray-700 text-xs leading-relaxed mb-8">
            Thicker engagement rings mark a move away from the thinner and more
            delicate bands that have been popular for the last few decades to a
            modern and contemporary chunky look. Their practicality and
            durability mixed with their clean timeless aesthetic means thicker
            engagement rings that make a statement are not going anywhere, and
            we are absolutely here for it.
          </p>

          <div className="text-center mb-12">
            <button className="bg-green-800 text-white px-8 py-3 text-sm font-medium uppercase tracking-wide hover:bg-green-700 transition-colors">
              BROWSE OUR RANGE OF STATEMENT RINGS TODAY
            </button>
          </div>
        </div> */}

        {/* Section: Related Blogs */}
        <div className="mt-12">
          <h2 className="text-2xl font-light font-arizona mb-6 text-gray-800">
            Related Blogs
          </h2>

          {/* Slider Container */}
          <div className="relative overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * slideWidth}%)`,
              }}
            >
              {otherBlogs &&
                otherBlogs.length > 0 &&
                otherBlogs?.map((item) => (
                  <Link
                    key={item._id}
                    href={`/blogs/${data.BlogCategory._id}/${data.BlogSubCategory._id}/${item._id}`} // Adjust URL as needed
                    className="flex-shrink-0 min-w-[200px] px-2"
                  >
                    <div className="group cursor-pointer">
                      {/* Image Container */}
                      <div className="aspect-[2/1] h-40 bg-gray-100 overflow-hidden mb-2 relative">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Date and Title */}
                      <p className="text-[10px] text-gray-600 mb-1">
                        {item.date}
                      </p>
                      <h3 className="text-[14px] font-semibold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
            </div>

            {/* Navigation Arrows */}
            {currentSlide > 0 && (
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 z-10"
                aria-label="Previous slide"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            {currentSlide < maxSlides && (
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 z-10"
                aria-label="Next slide"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-300 mt-4">
            <div
              className="h-full bg-gray-600"
              style={{
                width: `${((currentSlide + 1) / blogItems.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
