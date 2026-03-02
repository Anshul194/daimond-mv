"use client"

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { fetchFaqs } from '@/store/slices/faq';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});
  const dispatch = useDispatch();
  const { faqs, loading, error } = useSelector((state) => state.faq);

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  // Handle page transition curtain
  useEffect(() => {
    if (!loading) {
      // Small delay to ensure DOM is ready before lifting curtain
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("__page-data-ready"));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const FAQSection = ({ title, items }) => (
    <div className="mb-12">
      <h2 className="text-2xl md:text-2xl lg:text-3xl font-arizona font-light text-gray-800 mb-8">{title}</h2>

      <div className="space-y-1">
        {items.map((item, index) => {
          return (
            <div key={item._id || index} className="border-b border-gray-400">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleItem(index);
                }}
                className="w-full flex items-center py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="transition-transform duration-300 ease-in-out">
                  {openItems[index] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 mr-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mr-4" />
                  )}
                </div>
                <span className="text-gray-700 font-medium text-[10px] font-gintoNord tracking-wide uppercase">
                  {item.title}
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openItems[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="pb-4 px-4">
                  <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className='w-full bg-white min-h-screen'>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800 mb-4 font-arizona">FAQs</h1>
          <div className="w-16 h-1 bg-gray-400 mx-auto mb-8"></div>
          <p className="text-gray-600 mb-8 font-gintoNormal text-sm">
            If you have any questions at all that we do not cover below please{' '}
            <span className="text-[#00736C] underline cursor-pointer">get in touch via our Contact page</span>.
          </p>

          {/* Status Indicators */}
          {loading && <p className="text-gray-500 animate-pulse">Updating FAQ data...</p>}
          {error && <p className="text-red-500">Error loading FAQs. Please try again later.</p>}
        </div>

        {/* Dynamic FAQ List */}
        {!loading && faqs && faqs.length > 0 ? (
          <FAQSection
            title="General FAQ"
            items={faqs}
          />
        ) : !loading && (
          <div className="text-center py-20 border-t border-gray-100">
            <p className="text-gray-400 font-arizona font-light">Your diamond journey is uniquely yours. Please check back soon for updated guidance or reach out to us directly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
