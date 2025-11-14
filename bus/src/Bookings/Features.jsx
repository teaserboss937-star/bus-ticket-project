import React from "react";
import { motion } from "framer-motion";
import { FaTicketAlt, FaFemale, FaPhoneAlt, FaHeadset, FaUndo } from "react-icons/fa";

function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex flex-col items-center py-12 px-6">
      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-black-600 mb-12 text-center drop-shadow-md">
        🌟 KR Travels Features
      </h1>

      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12">
        {/* Left: Text and Feature Icons */}
        <div className="md:w-1/2 w-full space-y-8">
          {/* Intro Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
              “Modern Travel, Simplified & Smart”
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              At <span className="font-semibold text-orange-600">KR Travels</span>, we’re committed to making
              every journey smooth, safe, and effortless. Our modern buses and customer-focused features ensure
              you travel in comfort and confidence—every time.
            </p>
          </motion.div>

          {/* Features List */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mt-6">
            <FeatureItem
              icon={<FaTicketAlt className="text-orange-500 text-3xl" />}
              label="E-Ticketing"
            />
            <FeatureItem
              icon={<FaFemale className="text-pink-500 text-3xl" />}
              label="Ladies Seat"
            />
            <FeatureItem
              icon={<FaPhoneAlt className="text-blue-500 text-3xl" />}
              label="Phone Booking"
            />
            <FeatureItem
              icon={<FaHeadset className="text-green-500 text-3xl" />}
              label="Customer Service"
            />
            <FeatureItem
              icon={<FaUndo className="text-purple-500 text-3xl" />}
              label="Return Ticket"
            />
          </div>
        </div>

        {/* Right: Animated Bus Image */}
        <div className="md:w-1/2 w-full flex justify-center">
          <motion.img
            src="/rajesh.jpg" 
            alt="KR Travels Bus Features"
            className="rounded-2xl shadow-2xl w-[624px] max-h-[416px] object-cover border-4 border-orange-300"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* Individual Feature Item */
const FeatureItem = ({ icon, label }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -3 }}
    className="flex flex-col items-center text-center bg-white/80 rounded-xl p-5 shadow-md hover:shadow-lg transition"
  >
    {icon}
    <span className="mt-2 text-sm font-medium">{label}</span>
  </motion.div>
);

export default Features;
