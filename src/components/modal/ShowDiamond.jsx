"use client";

import axiosInstance from "@/axiosConfig/axiosInstance";
import { ArrowLeft, Heart, ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Difference from "./Difference";
import Features from "./Features";
import ModalReviews from "./ModalReviews";
import ModalCertified from "./ModalCertified";
import ShowDiamondFilter from "./ShowDiamondFilter";

const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

function ShowDiamond({
  isVisible,
  onClose,
  filters,
  handelSelectDiamond,
  ref,
}) {
  console.log("Filters in ShowDiamond:", filters);
  if (!isVisible) return null;

  const [data, setData] = React.useState([]);
  const [showDetails, setShowDetails] = React.useState(false);
  const [openDiamond, setOpenDiamond] = React.useState(null);
  const [showCarbonModal, setShowCarbonModal] = React.useState(false);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedDiamondType, setSelectedDiamondType] =
    React.useState("Lab Grown Diamond");
  const [sortBy, setSortBy] = React.useState("Recommended");
  const [appliedFilters, setAppliedFilters] = React.useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `api/diamond/import?searchFields=${JSON.stringify(filters)}&limit=100`
        );
        console.log(
          "Response from diamond import API:",
          response.data.body.data.docs
        );

        setData(response.data.body.data.docs);
      } catch (error) {
        console.error("Error fetching diamond data:", error);
      }
    };

    fetchData();
  }, [filters, appliedFilters]);

  const selectedDiamond = (data) => {
    console.log("Selected diamond data: ==>", data);
    // setShowDetails(false);
    // setOpenDiamond(null);
    // handelSelectDiamond(data);
  };

  const handleApplyFilters = (filterData) => {
    setAppliedFilters(filterData);
    console.log("Applied filters:", filterData);
    // You can combine these filters with your existing filters prop
    // and refetch the data here if needed
  };

  const handleShowFilters = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilters = () => {
    setShowFilterModal(false);
  };

  return (
    <>
      <div
        ref={ref}
        className="fixed flex justify-center inset-0 bg-white/10 backdrop-blur-sm z-999"
      >
        <div className="bg-white w-4/5 max-sm:w-full border-2 overflow-y-scroll border-gray-800/20">
          {/* Header Section */}
          <div className="flex items-center p-2 justify-between mb-4 border-b-[1px] border-gray-200">
            <button
              onClick={onClose}
              className="flex bg-[#346441] px-5 uppercase font-semibold py-2 tracking-widest items-center gap-2 text-white text-[10px] hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Setting
            </button>
          </div>

          {/* Carbon Neutral Banner and Filters */}
          <div className="px-4 pb-4">
            {/* Carbon Neutral Section */}
            <div className="flex max-sm:flex-col items-center gap-4 justify-between mb-4">
              <button
                onClick={() => setShowCarbonModal(true)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">?</span>
                </div>
                <span className="text-xs font-gintoNord font-semibold">
                  All our diamonds are carbon neutral certified
                </span>
                <span className="text-gray-400">?</span>
              </button>

              {/* Diamond Type Selector */}
              {/* <div className="relative flex-1 w-full">
                <select
                  value={selectedDiamondType}
                  onChange={e => setSelectedDiamondType(e.target.value)}
                  className="flex items-center gap-2 px-4 py-2 border w-full text-center border-gray-300 text-xs font-gintoNord font-semibold text-gray-800 rounded bg-white hover:bg-gray-50 transition-colors"
                >
                  <option value="Lab Grown Diamond" className="!text-xs font-gintoNord font-semibold">Lab Grown Diamond</option>
                  <option value="Natural Diamond" className="!text-xs font-gintoNord font-semibold">Natural Diamond</option>
                  <option value="Carbon Neutral Diamond" className="text-xs font-gintoNord font-semibold">Carbon Neutral Diamond</option>
                  <option value="Certified Diamond" className="!text-xs font-gintoNord font-semibold">Certified Diamond</option>
                </select>
              </div> */}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort:</span>
                  <div className="relative">
                    <button
                      className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        // Add sort functionality here if needed
                      }}
                    >
                      <span className="text-sm">{sortBy}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-2 bg-[#346441] text-white text-[10px] font-semibold rounded hover:bg-[#2d5538] transition-colors">
                  <span>SHOW</span>
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Show Filters Button */}
            {/* <div className="flex justify-center">
              <button 
                onClick={handleShowFilters}
                className="bg-[#346441] text-white px-16 py-2 text-[10px] font-semibold uppercase tracking-widest hover:bg-[#2d5538] transition-colors"
              >
                SHOW FILTERS
              </button>
            </div> */}
          </div>

          {/* Diamond Grid */}
          <div className="p-4 w-full grid grid-cols-1 sm:grid-cols-3 space-y-6 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.map((diamond) => (
              <div
                className="text-black cursor-pointer group flex flex-col gap-1 items-center"
                key={diamond._id}
                onClick={() => {
                  setOpenDiamond(diamond);
                  setShowDetails(true);
                }}
              >
                <div className="bg-[#c3c4cc] aspect-square group-hover:scale-[1.03] hide-scrollbar transition-transform duration-200 overflow-hidden w-full">
                  <iframe
                    src={diamond.video}
                    title={`Video for ${diamond._id}`}
                    className="w-full h-[400px] overflow-hidden hide-scrollbar"
                    allowFullScreen
                  ></iframe>
                </div>

                <h2 className="mt-2 font-extralight text-lg">
                  {diamond.weight}w - {diamond.color} - {diamond.clarity}
                </h2>
                <h2 className="text-[10px] font-medium">
                  {diamond.measurements}
                </h2>
                <h2 className="text-[10px] font-medium">{diamond.net}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <ShowDiamondFilter
        isVisible={showFilterModal}
        onClose={handleCloseFilters}
        onApplyFilters={handleApplyFilters}
      />

      {/* Carbon Neutral Modal */}
      {showCarbonModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full mx-4 rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowCarbonModal(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#346441] text-white text-sm rounded hover:bg-[#2d5538] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>CLOSE</span>
                </button>
                <button
                  onClick={() => setShowCarbonModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-light text-gray-800 mb-4">
                  100% Carbon Neutral Lab Grown Diamonds
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  At Cullen Jewellery, we push the boundaries of what is
                  possible. That's why we are proud to partner with Clear
                  Neutral, a leading carbon neutral certification company. This
                  trailblazing collaboration allows us to offer you lab grown
                  diamonds that are 100% carbon neutral, which brings our vision
                  of luxury and responsibility coexisting beautifully to life.
                </p>
                <button className="mt-6 text-[#346441] text-sm font-medium hover:underline">
                  Read more here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-99999 w-full overflow-y-auto h-screen flex justify-center bg-black/20">
          <ProductModal
            onClose={() => {
              setShowDetails(false);
              setOpenDiamond(null);
            }}
            data={openDiamond}
            handelSelectDiamond={(data) => selectedDiamond(data)}
          />
        </div>
      )}
    </>
  );
}

export default ShowDiamond;

const ProductModal = ({ onClose, loading, data, handelSelectDiamond }) => {
  return (
    <>
      <div className="bg-[#f4efe9] w-3/5 max-sm:w-[90vw] z-50 p-3 h-fit">
        <button
          onClick={onClose}
          className="flex bg-[#346441] px-5 mb-3 uppercase font-semibold py-2 tracking-widest items-center gap-2 text-white text-[10px] hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Setting
        </button>

        <div className="flex flex-col md:flex-row gap-10 p-8 items-center justify-between">
          <div className="w-1/2 h-full">
            <iframe
              height={"fit-content"}
              src={data?.video}
              title={`Video for ${data?._id}`}
              className="w-full h-[400px]"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-1/2">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-medium text-gray-800">
                {data?.weight}w - {data?.color} - {data?.clarity} {data?.shape}{" "}
                Lab Grown Diamond
              </h2>
              <h3 className="text-sm tracking-wider font-bold text-gray-800">
                {currencySymbol}
                {data?.net}
              </h3>

              <div className="text-black text-sm">
                <div className="flex border-b border-black/20 w-full">
                  <div className="w-1/3 border-r text-right border-black/20 px-3 py-1">
                    SKU
                  </div>
                  <div className="w-2/3 px-3 py-1 bg-[#eae6e2]">
                    {data.certino}
                  </div>
                </div>
                <div className="flex border-b border-black/20 w-full">
                  <div className="w-1/3 capitalize border-r text-right border-black/20 px-3 py-1">
                    Shape
                  </div>
                  <div className="w-2/3 px-3 py-1 bg-[#eae6e2]">
                    {data.shape}
                  </div>
                </div>
                <div className="flex border-b border-black/20 w-full">
                  <div className="w-1/3 capitalize border-r text-right border-black/20 px-3 py-1">
                    length
                  </div>
                  <div className="w-2/3 px-3 py-1 bg-[#eae6e2]">
                    {data.measurements.split(" x ")[0]}mm
                  </div>
                </div>
                <div className="flex border-b border-black/20 w-full">
                  <div className="w-1/3 capitalize border-r text-right border-black/20 px-3 py-1">
                    width
                  </div>
                  <div className="w-2/3 px-3 py-1 bg-[#eae6e2]">
                    {data.measurements.split(" x ")[1]}mm
                  </div>
                </div>
                <div className="flex border-b border-black/20 w-full">
                  <div className="w-1/3 capitalize border-r text-right border-black/20 px-3 py-1">
                    depth
                  </div>
                  <div className="w-2/3 px-3 py-1 bg-[#eae6e2]">
                    {data.measurements.split(" x ")[2]}mm
                  </div>
                </div>
                <div className="flex border-b border-black/20 w-full">
                  <div className="w-1/3 capitalize border-r text-right border-black/20 px-3 py-1">
                    color
                  </div>
                  <div className="w-2/3 px-3 py-1 bg-[#eae6e2]">
                    {data.color}
                  </div>
                </div>
                <div className="flex border-b border-black/20 w-full">
                  <div className="w-1/3 capitalize border-r text-right border-black/20 px-3 py-1">
                    clarity
                  </div>
                  <div className="w-2/3 px-3 py-1 bg-[#eae6e2]">
                    {data.clarity}
                  </div>
                </div>
                <div className="flex border-b border-black/20 w-full">
                  <div className="w-1/3 capitalize border-r text-right border-black/20 px-3 py-1">
                    polish
                  </div>
                  <div className="w-2/3 px-3 py-1 bg-[#eae6e2]">
                    {data.polish}
                  </div>
                </div>
                <div className="flex border-b border-black/20 w-full">
                  <div className="w-1/3 capitalize border-r text-right border-black/20 px-3 py-1">
                    cut
                  </div>
                  <div className="w-2/3 px-3 py-1 bg-[#eae6e2]">{data.cut}</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handelSelectDiamond(data)}
              className={`w-full cursor-pointer mt-2 py-3 px-4 text-sm font-medium uppercase tracking-wider transition-colors btn text-white hover:bg-green-700`}
            >
              CHOOSE THIS DIAMOND | {currencySymbol}
              {data.net.toFixed(2) || "00"}
            </button>
          </div>
        </div>
        <Difference />
        <Features />
        <ModalReviews />
        <ModalCertified />
      </div>
    </>
  );
};
