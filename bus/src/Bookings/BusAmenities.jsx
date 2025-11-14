import React from "react";
import { motion } from "framer-motion";
import {
  FaChargingStation,
  FaBed,
  FaTv,
  FaWifi,
  FaLightbulb,
  FaToilet,
} from "react-icons/fa";
import { MdOutlineLocalDrink, MdLocationOn } from "react-icons/md";

function BusAmenities() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex flex-col items-center py-12 px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-black-600 mb-12 text-center drop-shadow-md">
        🚌 KR Travels Amenities
      </h1>

      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-10">
        {/* Left: Animated Bus Image */}
        <div className="md:w-1/2 w-full flex justify-center">
          <motion.img
            src="jb-bus.jpg" 
            alt="KR Travels Bus"
            className="rounded-2xl shadow-2xl w-[448px] md:w-[448px] max-h-[576px] object-cover border-4 border-orange-300"
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

        {/* Right: Amenities & Text */}
        <div className="md:w-1/2 w-full space-y-8">
          {/* Heading & Description */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
              “Experience Safe and Comfortable Journeys With Us”
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              At <span className="font-semibold text-orange-600">Krish Travels</span>, we understand that when it
              comes to affordable intercity travel, you want to be a wise and confident traveler. We offer you the
              best travel experience with our professional crew.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We believe everyone should be able to travel at an affordable price. We understand that travel can be
              expensive, which is why for many years Krish Travels has provided safe and affordable bus
              transportation.
            </p>
          </div>

          {/* Amenities Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-gray-800">
            <Amenity
              icon={<FaChargingStation className="text-orange-500 text-3xl" />}
              label="Charging Point"
            />
            <Amenity
              icon={<FaBed className="text-blue-500 text-3xl" />}
              label="Blanket"
            />
            <Amenity
              icon={<MdOutlineLocalDrink className="text-sky-500 text-3xl" />}
              label="Water Bottle"
            />
            <Amenity icon={<FaTv className="text-purple-500 text-3xl" />} label="TV" />
            <Amenity icon={<FaWifi className="text-green-500 text-3xl" />} label="Wi-Fi" />
            <Amenity
              icon={<MdLocationOn className="text-red-500 text-3xl" />}
              label="Live Track"
            />
            <Amenity
              icon={<FaLightbulb className="text-yellow-500 text-3xl" />}
              label="Reading Light"
            />
            <Amenity
              icon={<FaToilet className="text-teal-500 text-3xl" />}
              label="Toilet"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Amenity Card Component */
const Amenity = ({ icon, label }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -3 }}
    className="flex flex-col items-center text-center bg-white/80 rounded-xl p-4 shadow-md hover:shadow-lg transition"
  >
    {icon}
    <span className="mt-2 text-sm font-medium">{label}</span>
  </motion.div>
);

export default BusAmenities;
