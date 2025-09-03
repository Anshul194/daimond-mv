"use client";

import { fetchOrderHistory } from "@/store/slices/myorders";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const OrderHistoryPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const {
    data: orders = [],
    status,
    error,
  } = useSelector((state) => state.myOrders);

  useEffect(() => {
    dispatch(fetchOrderHistory(user?._id));
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
        return <Package className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders =
    selectedFilter === "all"
      ? safeOrders
      : safeOrders.filter((order) => order.order_status === selectedFilter);

  console.log("Filtered Orders:", filteredOrders);

  const filterOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "delivered", label: "Delivered" },
    { value: "shipped", label: "Shipped" },
    { value: "processing", label: "Processing" },
    { value: "canceled", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-[#fefaf5] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order History
          </h1>
          <p className="text-gray-600">View and manage your recent orders</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Filter by status:
            </span>
            <div className="flex space-x-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === option.value
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order State */}
        {status === "loading" && <p>Loading orders...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}

        {/* Orders List */}
        <div className="space-y-6">
          {Array.isArray(filteredOrders) &&
            filteredOrders.length > 0 &&
            filteredOrders.map((order) => (
              <div
                key={order?._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.order_status)}
                        <span className="font-medium text-gray-900">
                          {order?._id}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-medium ${getStatusColor(
                          order.order_status
                        )}`}
                      >
                        {order.order_status?.charAt(0)?.toUpperCase() +
                          order.order_status?.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <a
                        target="_blank"
                        href={`${order.invoice_url}`}
                        className="px-4 py-1  underline rounded-full cursor-pointer"
                      >
                        Download Invoice{" "}
                      </a>
                      <span>
                        Ordered:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${order?.order_payment_meta?.total_amount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order?.sub_orders[0]?.sub_order_items?.map(
                      (item, index) => (
                        <div className="last:border-0 border-b border-gray-200">
                          <div
                            key={index}
                            className="flex items-center space-x-4  pb-4 "
                          >
                            <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <img
                                src={
                                  item?.product_id?.image[0] ||
                                  "/placeholder.png"
                                }
                                alt={item?.product_id?.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {item?.product_id?.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Quantity: {item?.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ${item?.product_id?.price?.toFixed(2)}
                              </p>
                              {/* {item?.quantity > 1 && (
                                <p className="text-sm text-gray-600">
                                  ${(item?.price / item?.quantity).toFixed(2)}{" "}
                                  each
                                </p>
                              )} */}
                            </div>
                          </div>

                          {item?.diamond && (
                            <div className="flex items-center space-x-4  pb-4 ">
                              <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                <iframe
                                  src={item?.diamond?.video}
                                  title={`Video for ${item?.diamond?.shape}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="text-lg  font-medium text-gray-800 ">
                                  {item?.diamond?.weight.toFixed(2)}w -{" "}
                                  {item?.diamond?.color} -{" "}
                                  {item?.diamond?.clarity} -{" "}
                                  {item?.diamond?.shape}
                                </div>
                                <div className="flex items-center mb-1">
                                  <span className="text-gray-600 font-semibold text-[10px]">
                                    SKU
                                  </span>
                                  <span className="ml-1 text-gray-800 text-[10px]">
                                    {item?.diamond?.certino}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  ${item?.diamond.net?.toFixed(2)}
                                </p>
                                {item?.quantity > 1 && (
                                  <p className="text-sm text-gray-600">
                                    $
                                    {(
                                      item?.diamond?.net / item?.quantity
                                    ).toFixed(2)}{" "}
                                    each
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  {/* Order Status Info */}
                  {order.status === "delivered" && order.deliveryDate && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Delivered on{" "}
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {order.status === "shipped" && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <Truck className="w-4 h-4 inline mr-1" />
                        Shipped - Tracking: {order.trackingNumber}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Estimated delivery:{" "}
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {order.status === "processing" && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Your order is being processed and will ship soon
                      </p>
                    </div>
                  )}

                  {order.status === "cancelled" && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800">
                        This order has been cancelled. Refund will be processed
                        within 3–5 business days.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {/* <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div className="flex space-x-3">
                      <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      {order.status === "delivered" && (
                        <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Download Invoice</span>
                        </button>
                      )}
                    </div>
                    {order.status === "shipped" && order.trackingNumber && (
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                        Track Package
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <button className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors">
                        Buy Again
                      </button>
                    )}
                  </div>
                </div> */}
              </div>
            ))}
        </div>

        {/* No Orders */}
        {status === "succeeded" && filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {selectedFilter === "all"
                ? "You haven't placed any orders yet."
                : `No orders with status "${selectedFilter}" found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
