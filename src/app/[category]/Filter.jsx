"use client";

import React, { use, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const JewelryFilter = ({ Data }) => {
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedSetting, setSelectedSetting] = useState("");
  const [selectedBand, setSelectedBand] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [twoTone, setTwoTone] = useState(false);
  const [shapeStartIndex, setShapeStartIndex] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  console.log("current path:", pathName);

  const visibleShapes = Data?.Shape?.slice(
    shapeStartIndex,
    shapeStartIndex + 8
  );
  const canScrollLeft = shapeStartIndex > 0;
  const canScrollRight = shapeStartIndex + 8 < Data?.Shape?.length;

  const scrollShapes = (direction) => {
    if (direction === "left" && canScrollLeft) {
      setShapeStartIndex(shapeStartIndex - 7);
    } else if (direction === "right" && canScrollRight) {
      setShapeStartIndex(shapeStartIndex + 7);
    }
  };

  // Calculate progress percentage properly
  const totalPages = Math.ceil(visibleShapes?.length / 8);
  const currentPage = Math.ceil((shapeStartIndex + 8) / 8);
  const progressPercentage = (currentPage / totalPages) * 100;

  const updateQuery = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value.toLowerCase());
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  const handleShapeSelect = (id) => {
    if (id === selectedShape) {
      setSelectedShape("");
      updateQuery("shape", "");
    } else {
      setSelectedShape(id);
      updateQuery("shape", id);
    }
  };

  const handleMetalSelect = (id) => {
    if (id === selectedMetal) {
      setSelectedMetal("");
      updateQuery("metal", "");
    } else {
      setSelectedMetal(id);
      updateQuery("metal", id);
    }
  };

  const handleProfileSelect = (id) => {
    if (id === selectedProfile) {
      setSelectedProfile("");
      updateQuery("profile", "");
    } else {
      setSelectedProfile(id);
      updateQuery("profile", id);
    }
  };

  const handleStyleSelect = (id) => {
    if (id === selectedSetting) {
      setSelectedSetting("");
      updateQuery("style", "");
    } else {
      setSelectedSetting(id);
      updateQuery("style", id);
    }
  };

  const handleBandSelect = (id) => {
    if (id === selectedBand) {
      setSelectedBand("");
      updateQuery("band", "");
    } else {
      setSelectedBand(id);
      updateQuery("band", id);
    }
  };

  const handleGenderSelect = (id) => {
    if (id === selectedGender) {
      setSelectedGender("");
      updateQuery("gender", "");
    } else {
      setSelectedGender(id);
      updateQuery("gender", id);
    }
  };

  useEffect(() => {
    if (!Data || Object.keys(Data).length === 0) return;

    const shape = searchParams.get("shape")?.toLowerCase();
    const metal = searchParams.get("metal")?.toLowerCase();
    const profile = searchParams.get("profile")?.toLowerCase();
    const style = searchParams.get("style")?.toLowerCase();
    const band = searchParams.get("band")?.toLowerCase();
    const gender = searchParams.get("gender")?.toLowerCase();

    if (shape) setSelectedShape(shape);
    if (metal) setSelectedMetal(metal);
    if (profile) setSelectedProfile(profile);
    if (style) setSelectedSetting(style);
    if (band) setSelectedBand(band);
    if (gender) setSelectedGender(gender);
  }, [Data]);

  if (pathName.toLowerCase().includes("wedding")) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {Data?.Style && Data?.Style.length > 0 && (
            <div className="">
              <h3 className="text-xs font-medium text-gray-600 tracking-wide font-gintoNord mb-4">
                SETTING STYLE ?
              </h3>
              <div className="flex w-full overflow-x-scroll">
                {Data?.Style?.map((profile) => (
                  <div
                    key={profile._id}
                    onClick={() =>
                      handleStyleSelect(profile.value.toLowerCase())
                    }
                    className={`flex flex-col items-center cursor-pointer rounded-lg transition-all min-w-[100px] ${
                      selectedSetting === profile.value.toLowerCase()
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-16 h-12 flex items-center justify-center mb-2 border ${
                        selectedSetting === profile.value.toLowerCase()
                          ? "border-gray-400 bg-white"
                          : "border-gray-200"
                      } rounded`}
                    >
                      <img
                        src={profile.image}
                        alt={profile.value}
                        className="w-12 h-8 object-contain brightness-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                      <div className="w-12 h-6 bg-gray-300 rounded-sm hidden"></div>
                    </div>
                    <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap font-gintoNord">
                      {profile.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Data?.["METAL TYPE"] && Data?.["METAL TYPE"].length > 0 && (
            <div className=" ">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium text-gray-600 tracking-wide font-gintoNord">
                  METAL TYPE ?
                </h3>
                <label className="flex items-center gap-2 text-[10px] font-gintoNord text-gray-600">
                  <input
                    type="checkbox"
                    checked={twoTone}
                    onChange={(e) => setTwoTone(e.target.checked)}
                    className="rounded "
                  />
                  TWO TONE
                </label>
              </div>

              <div className="flex gap-4 justify-center">
                {Data?.["METAL TYPE"]?.map((metal) => (
                  <div
                    key={metal._id}
                    onClick={() => handleMetalSelect(metal.value.toLowerCase())}
                    className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${
                      selectedMetal === metal.value.toLowerCase()
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={metal.image}
                      className={`w-10 h-10 rounded-full mb-2 border-2 ${
                        selectedMetal === metal.value.toLowerCase()
                          ? "border-gray-400"
                          : "border-gray-200"
                      } `}
                    ></img>
                    <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord">
                      {metal.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex w-1/2 h-10 mx-auto justify-center items-center text-gray-600 text-xs font-gintoNord">
          <div
            onClick={() => handleGenderSelect("woman")}
            className={`${
              selectedGender === "woman"
                ? "bg-[#236339] text-white"
                : "text-[#236339] "
            } w-full cursor-pointer h-full flex justify-center items-center border-2 font-semibold text-medium uppercase border-[#236339]`}
          >
            Woman
          </div>
          <div
            onClick={() => handleGenderSelect("man")}
            className={`${
              selectedGender === "man"
                ? "bg-[#236339] text-white"
                : "text-[#236339] "
            } w-full cursor-pointer h-full flex justify-center items-center border-2 font-semibold text-medium uppercase border-l-0 border-[#236339]`}
          >
            Man
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      {/* Top Two Sections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Shape Section */}
        {Data?.Shape && Data?.Shape.length > 0 && (
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord">
                SHAPE ?
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollShapes("left")}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full ${
                  canScrollLeft
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-gray-50 cursor-not-allowed"
                }`}
              >
                <ChevronLeft
                  className={`w-4 h-4 ${
                    canScrollLeft ? "text-gray-600" : "text-gray-300"
                  }`}
                />
              </button>

              <div className="flex gap-4 flex-1 overflow-hidden">
                {visibleShapes?.map((shape) => (
                  <div
                    key={shape._id}
                    onClick={() => handleShapeSelect(shape.value.toLowerCase())}
                    className={`flex flex-col items-center cursor-pointer  rounded-lg transition-all ${
                      selectedShape === shape.value.toLowerCase()
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 flex items-center justify-center mb-2 ${
                        selectedShape === shape.value.toLowerCase()
                          ? "border-gray-400 bg-gray-100"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={shape.image}
                        alt={shape.value}
                        className="w-8 h-8 brightness-0 object-contain"
                        onError={(e) => {
                          // Fallback to text if image fails to load
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                      <span className="text-lg text-gray-400 hidden">◈</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord">
                      {shape.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollShapes("right")}
                disabled={!canScrollRight}
                className={`p-2 rounded-full ${
                  canScrollRight
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-gray-50 cursor-not-allowed"
                }`}
              >
                <ChevronRight
                  className={`w-4 h-4 ${
                    canScrollRight ? "text-gray-600" : "text-gray-300"
                  }`}
                />
              </button>
            </div>

            {/* Progress indicator - contained within the box */}
            <div className="mt-4">
              <div className="w-1/2 bg-gray-200 rounded-full h-1">
                <div
                  className="bg-gray-400 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Metal Type Section */}
        {Data?.["METAL TYPE"] && Data?.["METAL TYPE"].length > 0 && (
          <div className=" ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord">
                METAL TYPE ?
              </h3>
              <label className="flex items-center gap-2 text-[10px] font-gintoNord text-gray-600">
                <input
                  type="checkbox"
                  checked={twoTone}
                  onChange={(e) => setTwoTone(e.target.checked)}
                  className="rounded "
                />
                TWO TONE
              </label>
            </div>

            <div className="flex gap-4 justify-center">
              {Data?.["METAL TYPE"]?.map((metal) => (
                <div
                  key={metal._id}
                  onClick={() => handleMetalSelect(metal.value.toLowerCase())}
                  className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${
                    selectedMetal === metal.value.toLowerCase()
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={metal.image}
                    className={`w-10 h-10 rounded-full mb-2 border-2 ${
                      selectedMetal === metal.value.toLowerCase()
                        ? "border-gray-400"
                        : "border-gray-200"
                    } `}
                  ></img>
                  <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord">
                    {metal.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Three Sections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-8">
        {/* Setting Style - take 3 out of 6 columns (half) */}
        {Data?.Style && Data?.Style.length > 0 && (
          <div className="lg:col-span-3 w-fit">
            <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord mb-4">
              SETTING STYLE ?
            </h3>
            <div className="flex max-sm:w-[90vw] max-sm:overflow-x-auto">
              {Data?.Style?.map((profile) => (
                <div
                  key={profile._id}
                  onClick={() => handleStyleSelect(profile.value.toLowerCase())}
                  className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all min-w-[100px] ${
                    selectedSetting === profile.value.toLowerCase()
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-16 h-12 flex items-center justify-center mb-2 border ${
                      selectedSetting === profile.value.toLowerCase()
                        ? "border-gray-400 bg-white"
                        : "border-gray-200"
                    } rounded`}
                  >
                    <img
                      src={profile.image}
                      alt={profile.value}
                      className="w-12 h-8 object-contain brightness-0"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div className="w-12 h-6 bg-gray-300 rounded-sm hidden"></div>
                  </div>
                  <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap font-gintoNord">
                    {profile.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Band Type - take 1.5 out of 6 columns */}
        {Data?.["BAND TYPE"] && Data?.["BAND TYPE"].length > 0 && (
          <div className="lg:col-span-2 w-fit">
            <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord mb-4">
              BAND TYPE ?
            </h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {Data?.["BAND TYPE"]?.map((band) => (
                <div
                  key={band._id}
                  onClick={() => handleBandSelect(band.value.toLowerCase())}
                  className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all min-w-[80px] ${
                    selectedBand === band.value.toLowerCase()
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-16 h-8 flex items-center justify-center mb-2 border ${
                      selectedBand === band.value.toLowerCase()
                        ? "border-gray-400 bg-white"
                        : "border-gray-200"
                    } rounded`}
                  >
                    <img
                      src={band.image}
                      alt={band.value}
                      className="w-12 h-6 object-contain brightness-0"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div className="w-12 h-4 bg-gray-300 rounded-sm hidden"></div>
                  </div>
                  <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap">
                    {band.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setting Profile - take 1.5 out of 6 columns */}
        {Data?.["SETTING"] && Data?.["SETTING"].length > 0 && (
          <div className="lg:col-span-1">
            <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord mb-4">
              SETTING PROFILE ?
            </h3>
            <div className="flex gap-4">
              {Data?.["SETTING"]?.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() =>
                    handleProfileSelect(profile.value.toLowerCase())
                  }
                  className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all min-w-[100px] ${
                    selectedProfile === profile.value.toLowerCase()
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-16 h-12 flex items-center justify-center mb-2 border ${
                      selectedProfile === profile.value.toLowerCase()
                        ? "border-gray-400 bg-white"
                        : "border-gray-200"
                    } rounded`}
                  >
                    <img
                      src={profile.image}
                      alt={profile.value}
                      className="w-12 h-8 object-contain brightness-0"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div className="w-12 h-6 bg-gray-300 rounded-sm hidden"></div>
                  </div>
                  <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap font-gintoNord">
                    {profile.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex w-1/2 h-10 mx-auto justify-center items-center text-gray-600 text-xs font-gintoNord">
        <div
          onClick={() => handleGenderSelect("woman")}
          className={`${
            selectedGender === "woman"
              ? "bg-[#236339] text-white"
              : "text-[#236339] "
          } w-full cursor-pointer h-full flex justify-center items-center border-2 font-semibold text-medium uppercase border-[#236339]`}
        >
          Woman
        </div>
        <div
          onClick={() => handleGenderSelect("man")}
          className={`${
            selectedGender === "man"
              ? "bg-[#236339] text-white"
              : "text-[#236339] "
          } w-full cursor-pointer h-full flex justify-center items-center border-2 font-semibold text-medium uppercase border-l-0 border-[#236339]`}
        >
          Man
        </div>
      </div>
    </div>
  );
};

export default JewelryFilter;
