import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import { useNavigate } from "react-router-dom";
import Footer from "../Bookings/Footer";
import { motion } from "framer-motion";
import { FaBus, FaSyncAlt, FaShieldAlt, FaHeadset, FaTag } from "react-icons/fa";
import BusAmenities from "../Bookings/BusAmenities";
import Features from "../Bookings/Features";
import Lading from "./Lading";

function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  const swapCities = () => {
    if (!origin && !destination) return;
    setOrigin(destination);
    setDestination(origin);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ from, to, date }) => {
      const res = await axios.post(`${BaseUrl}/api/bus/search-by-date`, {
        from,
        to,
        date,
      });
      return res.data;
    },
    onSuccess: (data) => {
      navigate("/bus", {
        state: {
          searchResults: data,
          from: origin,
          to: destination,
          date: travelDate,
        },
      });
    },
    onError: () => {
      alert("No buses found or server error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ from: origin, to: destination, date: travelDate });
  };

  return (
    <div className="min-h-screen flex flex-col bg-rose-50">
      <Navbar />

      {/* Hero - lighter red background */}
      <section className="relative isolate bg-gradient-to-br from-rose-100 via-rose-200 to-rose-300 text-rose-900">
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/40 blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.2 }}
          />
          <motion.div
            className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/30 blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:py-14">
          {/* Branding row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <motion.h1
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Book Bus Tickets Instantly
              </motion.h1>
              <motion.p
                className="mt-2 text-rose-900/80"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                Compare operators, choose seats, and travel smart—KR Travels style.
              </motion.p>
            </div>

            {/* Mode tabs (visual only) */}
            <div className="self-start sm:self-auto bg-white/60 rounded-full p-1 shadow-sm">
              <div className="flex">
                <button className="px-4 py-2 rounded-full bg-white text-rose-700 text-sm font-semibold shadow">
                  Bus
                </button>
              
              </div>
            </div>
          </div>

          {/* Search card - medium sized controls */}
          <motion.form
            onSubmit={handleSubmit}
            className="mt-8 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto] items-center gap-3 bg-white rounded-xl p-3 shadow-xl"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            {/* Origin */}
            <div className="flex flex-col">
              <label htmlFor="origin" className="text-xs font-medium text-gray-500">
                From
              </label>
              <select
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                className="mt-1 h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="">select from</option>
                <option value="coimbatore">Coimbatore</option>
                <option value="chennai">Chennai</option>
                <option value="thiruchendur">Thiruchendur</option>
                <option value="madurai">Madurai</option>
                <option value="trichy">Trichy</option>
              </select>
            </div>

            {/* Swap */}
            <button
              type="button"
              onClick={swapCities}
              aria-label="Swap origin and destination"
              className="mx-auto sm:mx-0 h-11 w-11 grid place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition"
              title="Swap"
            >
              <FaSyncAlt />
            </button>

            {/* Destination */}
            <div className="flex flex-col">
              <label htmlFor="destination" className="text-xs font-medium text-gray-500">
                To
              </label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="mt-1 h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="">Select destination</option>
                <option value="chennai">Chennai</option>
                <option value="coimbatore">Coimbatore</option>
                <option value="thiruchendur">Thiruchendur</option>
                <option value="madurai">Madurai</option>
                <option value="trichy">Trichy</option>
              </select>
            </div>

            {/* Date + CTA */}
            <div className="sm:col-span-4 grid grid-cols-1 sm:grid-cols-[220px_auto] gap-3">
              <div className="flex flex-col">
                <label htmlFor="travelDate" className="text-xs font-medium text-gray-500">
                  Date
                </label>
                <input
                  type="date"
                  id="travelDate"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={minDate}
                  required
                  className="mt-1 h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isPending}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
                className="h-11 w-full rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-md transition disabled:bg-gray-300"
              >
                {isPending ? <Lading /> : "Search Buses"}
              </motion.button>
            </div>
          </motion.form>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-rose-900/80">
            <Badge icon={<FaShieldAlt />} title="Safe & Secure" subtitle="Trusted operators" />
            <Badge icon={<FaHeadset />} title="24x7 Support" subtitle="We’re here to help" />
            <Badge icon={<FaTag />} title="Best Prices" subtitle="No hidden charges" />
            <Badge icon={<FaBus />} title="2000+ Routes" subtitle="Pan-India coverage" />
          </div>
        </div>
      </section>

      
      <BusAmenities />
      <Features />
      <Footer />
    </div>
  );
}

export default Home;

function Badge({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/60 px-3 py-2 text-rose-900">
      <div className="text-xl">{icon}</div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs opacity-80">{subtitle}</div>
      </div>
    </div>
  );
}