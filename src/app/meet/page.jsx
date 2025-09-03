"use client";
import { X } from "lucide-react";
import React from "react";
import { InlineWidget } from "react-calendly";

function Page() {
  function handleClick() {
    window.history.back();
  }
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-99 flex justify-center items-center h-screen bg-black/20">
        <InlineWidget
          className="h-full w-full"
          url="https://calendly.com/dhrumit6789/30min"
          pageSettings={{
            backgroundColor: "fefaf5",
            hideEventTypeDetails: false,
            primaryColor: "236339",
            textColor: "000000",
          }}
        />

        <div className="absolute top-4 right-4 z-50 bg-black/90 backdrop-blur-sm p-2 rounded-full cursor-pointer">
          <X onClick={handleClick} />
        </div>
      </div>
    </>
  );
}

export default Page;
