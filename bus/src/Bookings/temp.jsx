import React from "react";
import { motion } from "framer-motion";
import { FaBusAlt, FaMapMarkerAlt, FaClock, FaRegCalendarAlt } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import { Link } from "react-router-dom";
import Lading from "../common/Lading";

function MyBooking() {
  const queryClient = useQueryClient();

  //  Fetch user's bookings
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => {
      const res = await axios.get(`${BaseUrl}/api/bus/mybookings`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  
  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.put(
        `${BaseUrl}/api/bus/cancel/${id}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myBookings"]);
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        <Lading />
      </div>
    );

  if (isError || !data)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
         Failed to load bookings. please login
      </div>
    );

  //  Utility: check if ticket is cancelable
  const isCancelable = (travelDate) => {
    const today = new Date();
    const journey = new Date(travelDate);
    return journey > today; // Only allow cancel if travel date is in the future
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6 flex flex-col items-center">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-red-600 text-center mb-8">
          My Bookings
        </h1>

        {Array.isArray(data) && data.length > 0 ? (
          data.map((ticket) => {
            const canCancel = isCancelable(ticket.travelDate);
            return (
              <motion.div
                key={ticket._id || ticket.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-md border border-gray-200 mb-6 overflow-hidden transition"
              >
                <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                  {/* Left: Trip Info */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center mb-2">
                      <FaBusAlt className="text-red-500 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-800">
                        {ticket.busName}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className="font-medium">{ticket.pickupLocation}</span>
                      <span className="text-red-500">➜</span>
                      <span className="font-medium">{ticket.dropLocation}</span>
                    </div>

                    <div className="flex items-center mt-2 text-gray-600 text-sm">
                      <FaRegCalendarAlt className="mr-2 text-gray-400" />
                      {ticket.travelDate}
                      <FaClock className="ml-4 mr-2 text-gray-400" />
                      {ticket.time}
                    </div>

                    <div className="mt-2 text-gray-700 text-sm">
                      Seats:{" "}
                      <span className="font-medium text-gray-800">
                        {Array.isArray(ticket.seatNumber)
                          ? ticket.seatNumber.join(", ")
                          : ticket.seatNumber}
                      </span>
                    </div>
                  </div>

                  {/* Right: Status + Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                        ticket.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {ticket.status}
                    </div>

                    <div className="text-lg font-bold text-gray-800 mb-2">
                      ₹{ticket.pricePaid}
                    </div>

                    {/* Cancel / View Buttons */}
                    {ticket.status === "Cancelled" ? (
                      <button
                        disabled
                        className="bg-gray-200 text-gray-500 px-4 py-1.5 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Ticket Cancelled
                      </button>
                    ) : canCancel ? (
                      <button
                        onClick={() =>
                          cancelMutation.mutate(ticket._id || ticket.id)
                        }
                        disabled={cancelMutation.isPending}
                        className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:bg-red-300"
                      >
                        {cancelMutation.isPending ? "Cancelling..." : "Cancel Ticket"}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Expired
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer section */}
                <div className="bg-gray-50 text-xs text-gray-500 px-6 py-2 flex justify-between">
                  <span>Booking ID: {ticket._id || ticket.id}</span>
                  <span>Online Payment</span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No bookings found. Start your journey by booking a bus!
          </p>
        )}
      </motion.div>
      <div >
        <Link to="/">
        BACK TO HOME
        </Link>
      
      </div>
    </div>
  );
}

export default MyBooking;
