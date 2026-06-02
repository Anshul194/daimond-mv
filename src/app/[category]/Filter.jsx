"use client";

import React, { use, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getImageUrl } from "@/utils/image";

const JewelryFilter = ({ Data }) => {
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedSetting, setSelectedSetting] = useState("");
  const [selectedBand, setSelectedBand] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedAccents, setSelectedAccents] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [twoTone, setTwoTone] = useState(false);
  const [shapeStartIndex, setShapeStartIndex] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  // Responsive filter controls
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowFilters(window.innerWidth >= 768);
      const handleResize = () => setShowFilters(window.innerWidth >= 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const clearAllFilters = () => {
    setSelectedShape("");
    setSelectedMetal("");
    setSelectedSetting("");
    setSelectedBand("");
    setSelectedProfile("");
    setSelectedAccents("");
    setSelectedGender("");
    const params = new URLSearchParams(searchParams.toString());
    ["shape", "metal", "style", "band", "profile", "accents", "gender"].forEach((k) => params.delete(k));
    router.push(`?${params.toString()}`);
  };

  const resolveAttributeImage = (image) => {
    if (!image || image === "null" || image === "undefined") return undefined;
    return getImageUrl(image);
  };

  const visibleShapes = Data?.Shape?.slice(
    shapeStartIndex,
    shapeStartIndex + 8
  );
  const canScrollLeft = shapeStartIndex > 0;
  const canScrollRight = shapeStartIndex + 8 < Data?.Shape?.length;
  const totalShapes = Data?.Shape?.length || 0;
  const shapesPerPage = 8;
  const scrollShapes = (direction) => {
    if (direction === "left" && canScrollLeft) {
      setShapeStartIndex(Math.max(0, shapeStartIndex - (shapesPerPage - 1)));
    } else if (direction === "right" && canScrollRight) {
      setShapeStartIndex(Math.min(shapeStartIndex + (shapesPerPage - 1), Math.max(0, totalShapes - shapesPerPage)));
    }
  };

  // Calculate progress percentage properly across all shapes
  const totalPages = Math.max(1, Math.ceil(totalShapes / shapesPerPage));
  const currentPage = Math.min(totalPages, Math.floor(shapeStartIndex / shapesPerPage) + 1);
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

  const handleAccentsSelect = (id) => {
    if (id === selectedAccents) {
      setSelectedAccents("");
      updateQuery("accents", "");
    } else {
      setSelectedAccents(id);
      updateQuery("accents", id);
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
    const accentsFilter = searchParams.get("accents")?.toLowerCase();
    const gender = searchParams.get("gender")?.toLowerCase();

    if (shape) setSelectedShape(shape);
    if (metal) setSelectedMetal(metal);
    if (profile) setSelectedProfile(profile);
    if (style) setSelectedSetting(style);
    if (band) setSelectedBand(band);
    if (accentsFilter) setSelectedAccents(accentsFilter);
    if (gender) setSelectedGender(gender);
  }, [Data]);

  if (pathName.toLowerCase().includes("wedding")) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden inline-flex items-center gap-2 px-3 py-2 border rounded text-sm"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              {showFilters ? "Hide filters" : "Show filters"}
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 border rounded text-sm"
              onClick={clearAllFilters}
            >
              Clear
            </button>
          </div>
        </div>
        <div className={`${showFilters ? "block" : "hidden md:block"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {Data?.["SETTING STYLE"] && Data?.["SETTING STYLE"].length > 0 && (
              <div className="">
                <h3 className="text-xs font-medium text-gray-600 tracking-wide font-gintoNord mb-4">
                  SETTING ?
                </h3>
                <div className="flex w-full overflow-x-scroll">
                  {Data?.["SETTING STYLE"]?.map((profile, index) => (
                    <div
                      key={profile._id || profile.id || `style-${index}`}
                      onClick={() =>
                        handleStyleSelect(profile.value.toLowerCase())
                      }
                      className={`flex flex-col items-center cursor-pointer rounded-lg transition-all min-w-[100px] ${selectedSetting === profile.value.toLowerCase()
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <div
                        className={`w-16 h-12 flex items-center justify-center mb-2 border ${selectedSetting === profile.value.toLowerCase()
                          ? "border-gray-400 bg-white"
                          : "border-gray-200"
                          } rounded`}
                      >
                        <img
                          src={resolveAttributeImage(profile.image)}
                          alt={profile.value}
                          className={`w-12 h-8 object-contain ${profile.image?.toLowerCase().endsWith('.svg') ? 'brightness-0' : ''}`}
                          loading="lazy"
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
                  {Data?.["METAL TYPE"]?.map((metal, index) => (
                    <div
                      key={metal._id || metal.id || `metal-${index}`}
                      onClick={() => handleMetalSelect(metal.value.toLowerCase())}
                      className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${selectedMetal === metal.value.toLowerCase()
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <img
                        src={resolveAttributeImage(metal.image)}
                        className={`w-10 h-10 rounded-full mb-2 border-2 ${selectedMetal === metal.value.toLowerCase()
                          ? "border-gray-400"
                          : "border-gray-200"
                          } `}
                        loading="lazy"
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

          <div className="flex flex-col md:flex-row md:w-1/2 w-full mx-auto h-auto md:h-10 justify-center items-center text-gray-600 text-xs font-gintoNord gap-2">
            <button
              onClick={() => handleGenderSelect("woman")}
              aria-pressed={selectedGender === "woman"}
              className={`${selectedGender === "woman"
                ? "bg-[#004643] text-white"
                : "text-[#004643] "
                } w-full cursor-pointer h-10 md:h-full flex justify-center items-center border-2 font-semibold text-medium uppercase border-[#004643] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#004643]`}
            >
              Woman
            </button>
            <button
              onClick={() => handleGenderSelect("man")}
              aria-pressed={selectedGender === "man"}
              className={`${selectedGender === "man"
                ? "bg-[#004643] text-white"
                : "text-[#004643] "
                } w-full cursor-pointer h-10 md:h-full flex justify-center items-center border-2 font-semibold text-medium uppercase border-l-0 border-[#004643] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#004643]`}
            >
              Man
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 border rounded text-sm"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
          >
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
          <button
            className="inline-flex items-center gap-2 px-3 py-2 border rounded text-sm"
            onClick={clearAllFilters}
          >
            Clear
          </button>
        </div>
      </div>
      <div className={`${showFilters ? "block" : "hidden md:block"}`}>
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
                  className={`p-2 rounded-full ${canScrollLeft
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-gray-50 cursor-not-allowed"
                    }`}
                >
                  <ChevronLeft
                    className={`w-4 h-4 ${canScrollLeft ? "text-gray-600" : "text-gray-300"
                      }`}
                  />
                </button>

                <div className="flex gap-4 flex-1 overflow-x-auto py-2 scrollbar-hide">
                  {visibleShapes?.map((shape, index) => (
                    <button
                      key={shape._id || shape.id || `shape-${index}`}
                      onClick={() => handleShapeSelect(shape.value.toLowerCase())}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedShape === shape.value.toLowerCase()}
                      className={`flex flex-col items-center cursor-pointer rounded-lg transition-all min-w-[72px] p-2 ${selectedShape === shape.value.toLowerCase()
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <div
                        className={`w-14 h-14 flex items-center justify-center mb-2 rounded ${selectedShape === shape.value.toLowerCase()
                          ? "border-gray-400 bg-gray-100"
                          : "border border-gray-200 bg-white"
                          }`}
                      >
                        {shape.image ? (
                          <img
                            src={resolveAttributeImage(shape.image)}
                            alt={shape.value}
                            className={`w-8 h-8 object-contain ${shape.image?.toLowerCase().endsWith('.svg') ? 'brightness-0' : ''}`}
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-sm text-gray-400">◈</span>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord truncate w-20">
                        {shape.value}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => scrollShapes("right")}
                  disabled={!canScrollRight}
                  className={`p-2 rounded-full ${canScrollRight
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-gray-50 cursor-not-allowed"
                    }`}
                >
                  <ChevronRight
                    className={`w-4 h-4 ${canScrollRight ? "text-gray-600" : "text-gray-300"
                      }`}
                  />
                </button>
              </div>

              {/* Progress indicator - contained within the box */}
              <div className="mt-4">
                <div className="w-full md:w-1/2 bg-gray-200 rounded-full h-1 mx-auto">
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
                {Data?.["METAL TYPE"]?.map((metal, index) => (
                  <div
                    key={metal._id || metal.id || `metal-${index}`}
                    onClick={() => handleMetalSelect(metal.value.toLowerCase())}
                    className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${selectedMetal === metal.value.toLowerCase()
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <img
                      src={resolveAttributeImage(metal.image)}
                      className={`w-10 h-10 rounded-full mb-2 border-2 ${selectedMetal === metal.value.toLowerCase()
                        ? "border-gray-400"
                        : "border-gray-200"
                        } `}
                      loading="lazy"
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
          {Data?.["SETTING STYLE"] && Data?.["SETTING STYLE"].length > 0 && (
            <div className="lg:col-span-3">
              <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord mb-4">
                SETTING STYLE ?
              </h3>
              <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                {Data?.["SETTING STYLE"]?.map((profile, index) => (
                  <button
                    key={profile._id || profile.id || `style-${index}`}
                    onClick={() => handleStyleSelect(profile.value.toLowerCase())}
                    role="button"
                    aria-pressed={selectedSetting === profile.value.toLowerCase()}
                    className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all min-w-[84px] ${selectedSetting === profile.value.toLowerCase()
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <div
                      className={`w-16 h-12 flex items-center justify-center mb-2 border ${selectedSetting === profile.value.toLowerCase()
                        ? "border-gray-400 bg-white"
                        : "border border-gray-200 bg-white"
                        } rounded`}
                    >
                      {profile.image ? (
                        <img
                          src={resolveAttributeImage(profile.image)}
                          alt={profile.value}
                          className={`w-12 h-8 object-contain ${profile.image?.toLowerCase().endsWith('.svg') ? 'brightness-0' : ''}`}
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-12 h-6 bg-gray-300 rounded-sm" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap truncate w-20">
                      {profile.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Band Type - take 1.5 out of 6 columns */}
          {Data?.["BAND TYPE"] && Data?.["BAND TYPE"].length > 0 && (
            <div className="lg:col-span-2">
              <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord mb-4">
                BAND TYPE ?
              </h3>
              <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                {Data?.["BAND TYPE"]?.map((band, index) => (
                  <button
                    key={band._id || band.id || `band-${index}`}
                    onClick={() => handleBandSelect(band.value.toLowerCase())}
                    role="button"
                    aria-pressed={selectedBand === band.value.toLowerCase()}
                    className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all min-w-[76px] ${selectedBand === band.value.toLowerCase()
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <div
                      className={`w-16 h-8 flex items-center justify-center mb-2 border ${selectedBand === band.value.toLowerCase()
                        ? "border-gray-400 bg-white"
                        : "border border-gray-200 bg-white"
                        } rounded`}
                    >
                      {band.image ? (
                        <img
                          src={resolveAttributeImage(band.image)}
                          alt={band.value}
                          className={`w-12 h-6 object-contain ${band.image?.toLowerCase().endsWith('.svg') ? 'brightness-0' : ''}`}
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-12 h-4 bg-gray-300 rounded-sm" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap truncate w-20">
                      {band.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Setting Profile - take 1 out of 6 columns */}
          {Data?.["SETTING PROFILE"] && Data?.["SETTING PROFILE"].length > 0 && (
            <div className="lg:col-span-1">
              <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord mb-4">
                SETTING PROFILE ?
              </h3>
              <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                {Data?.["SETTING PROFILE"]?.map((profile, index) => (
                  <button
                    key={profile._id || profile.id || `setting-${index}`}
                    onClick={() => handleProfileSelect(profile.value.toLowerCase())}
                    role="button"
                    aria-pressed={selectedProfile === profile.value.toLowerCase()}
                    className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all min-w-[76px] ${selectedProfile === profile.value.toLowerCase()
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <div
                      className={`w-16 h-12 flex items-center justify-center mb-2 border ${selectedProfile === profile.value.toLowerCase()
                        ? "border-gray-400 bg-white"
                        : "border border-gray-200 bg-white"
                        } rounded`}
                    >
                      {profile.image ? (
                        <img
                          src={resolveAttributeImage(profile.image)}
                          alt={profile.value}
                          className={`w-12 h-8 object-contain ${profile.image?.toLowerCase().endsWith('.svg') ? 'brightness-0' : ''}`}
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-12 h-6 bg-gray-300 rounded-sm" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap truncate w-20">
                      {profile.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Accents - take 1 out of 6 columns */}
          {Data?.["ACCENTS"] && Data?.["ACCENTS"].length > 0 && (
            <div className="lg:col-span-1">
              <h3 className="text-[10px] font-medium text-gray-600 tracking-wide font-gintoNord mb-4">
                ACCENTS ?
              </h3>
              <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                {Data?.["ACCENTS"]?.map((accent, index) => (
                  <button
                    key={accent._id || accent.id || `accent-${index}`}
                    onClick={() => handleAccentsSelect(accent.value.toLowerCase())}
                    role="button"
                    aria-pressed={selectedAccents === accent.value.toLowerCase()}
                    className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all min-w-[76px] ${selectedAccents === accent.value.toLowerCase()
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <div
                      className={`w-16 h-12 flex items-center justify-center mb-2 border ${selectedAccents === accent.value.toLowerCase()
                        ? "border-gray-400 bg-white"
                        : "border border-gray-200 bg-white"
                        } rounded`}
                    >
                      {accent.image ? (
                        <img
                          src={resolveAttributeImage(accent.image)}
                          alt={accent.value}
                          className={`w-12 h-8 object-contain ${accent.image?.toLowerCase().endsWith('.svg') ? 'brightness-0' : ''}`}
                          loading="lazy"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-12 h-6 bg-gray-300 rounded-sm" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-700 text-center font-gintoNord whitespace-nowrap truncate w-20">
                      {accent.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:w-1/2 w-full mx-auto h-auto md:h-10 justify-center items-center text-gray-600 text-xs font-gintoNord gap-2">
          <button
            onClick={() => handleGenderSelect("woman")}
            aria-pressed={selectedGender === "woman"}
            className={`${selectedGender === "woman"
              ? "bg-[#004643] text-white"
              : "text-[#004643] "
              } w-full cursor-pointer h-10 md:h-full flex justify-center items-center border-2 font-semibold text-medium uppercase border-[#004643] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#004643]`}
          >
            Woman
          </button>
          <button
            onClick={() => handleGenderSelect("man")}
            aria-pressed={selectedGender === "man"}
            className={`${selectedGender === "man"
              ? "bg-[#004643] text-white"
              : "text-[#004643] "
              } w-full cursor-pointer h-10 md:h-full flex justify-center items-center border-2 font-semibold text-medium uppercase border-l-0 border-[#004643] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#004643]`}
          >
            Man
          </button>
        </div>
      </div>
    </div>
  );
};

export default JewelryFilter;
