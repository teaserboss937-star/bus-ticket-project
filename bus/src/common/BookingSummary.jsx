import React from "react";
import { CheckCircle, MapPin, Clock, User, Mail, Phone } from "lucide-react";
import Navbar from "./Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import { Link, useParams, useLocation } from "react-router-dom";
import Lading from "./Lading";

function BookingSummary() {
  const { id } = useParams();
  const location = useLocation();
  const localTicket = location.state?.ticket;

  const {
    data: ticketData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const res = await axios.get(`${BaseUrl}/api/bus/getticket/${id}`, {
        withCredentials: true,
      });
      return res.data;
    },
    enabled: !!id && !localTicket,
  });

  // FINAL RESPONSE (localTicket or backend response)
  const response = localTicket || ticketData;

  console.log("FINAL SUMMARY DATA:", response);

  if (!response) return <div><Lading /></div>;

  
  const booking = response.bookings?.[0];

  if (!booking) {
    return <div>No booking details found.</div>;
  }

  return (
    <div className="min-h-screen bg-red-100 pb-10">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-rose-600 text-white p-6 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-2xl font-semibold">Booking Confirmed!</h2>
          <p className="text-sm text-green-100 mt-1">
            Your seats have been successfully booked.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Booking Info */}
          <section className="border-b pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Booking Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm">
              <div>
                <span className="font-medium">Bus ID:</span> {booking.bus}
              </div>
              <div>
                <span className="font-medium">Seat:</span> {booking.seatNumber}
              </div>
              <div>
                <span className="font-medium">Price:</span> ₹
                {booking.price || booking.totalPrice}
              </div>
            </div>
          </section>

          {/* Passenger Info */}
          <section className="border-b pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Passenger Information
            </h3>

            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex items-center gap-2">
                <User size={16} />
                {booking.passengerName} ({booking.passengerAge} yrs)
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} /> {booking.phoneNumber}
              </div>

              <div className="flex items-center gap-2">
                <Mail size={16} /> {booking.email}
              </div>
            </div>
          </section>

          {/* Trip Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Trip Information
            </h3>

            <div className="flex flex-col gap-4 text-gray-700 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-600 mt-1" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Pickup Location</p>
                  <p>{booking.pickupLocation}</p>
                  <p className="flex items-center gap-1 mt-1 text-gray-500">
                    <Clock size={14} /> {booking.pickupTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-red-500 mt-1" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Drop Location</p>
                  <p>{booking.dropLocation}</p>
                  <p className="flex items-center gap-1 mt-1 text-gray-500">
                    <Clock size={14} /> {booking.dropTime}
                  </p>
                </div>
              </div>
            </div>
          </section>

         
            <div>
            <Link to="/">
              <button className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingSummary;
