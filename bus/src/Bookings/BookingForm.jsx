import React, { useState } from "react";
import { MapPin, Clock, Mail, Phone, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import { toast } from "react-hot-toast";
import Lading from "../common/Lading";

function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-lg">
        No booking details found. Please go back and select seats again.
      </div>
    );
  }

  const {
    busId,
    busName,
    origin,
    destination,
    seatDetails = [],
    pickupLocation,
    pickupTime,
    dropLocation,
    dropTime,
    travelDate,
  } = bookingData;

  const selectedSeats = seatDetails.map((seat) => ({
    number: seat.seatNumber,
    price: seat.price,
  }));

  const [passengers, setPassengers] = useState(
    selectedSeats.map((seat) => ({
      seatNumber: seat.number,
      passengerName: "",
      passengerAge: "",
    }))
  );

  const [contactInfo, setContactInfo] = useState({
    phoneNumber: "",
    email: authUser?.email || "",
  });

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (Number(seat.price) || 0),
    0
  );

  const { mutate: bookTicket, isPending } = useMutation({
    mutationKey: ["bookTicket"],
    mutationFn: async (payload) => {
      const res = await axios.post(`${BaseUrl}/api/bus/ticket`, payload, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("🎉 Booking successful!");

      const ticketId =
        data?._id ||
        data?.ticketId ||
        data?.ticket?._id ||
        data?.data?._id ||
        data?.data?.ticketId;

      if (ticketId) {
        navigate(`/book/${ticketId}`, {
          state: {
            ticket: data,
            busName,
            origin,
            destination,
            passengers,
            contactInfo,
            totalPrice,
            pickupLocation,
            pickupTime,
            dropLocation,
            dropTime,
            travelDate,
            selectedSeats,
          },
        });
      } else {
        navigate("/mybooking");
      }
    },
    onError: (error) => {
      toast.error(
        " Booking failed! " +
          (error.response?.data?.message || "Please try again.")
      );
    },
  });

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passengers.some((p) => !p.passengerName || !p.passengerAge)) {
      return toast.error("Please fill in all passenger details.");
    }

    if (!contactInfo.phoneNumber || !contactInfo.email) {
      return toast.error("Please provide valid contact information.");
    }

    const payload = {
      busId,
      passengers,
      phoneNumber: contactInfo.phoneNumber,
      email: contactInfo.email,
      pickupLocation,
      pickupTime,
      dropLocation,
      dropTime,
      date: travelDate,
      totalPrice,
    };

    bookTicket(payload);
  };

  const handleSendTicketCopy = async () => {
    try {
      await axios.post(
        `${BaseUrl}/api/bus/send-ticket`,
        { email: contactInfo.email, busId },
        { withCredentials: true }
      );
      toast.success("📧 Ticket copy sent to your email!");
    } catch {
      toast.error("Failed to send ticket copy.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* === Left: Booking Form === */}
        <div className="md:col-span-2 bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#d84e55] mb-6 text-center">
            Passenger & Booking Details
          </h2>

          {/*  Bus Summary */}
          <div className="bg-[#fff6f6] rounded-xl p-5 mb-8 border border-[#f0d4d4]">
            <div className="flex flex-col md:flex-row justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {busName}
                </h3>
                <p className="text-sm text-gray-500">
                  {origin} → {destination}
                </p>
                <p className="text-sm text-gray-500">
                  Travel Date: {travelDate}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={14} /> {pickupLocation}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} /> {pickupTime} → {dropTime}
                </div>
                <p className="mt-1">Drop: {dropLocation}</p>
              </div>
            </div>
          </div>

          {/*  Passenger Details */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Passenger Details
            </h3>

            {passengers.map((p, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-5 bg-gray-50"
              >
                <h4 className="font-medium text-gray-700 mb-3">
                  Passenger {idx + 1} — Seat{" "}
                  <span className="font-semibold text-[#d84e55]">
                    {p.seatNumber}
                  </span>{" "}
                  (₹{selectedSeats[idx].price})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passenger Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={p.passengerName}
                      onChange={(e) =>
                        handlePassengerChange(
                          idx,
                          "passengerName",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passenger Age
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter age"
                      value={p.passengerAge}
                      onChange={(e) =>
                        handlePassengerChange(
                          idx,
                          "passengerAge",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {/*  Contact Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={14} className="inline mr-1 text-gray-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={contactInfo.phoneNumber}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail size={14} className="inline mr-1 text-gray-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        email: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/*  Confirm Booking */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#d84e55] text-white py-3 rounded-xl hover:bg-[#c13e45] font-semibold transition disabled:bg-[#e6a0a5]"
              >
                {isPending ? <Lading /> : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>

        {/* === Right: Fare Summary === */}
        <div className="md:col-span-1">
          <div className="sticky top-6 bg-white border border-gray-100 shadow-lg rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Fare Summary
            </h3>

            <div className="space-y-2 text-sm text-gray-700">
              {selectedSeats.map((seat, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>Seat {seat.number}</span>
                  <span>₹{seat.price}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total Fare</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleSendTicketCopy}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#d84e55] text-white py-2 rounded-xl hover:bg-[#c13e45] transition"
            >
              <Send size={16} />
              Send Ticket Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
