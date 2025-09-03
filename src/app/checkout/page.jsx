"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingBag,
  CreditCard,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Tag,
  ArrowLeft,
  Plus,
  X,
  Check,
} from "lucide-react";
import { fetchCart } from "@/store/slices/cart";
import { checkout } from "@/store/slices/checkout";
import {
  fetchStates,
  fetchCities,
  clearCities,
} from "../../store/slices/region"; // Import region actions
import { toast } from "react-toastify";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import axiosInstance from "@/axiosConfig/axiosInstance";
// import { applyCoupon, resetCoupon } from "../store/slices/coupon";
// import { checkout } from "../store/slices/checkout";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
// Success Popup Component
const PaymentSuccessPopup = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#fefaf5] text-black rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in fade-in duration-300">
        <div className="text-center">
          <div className="mx-auto mb-6 w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="text-emerald-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold  mb-2">Payment Successful!</h2>
          <p className=" mb-6">
            Your enrollment has been confirmed. Welcome to your new learning
            journey!
          </p>
          <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-emerald-400 font-semibold mb-3 flex items-center">
              <Check className="mr-2" size={16} />
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              {/* <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="text-[10px]">
                  {orderDetails?.orderId || "N/A"}
                </span>
              </div> */}
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="text-[10px]">
                  {orderDetails?.paymentId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{orderDetails?.courseCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid:</span>
                <span className="text-emerald-400 font-semibold">
                  ₹{orderDetails?.totalAmount || 0}
                </span>
              </div>
              {orderDetails?.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Savings:</span>
                  <span>₹{orderDetails.couponDiscount}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                window.location.href = "/my-orders";
              }}
              className="w-full bg-black text-white py-3 rounded-lg font-medium  transition-all duration-300"
            >
              Back To Home
            </button>
            <button
              onClick={onClose}
              className="w-full border border-black/20 text-black/50 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const {
    data: cartItems,
    loading,
    error,
  } = useSelector((state) => state.cart);
  const {
    states,
    cities,
    loadingStates,
    loadingCities,
    errorStates,
    errorCities,
  } = useSelector((state) => state.region); // Access region state
  const couponState = useSelector((state) => state.coupon);
  const checkoutState = useSelector((state) => state.checkout);

  useEffect(() => {
    dispatch(fetchCart()); // Fetch cart items on mount
  }, []);

  // Local state
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [addCoupon, setAddCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [errorCoupon, setErrorCoupon] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [taxData, setTaxData] = useState(null);
  const [ApplicableTaxId, setApplicableTaxId] = useState(null);
  const [ApplicableTax, setApplicableTax] = useState(0);
  const [Details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
  });

  // Fetch states when country is selected
  useEffect(() => {
    if (Details.country) {
      dispatch(fetchStates(Details.country));
      dispatch(clearCities()); // Clear cities when country changes
      setDetails((prev) => ({ ...prev, state: "", city: "" })); // Reset state and city
    }
  }, [Details.country, dispatch]);

  // Fetch cities when state is selected
  useEffect(() => {
    if (Details.state) {
      dispatch(fetchCities(Details.state));
      setDetails((prev) => ({ ...prev, city: "" })); // Reset city
    }
  }, [Details.state, dispatch]);

  useEffect(() => {
    const getTax = async () => {
      try {
        const response = await axiosInstance.get("/api/ActiveTax");
        console.log("Tax data response: ===>", response.data);
        setTaxData(response.data.data.options);
      } catch (error) {
        console.error("Error fetching tax data:", error);
        toast.error("Failed to fetch tax data.");
      }
    };
    getTax();
  }, []);

  const handelInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const originalTotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.pid_price || 0) + (item?.selectedDiamond?.net || 0),
    0
  );

  const validateCoupon = async (code) => {
    try {
      setLoadingCoupon(true);
      const res = await axiosInstance.post("/api/coupon/validate", {
        code: couponInput,
        orderTotal: originalTotal,
        userEmail: Details.email,
      });

      const data = await res.data;
      console.log("Coupon validation response:", data);
      if (data.valid) {
        setCouponApplied(true);
        // toast.success("Coupon applied successfully!");
        setErrorCoupon("");

        const res2 = await axiosInstance.post("/api/order/apply-coupon", {
          code: couponInput,
          orderTotal: originalTotal,
        });

        console.log("Coupon data response: Apply", res2.data);
        setCouponData(res2.data);
      } else {
        // toast.error("Invalid coupon code.");
        setCouponApplied(false);
        setErrorCoupon(data.message || "Invalid coupon code.");
      }
    } catch (error) {
      console.log(error);
      // toast.error("An error occurred while validating the coupon.");
    } finally {
      setLoadingCoupon(false);
    }
  };

  useEffect(() => {
    if (couponInput.trim() !== "") {
      setErrorCoupon("");
      return setCouponApplied(false);
    }

    if (couponApplied && couponData.code !== couponInput.trim()) {
      setCouponApplied(false);
      setCouponData(null);
    }
  }, [couponInput]);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );

  const handlePayment = async () => {
    if (Details.name === "" || Details.email === "" || Details.phone === "") {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (
      Details.country === "" ||
      Details.state === "" ||
      Details.city === "" ||
      Details.zipcode === ""
    ) {
      toast.error(
        "Please select your country, state, city and enter your zipcode."
      );
      return;
    }

    setProcessingPayment(true);

    try {
      const stripe = await stripePromise;

      const newCartItems = cartItems.map((item) => ({
        pid_id: item.pid_id,
        pid_name: item.pid_name,
        pid_image: item.pid_image,
        pid_price: item.pid_price,
        quantity: item.quantity,
        selectedOptions: {
          ringSize: item.selectedOptions.ringSize._id,
          metalType: item.selectedOptions.metalType._id,
        },
        selectedDiamond: item?.selectedDiamond?._id,
      }));

      console.log("calling stripe checkout with items:", newCartItems);
      console.log("Coupon data:", couponData?.discount);
      console.log(
        "tax value: ",
        couponData?.discount
          ? ((originalTotal - couponData?.discount || 0) * ApplicableTax) / 100
          : (originalTotal * ApplicableTax) / 100
      );

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: newCartItems,

          tax: couponData?.discount
            ? ((originalTotal - couponData?.discount || 0) * ApplicableTax) /
              100
            : (originalTotal * ApplicableTax) / 100,
          tax_id: ApplicableTaxId,
          totalAmount: originalTotal - (couponData?.discount || 0),
          couponCode: couponApplied ? couponData.coupon.code : null,
          couponDiscount: couponApplied ? couponData.discount : 0,
          customerDetails: {
            name: Details.name,
            email: Details.email,
            phone: Details.phone,
            address: Details.address,
            country: Details.country,
            state: Details.state,
            city: Details.city,
            zipcode: Details.zipcode,
          },
        }),
      });

      const data = await res.json();

      if (data.id) {
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        throw new Error(data.error || "Stripe session creation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  useEffect(() => {
    if (Details.zipcode) {
      const tax = taxData.find((item) => item.postal_code === Details.zipcode);
      setApplicableTax(tax ? tax.rate : 0);
      setApplicableTaxId(tax ? tax._id : null);
    }
  }, [Details.zipcode]);

  const calculateTotalWithTax = (total, discount = 0) => {
    const discountedTotal = total - discount;
    console.log("Discounted Total:", discountedTotal);
    console.log("Applicable Tax:", ApplicableTax);
    console.log(
      "Total with Tax:",
      discountedTotal + (discountedTotal * ApplicableTax) / 100
    );
    return (discountedTotal + (discountedTotal * ApplicableTax) / 100).toFixed(
      2
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#fefaf5] pt-6">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-black mb-8 text-center">
            Checkout
          </h1>

          <div className="bg-white/10 flex max-sm:flex-col gap-10 backdrop-blur-xl border border-black rounded-lg p-6">
            <div className="w-full flex flex-col gap-4 md:w-1/2 text-black">
              <h2 className="text-xl font-semibold text-black placeholder:text-black mb-6 flex items-center">
                <ShoppingBag className="mr-2 text-black" size={24} />
                Order Details
              </h2>
              <div className="flex flex-col gap-1 justify-between">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-black"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={Details.name}
                  onChange={(e) => handelInputChange(e)}
                  className="border border-black rounded-md p-2"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex flex-col gap-1 justify-between">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-black"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={Details.email}
                  onChange={handelInputChange}
                  className="border border-black rounded-md p-2"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col gap-1 justify-between">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-black"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={Details.phone}
                  onChange={handelInputChange}
                  className="border border-black rounded-md p-2"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="flex flex-col gap-1 justify-between">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-black"
                >
                  Address
                </label>
                <textarea
                  rows="2"
                  type="text"
                  id="address"
                  name="address"
                  value={Details.address}
                  onChange={handelInputChange}
                  className="border border-black rounded-md p-2"
                  placeholder="Enter your address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 justify-between">
                  <label
                    htmlFor="country"
                    className="text-sm font-medium text-black"
                  >
                    Country
                  </label>
                  <select
                    type="text"
                    id="country"
                    name="country"
                    value={Details.country}
                    onChange={handelInputChange}
                    className="border border-black rounded-md p-2"
                    placeholder="Enter your country"
                  >
                    <option value="">Select your country</option>
                    <option value="685cebaca3b0966edc86a2fd">India</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 justify-between">
                  <label
                    htmlFor="state"
                    className="text-sm font-medium text-black"
                  >
                    State
                  </label>
                  <select
                    type="text"
                    id="state"
                    name="state"
                    value={Details.state}
                    onChange={handelInputChange}
                    className="border border-black rounded-md p-2"
                    disabled={loadingStates || !Details.country}
                  >
                    <option value="">Select your state</option>
                    {loadingStates ? (
                      <option value="">Loading...</option>
                    ) : errorStates ? (
                      <option value="">Error loading states</option>
                    ) : (
                      states.map((state, index) => (
                        <option key={index} value={state._id}>
                          {state.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="flex flex-col gap-1 justify-between">
                  <label
                    htmlFor="city"
                    className="text-sm font-medium text-black"
                  >
                    City
                  </label>
                  <select
                    type="text"
                    id="city"
                    name="city"
                    value={Details.city}
                    onChange={handelInputChange}
                    className="border border-black rounded-md p-2"
                    disabled={loadingCities || !Details.state}
                  >
                    <option value="">Select your city</option>
                    {loadingCities ? (
                      <option value="">Loading...</option>
                    ) : errorCities ? (
                      <option value="">Error loading cities</option>
                    ) : (
                      cities.map((city, index) => (
                        <option key={index} value={city._id}>
                          {city.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="flex flex-col gap-1 justify-between">
                  <label
                    htmlFor="zipcode"
                    className="text-sm font-medium text-black"
                  >
                    Zipcode
                  </label>
                  <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    value={Details.zipcode}
                    onChange={handelInputChange}
                    className="border border-black rounded-md p-2"
                    placeholder="Enter your zipcode"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between mb-6 w-1/2 max-sm:w-full">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div className="backdrop-blur-xl bg-white/10 border border-black rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-black mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {cartItems.map((item, index) => (
                        <div className="border-black last:border-b-0">
                          <div
                            key={index}
                            className="flex items-center space-x-4 pb-4 last:pb-0"
                          >
                            <img
                              src={item.pid_image}
                              alt={item.title}
                              className="w-16 h-20 object-cover rounded-md flex-shrink-0"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/300/200";
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="text-black mb-1 font-medium text-base line-clamp-1">
                                {item.pid_name}
                              </h3>
                              <div>
                                <div className="text-[10px] text-black/80 flex gap-2">
                                  <span>Metal:</span>
                                  <span>
                                    {
                                      item?.selectedOptions?.metalType?.color
                                        ?.value
                                    }
                                  </span>
                                </div>
                                <div className="text-[10px] text-black/80 flex gap-2">
                                  <span>Size : </span>
                                  <span>
                                    {item?.selectedOptions?.ringSize?.size_code}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-black font-semibold text-sm">
                                {currencySymbol}
                                {item.pid_price.toFixed(2)} X {item.quantity}
                              </div>
                            </div>
                          </div>
                          {item.selectedDiamond && (
                            <div
                              key={index}
                              className="flex items-center space-x-4 pb-4 border-b  last:pb-0"
                            >
                              <div className="w-16 h-20 bg-gray-100  flex items-center justify-center text-2xl flex-shrink-0">
                                <iframe
                                  src={item.selectedDiamond.video}
                                  title={`Video for ${item.selectedDiamond._id}`}
                                  className="w-full h-full aspect-square overflow-hidden"
                                  allowFullScreen
                                ></iframe>
                              </div>
                              <div className="flex-1">
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
                              <div className="text-right">
                                <div className="text-black font-semibold text-sm">
                                  {currencySymbol}
                                  {item?.selectedDiamond?.net.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link href="/cart">
                        <button className="inline-flex cursor-pointer items-center text-black hover:text-emerald-400 transition-colors text-sm">
                          <ArrowLeft className="mr-1" size={16} /> Edit Cart
                          Items
                        </button>
                      </Link>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        id="have-coupon"
                        name="have-coupon"
                        checked={addCoupon}
                        onChange={() => setAddCoupon(!addCoupon)}
                        className="border h-[18px] w-[18px] border-black placeholder:text-black/50 rounded-md p-2"
                        placeholder="Enter your coupon code"
                      />
                      <label
                        htmlFor="have-coupon"
                        className="text-sm font-medium text-black"
                      >
                        Have a coupon?
                      </label>
                    </div>

                    {addCoupon && (
                      <>
                        {Details.email !== "" &&
                        Details.name !== "" &&
                        Details.phone !== "" &&
                        Details.address !== "" &&
                        Details.zip !== "" ? (
                          <div>
                            <div className="flex justify-between font-semibold text-md gap-4 items-end text-black">
                              <div className="flex flex-col gap-1 w-3/4 justify-between">
                                <label
                                  htmlFor="coupon"
                                  className="text-sm font-medium text-black"
                                >
                                  Coupon
                                </label>
                                <input
                                  type="text"
                                  id="coupon"
                                  name="coupon"
                                  value={couponInput}
                                  onChange={(e) =>
                                    setCouponInput(e.target.value)
                                  }
                                  className="border border-black placeholder:text-black/50 rounded-md p-2"
                                  placeholder="Enter your coupon code"
                                />
                              </div>

                              {couponData?.code === couponInput &&
                              couponApplied ? (
                                <div
                                  // onClick={validateCoupon}
                                  className="w-1/4 flex justify-center items-center bg-black text-white h-11 rounded-lg font-medium  transition-all  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                  Applied
                                </div>
                              ) : (
                                <div
                                  onClick={validateCoupon}
                                  className="w-1/4 flex justify-center items-center bg-black text-white h-11 rounded-lg font-medium  transition-all  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                  {loadingCoupon ? "Applying..." : "Apply"}
                                </div>
                              )}
                            </div>
                            <h2
                              className={`text-sm mt-1 ml-1 font-medium text-black ${
                                couponApplied
                                  ? "text-emerald-400"
                                  : "text-red-500"
                              }`}
                            >
                              {couponApplied
                                ? "Coupon applied successfully!"
                                : errorCoupon
                                ? `Error: ${errorCoupon}`
                                : "Enter your coupon code to get a discount."}
                            </h2>
                          </div>
                        ) : (
                          <h2 className="text-sm mt-1 ml-1 font-medium text-red-500">
                            Please fill All Customer Details to apply a coupon.
                          </h2>
                        )}
                      </>
                    )}

                    <div className="flex  justify-between font-semibold text-md mt-4 text-black">
                      <span>Original Price:</span>
                      <span>
                        {currencySymbol}
                        {originalTotal.toFixed(2)}
                      </span>
                    </div>
                    {couponData && couponApplied && (
                      <div className="flex justify-between font-semibold text-md mt-4 text-black">
                        <span>Discount:</span>
                        <span>
                          {currencySymbol}
                          {couponData?.discount?.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {ApplicableTax > 0 && (
                      <div className="flex  justify-between font-semibold text-md mt-4 text-black">
                        <span>Tax:</span>
                        <span>
                          {currencySymbol}
                          {((originalTotal * ApplicableTax) / 100).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-black/20 pt-3">
                      <div className="flex justify-between text-2xl font-bold text-black">
                        <span>Total Payable:</span>
                        <span>
                          {currencySymbol}
                          {couponApplied && couponData?.discount
                            ? calculateTotalWithTax(
                                originalTotal,
                                couponData.discount
                              )
                            : calculateTotalWithTax(originalTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={processingPayment}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {processingPayment ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin mr-2" size={20} />
                        {checkoutState.loading
                          ? "Processing Order..."
                          : "Processing Payment..."}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Lock className="mr-2" size={20} />
                        Pay {currencySymbol}
                        {couponApplied && couponData?.discount
                          ? calculateTotalWithTax(
                              originalTotal,
                              couponData.discount
                            )
                          : calculateTotalWithTax(originalTotal)}
                      </div>
                    )}
                  </button>
                  <div className="flex items-center justify-center mt-4 text-gray-400 text-sm">
                    <CreditCard className="mr-2" size={16} />
                    Secured by Stripe
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaymentSuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        orderDetails={orderDetails}
      />
    </>
  );
};

export default CheckoutPage;
