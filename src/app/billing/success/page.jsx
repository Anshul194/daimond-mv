"use client";

import { fetchCart } from "@/store/slices/cart";
import { checkout } from "@/store/slices/checkout";
import { Check, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { useDispatch } from "react-redux";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [sessionDetails, setSessionDetails] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSession = async () => {
      console.log("Fetching session details for session_id:", session_id);
      if (!session_id) return;

      const res = await fetch(`/api/stripe/session?session_id=${session_id}`);
      const data = await res.json();
      setSessionDetails(data);
      console.log("Session Details:", data);

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const invoiceNumber = `${yyyy}${mm}${dd}${randomSuffix}`;

      const cartData = data.orderData.cartItems;

      if (!cartData || cartData.length === 0) {
        console.error("Cart data is empty or not found in metadata");
        return;
      }

      const orderDetails = {
        payment_track: data.session?.payment_intent,
        transaction_id: data.session.id,
        type: "web",
        user_id: "685d0d7e5646c7440625c5a6",
        shipping_cost: {
          admin: { cost: 50 },
          vendor: [{ vendor_id: "64db8f3a1a823c1e22e2a6e2", cost: 30 }],
        },
        country_id: data.orderData?.customerDetails?.country,
        state_id: data.orderData?.customerDetails?.state,
        city: data.orderData?.customerDetails?.city,
        address: data.orderData?.customerDetails?.address,
        zipcode: data.orderData?.customerDetails?.zipcode,
        name: data.orderData?.customerDetails?.name,
        email: data.orderData?.customerDetails?.email,
        phone: data.orderData?.customerDetails?.phone,
        payment_gateway: "stripe",
        invoice_number: invoiceNumber,
        orderSessionId: data.orderData._id,
        cart: cartData.map((item) => ({
          id: item.pid_id,
          qty: item.quantity,
          price: item.pid_price,
          diamond_id: item.selectedDiamond,
          options: {
            variant_id: "64db8f3a1a823c1e22e2a777",
            type: "product",
            regular_price: item.amount_total,
            tax_options_sum_rate: 10,
            vendor_id: "64db8f3a1a823c1e22e2a6e2",
          },
        })),
      };

      if (data?.metadata?.tax_id && data?.metadata?.tax_id !== "N/A") {
        orderDetails.tax_id = data.orderData?.tax_id;
      }

      if (data?.metadata?.couponCode && data?.metadata?.couponCode !== "N/A") {
        orderDetails.coupon = data.orderData?.couponCode;
      }

      dispatch(checkout(orderDetails));
      // localStorage.removeItem("cart");
      dispatch(fetchCart());
    };

    if (!session_id) {
      console.error("No session_id found in URL");
      return;
    }

    fetchSession();
  }, [session_id]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#fefaf5] min-h-[74vh] h-fit flex justify-center items-center text-black rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in fade-in duration-300">
        {sessionDetails ? (
          <div className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="text-emerald-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="mb-6">
              Your enrollment has been confirmed. Welcome to your new learning
              journey!
            </p>
            <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-emerald-400 font-semibold mb-3 flex items-center">
                <Check className="mr-2" size={16} />
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment ID:</span>
                  <span className="text-[10px]">
                    {sessionDetails?.session?.payment_intent || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>
                    {sessionDetails?.orderData?.cartItems?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Paid:</span>
                  <span className="text-emerald-400 font-semibold">
                    ₹{(sessionDetails?.session?.amount_total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
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
                  window.location.href = "/";
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
      <SuccessPageContent />
    </Suspense>
  );
}

export default Page;
