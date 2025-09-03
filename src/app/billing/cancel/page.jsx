"use client";
import { CircleX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { useDispatch } from "react-redux";

function CancelPageContent() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [sessionDetails, setSessionDetails] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSession = async () => {
      if (!session_id) return;

      const res = await fetch(`/api/stripe/session?session_id=${session_id}`);
      const data = await res.json();
      setSessionDetails(data);
      console.log("Session Details:", data);
    };

    if (!session_id) {
      console.error("No session_id found in URL");
      return;
    }

    fetchSession();
  }, [session_id]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#fefaf5] h-[52vh] flex justify-center items-center text-black rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in fade-in duration-300">
        {sessionDetails ? (
          <div className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <CircleX className="text-red-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Failed!</h2>
            <p className="mb-6">
              Your payment could not be processed. Please try again or contact
              support if the issue persists.
            </p>
            <div className="space-y-3 mt-4">
              <button
                onClick={() => {
                  window.location.href = "/my-orders";
                }}
                className="w-full bg-black text-white py-3 rounded-lg font-medium transition-all duration-300"
              >
                Back To Home
              </button>
              <button
                onClick={() => {
                  window.location.href = "/products";
                }}
                className="w-full border border-black/20 text-black/50 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="loader"></div>
        )}
      </div>
    </div>
  );
}

function Page() {
  return (
    <Suspense fallback={<div className="loader" />}>
      <CancelPageContent />
    </Suspense>
  );
}

export default Page;
