import React from "react";
import { CheckCircle, MapPin, Clock, User, Mail, Phone } from "lucide-react";
import Navbar from "./Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import { Link, useParams, useLocation } from "react-router-dom";

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

  const data = localTicket || ticketData;

  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading ticket details...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        ❌ Failed to load ticket details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white p-6 text-center">
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
                <span className="font-medium">Bus ID:</span> {data.busId}
              </div>
              <div>
                <span className="font-medium">Travel Date:</span> {data.date}
              </div>
              <div>
                <span className="font-medium">Total Fare:</span> ₹
                {data.totalPrice}
              </div>
            </div>
          </section>

          {/* Passenger Info */}
          <section className="border-b pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Passenger Information
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              {data.passengers?.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <User size={16} />
                  {p.passengerName} ({p.passengerAge} yrs) — Seat{" "}
                  {p.seatNumber}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Phone size={16} /> {data.phoneNumber}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} /> {data.email}
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
                  <p>{data.pickupLocation}</p>
                  <p className="flex items-center gap-1 mt-1 text-gray-500">
                    <Clock size={14} />
                    {data.pickupTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-red-500 mt-1" size={18} />
                <div>
                  <p className="font-medium text-gray-800">Drop Location</p>
                  <p>{data.dropLocation}</p>
                  <p className="flex items-center gap-1 mt-1 text-gray-500">
                    <Clock size={14} />
                    {data.dropTime}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium">
              Download Ticket
            </button>
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
