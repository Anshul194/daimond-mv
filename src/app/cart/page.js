"use client";

import React, { useEffect, useState } from "react";
import { Info, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeItemFromCart } from "@/store/slices/cart";
import Link from "next/link";
import Image from "next/image";

const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

const Cart = () => {
  const [orderNote, setOrderNote] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, []);

  const handelRemove = (id) => {
    dispatch(removeItemFromCart(id));
    dispatch(fetchCart());
  };

  const subtotal = data.reduce((sum, item) => {
    return (
      sum +
      item.pid_price +
      (item.selectedDiamond ? item.selectedDiamond.net : 0)
    );
  }, 0);
  const estimatedDate = "AUGUST 13, 2025";

  if (!data || data.length === 0) {
    return (
      <div className="max-w-7xl h-[80vh] flex flex-col justify-center items-center mx-auto p-4 lg:p-6 ">
        <Image
          src="/images/abandoned-cart.png"
          alt="Abandoned Cart"
          width={200}
          height={200}
          className="mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 ">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2">
          Add some products to your cart to get started.
        </p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          Go to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 bg-white">
      <h1 className="text-2xl md:text-3xl lg:text-5xl mb-8 lg:mb-20 text-gray-800 font-arizona text-center">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 max-sm:grid-cols-1 gap-4 lg:gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          {data.map((item, index) => {
            // Create a unique key combining pid_id with selected options and diamond
            const uniqueKey = `${item.pid_id}-${item.selectedOptions?.metalType?.color?._id || item.selectedOptions?.metalType || 'no-metal'}-${item.selectedOptions?.ringSize?.size?._id || item.selectedOptions?.ringSize || 'no-size'}-${item.selectedDiamond?._id || 'no-diamond'}-${index}`;
            return (
            <div
              key={uniqueKey}
              className="mb-6 lg:mb-8 pb-6 border-b border-gray-200 last:border-b-0"
            >
              {/* Mobile Layout */}
              <div className="block  md:hidden">
                {/* Product Image - Centered */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center text-3xl">
                    <img src={item.pid_image} className="object-cover" />
                  </div>
                </div>

                {/* Product Name - Centered */}
                <h2 className="text-base font-medium text-gray-800 mb-3 tracking-wide font-gintoNord text-start leading-tight">
                  {item.pid_name}
                </h2>

                {/* Product Details - Compact */}
                <div className="space-y-1 mb-4 text-start">
                  <div className="flex items-center mb-1">
                    <span className="text-gray-600 font-semibold text-[10px]">
                      metal type:
                    </span>
                    <span className="ml-1 text-gray-800 text-[10px]">
                      {item.selectedOptions.metalType.color.value}
                    </span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="text-gray-600 font-semibold text-[10px]">
                      Size
                    </span>
                    <span className="ml-1 text-gray-800 text-[10px]">
                      {item.selectedOptions.ringSize.size_code}
                    </span>
                  </div>
                </div>

                {/* Price and Actions Row */}
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium text-gray-800">
                    {item.pid_price.toFixed(2)} USD
                  </div>
                  <div className="flex gap-4">
                    <button className="text-gray-600 hover:underline hover:decoration-green-500 hover:decoration-2 text-[10px]">
                      Edit
                    </button>
                    <button className="text-gray-600 hover:underline hover:decoration-green-500 hover:decoration-2 text-[10px]">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden border-b border-gray-200 pb-2 md:block">
                <div className="flex items-start gap-4">
                  {/* Product Image */}

                  <div className="w-full flex flex-col gap-4 ">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100  flex items-center justify-center text-2xl flex-shrink-0">
                        <img src={item.pid_image} className="object-cover" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="grid grid-cols-1 text-sm mb-1">
                          <h2 className="text-lg font-medium text-gray-800  tracking-wide font-gintoNord">
                            {item.pid_name}
                          </h2>
                          <div className="flex items-center mb-1">
                            <span className="text-gray-600 font-semibold text-[10px]">
                              metal type:
                            </span>
                            <span className="ml-1 text-gray-800 text-[10px]">
                              {item?.selectedOptions?.metalType?.color?.value}
                            </span>
                          </div>
                          <div className="flex items-center mb-1">
                            <span className="text-gray-600 font-semibold text-[10px]">
                              Size
                            </span>
                            <span className="ml-1 text-gray-800 text-[10px]">
                              {item?.selectedOptions?.ringSize?.size_code}
                            </span>
                          </div>
                        </div>

                        <div className="text-lg font-medium text-gray-800">
                          {currencySymbol}
                          {item.pid_price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {item?.selectedDiamond && (
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-gray-100  flex items-center justify-center text-2xl flex-shrink-0">
                          <iframe
                            src={item.selectedDiamond.video}
                            title={`Video for ${item.selectedDiamond._id}`}
                            className="w-full h-full aspect-square overflow-hidden"
                            allowFullScreen
                          ></iframe>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="grid grid-cols-1 text-sm mb-1">
                            <div className="text-lg  font-medium text-gray-800 ">
                              {item?.selectedDiamond?.weight.toFixed(2)}w -{" "}
                              {item?.selectedDiamond?.color} -{" "}
                              {item?.selectedDiamond?.clarity} -{" "}
                              {item?.selectedDiamond?.shape}
                            </div>
                            <div className="flex items-center mb-1">
                              <span className="text-gray-600 font-semibold text-[10px]">
                                SKU
                              </span>
                              <span className="ml-1 text-gray-800 text-[10px]">
                                {item?.selectedDiamond?.certino}
                              </span>
                            </div>
                          </div>

                          <div className="text-lg font-medium text-gray-800">
                            {currencySymbol}
                            {item.selectedDiamond.net.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* <button className="text-gray-600 hover:text-gray-800 hover:decoration-green-500 hover:decoration-2 text-sm underline">
                      Edit
                    </button> */}
                    <button
                      onClick={() => handelRemove(item)}
                      className="text-gray-600 hover:text-gray-800 hover:decoration-green-500 hover:decoration-2 text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Checkout Section */}
        <div className="lg:col-span-1 bg-[#FEFAF5] p-4 lg:p-6 rounded-lg shadow-sm">
          <div className="lg:sticky lg:top-6">
            {/* Order Note */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order note <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="w-full p-3 border border-gray-700 placeholder:text-gray-500 rounded-md text-sm resize-none h-20 lg:h-24"
                placeholder="Add special instructions..."
              />
            </div>

            {/* Estimated Completion Date */}
            <div className="mb-6 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">📅</span>
                </div>
                <span className="text-[10px] font-semibold text-gray-700 tracking-wide">
                  ESTIMATED COMPLETION DATE:
                </span>
                <span className="text-[10px] font-medium text-gray-800">
                  {estimatedDate}
                </span>
                <Info className="w-3 h-3 text-gray-400 flex-shrink-0" />
              </div>
              <p className="text-[10px] text-gray-600 italic">
                The above date does not include shipping.
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 flex-shrink-0"
                />
                <span className="text-[10px] text-gray-700 leading-relaxed">
                  I agree to the order{" "}
                  <a href="#" className="text-gray-800 underline">
                    Terms of Sale
                  </a>
                  ,{" "}
                  <a href="#" className="text-gray-800 underline">
                    Returns Policy
                  </a>{" "}
                  &{" "}
                  <a href="#" className="text-gray-800 underline">
                    Shipping Terms
                  </a>
                  .
                </span>
              </label>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout" disabled={!agreedToTerms}>
              <button
                disabled={!agreedToTerms}
                className={`w-full py-3 lg:py-4 rounded-md font-medium text-sm tracking-wide transition-colors mb-4 ${
                  agreedToTerms
                    ? "bg-green-100 text-gray-800 hover:bg-green-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                🔒 CHECKOUT | {currencySymbol}
                {subtotal.toFixed(2)}
              </button>
            </Link>

            {/* Tax Notice */}
            <p className="text-[10px] text-gray-500 italic text-center mb-6">
              THE ABOVE PRICE IS INCLUSIVE OF DUTIES AND TAXES.
              <Info className="w-3 h-3 inline ml-1" />
            </p>

            {/* Features */}
            <div className="flex justify-center gap-4 lg:gap-8 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Discreet Packaging
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Insured Shipping</span>
              </div>
            </div>

            {/* Security Notice */}
            <p className="text-[10px] text-gray-600 text-center mb-4">
              All payments are 256-bit SSL secure and encrypted.
            </p>

            {/* Payment Methods */}
            <div className="flex justify-center flex-wrap gap-2">
              <div className="w-10 h-6 bg-blue-600 rounded text-white text-[10px] flex items-center justify-center font-bold">
                AMEX
              </div>
              <div className="w-10 h-6 bg-black rounded text-white text-[10px] flex items-center justify-center">
                🍎
              </div>
              <div className="w-10 h-6 bg-green-100 rounded border text-[10px] flex items-center justify-center">
                💳
              </div>
              <div className="w-10 h-6 bg-white rounded border text-[10px] flex items-center justify-center">
                G
              </div>
              <div className="w-10 h-6 bg-orange-500 rounded text-white text-[10px] flex items-center justify-center">
                K
              </div>
              <div className="w-10 h-6 bg-red-500 rounded text-white text-[10px] flex items-center justify-center">
                ●●
              </div>
              <div className="w-10 h-6 bg-blue-800 rounded text-white text-[10px] flex items-center justify-center">
                PP
              </div>
              <div className="w-10 h-6 bg-purple-600 rounded text-white text-[10px] flex items-center justify-center">
                S
              </div>
              <div className="w-10 h-6 bg-blue-700 rounded text-white text-[10px] flex items-center justify-center">
                V
              </div>
              <div className="w-10 h-6 bg-black rounded text-white text-[10px] flex items-center justify-center">
                Z
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
