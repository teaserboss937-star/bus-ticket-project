import React, { useState, useEffect } from "react";
import axios from "axios";
import {BaseUrl} from "../api/BaseUrl"; 
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatedBus = () => {
  const naviagte=useNavigate()
  const [busData, setBusData] = useState({
    busName: "",
    busNumber: "",
    totalSeats: "",
    from: "",
    to: "",
    bustype: "Seater",
    pickupLocation: "",
    pickupTime: "",
    dropLocation: "",
    dropTime: "",
    startDate: "",
    endDate: "",
    seaterPrice: "",
    sleeperPrice: "",
  });

  const [lowerSeats, setLowerSeats] = useState([]);
  const [upperSeats, setUpperSeats] = useState([]);

  /**  Auto-generate seats for lower and upper decks */
  useEffect(() => {
    const total = parseInt(busData.totalSeats) || 0;
    const half = Math.ceil(total / 2);

    const lowers = Array.from({ length: half }, (_, i) => ({
      seatNumber: `L${i + 1}`,
      seatType: "seater",
      selected: false,
    }));

    const uppers = Array.from({ length: total - half }, (_, i) => ({
      seatNumber: `U${i + 1}`,
      seatType: "sleeper",
      selected: false,
    }));

    setLowerSeats(lowers);
    setUpperSeats(uppers);
  }, [busData.totalSeats]);


  const handleInputChange = (e) => {
    setBusData({ ...busData, [e.target.name]: e.target.value });
  };

  /** Toggle seat selection */
  const toggleSeat = (deck, index) => {
    const updated = deck === "L" ? [...lowerSeats] : [...upperSeats];
    updated[index].selected = !updated[index].selected;
    deck === "L" ? setLowerSeats(updated) : setUpperSeats(updated);
  };

  /**  Change seat type (seater/sleeper) */
  const handleSeatTypeChange = (deck, index, type) => {
    const updated = deck === "L" ? [...lowerSeats] : [...upperSeats];
    updated[index].seatType = type;
    deck === "L" ? setLowerSeats(updated) : setUpperSeats(updated);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalSeatsNum = parseInt(busData.totalSeats);
    if (!busData.busName || !busData.busNumber) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (!totalSeatsNum || totalSeatsNum <= 0) {
      toast.error("Please enter a valid total number of seats!");
      return;
    }

    if (!busData.seaterPrice ) {
      toast.error("Please slected seat prices!");
      return;
    }

    const selectedSeats = [...lowerSeats, ...upperSeats].filter((s) => s.selected);
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat!");
      return;
    }

    const payload = {
      ...busData,
      seats: selectedSeats.map((s) => ({
        seatNumber: s.seatNumber,
        seatType: s.seatType,
        price: s.seatType === "sleeper" ? busData.sleeperPrice : busData.seaterPrice,
      })),
    };

    try {
      await axios.post(`${BaseUrl}/api/admin/createbus`, payload, { withCredentials: true });
      toast.success("Bus added successfully!");
      
      naviagte("/adminpanel")
      
      setBusData({
        busName: "",
        busNumber: "",
        totalSeats: "",
        from: "",
        to: "",
        bustype: "Seater",
        pickupLocation: "",
        pickupTime: "",
        dropLocation: "",
        dropTime: "",
        startDate: "",
        endDate: "",
        seaterPrice: "",
        sleeperPrice: "",
      });
      setLowerSeats([]);
      setUpperSeats([]);
    } catch (error) {
      console.error("Error creating bus:", error);
      toast.error("Failed to add bus! Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          🚌 Add New Bus (Admin)
        </h1>

        {/* === FORM === */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: "Bus Name", name: "busName" },
            { label: "Bus Number", name: "busNumber" },
            { label: "Total Seats", name: "totalSeats", type: "number" },
            { label: "From", name: "from" },
            { label: "To", name: "to" },
            { label: "Pickup Location", name: "pickupLocation" },
            { label: "Drop Location", name: "dropLocation" },
            { label: "Pickup Time", name: "pickupTime", type: "time" },
            { label: "Drop Time", name: "dropTime", type: "time" },
            { label: "Start Date", name: "startDate", type: "date" },
            { label: "End Date", name: "endDate", type: "date" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-600">
                {f.label}
              </label>
              <input
                type={f.type || "text"}
                name={f.name}
                value={busData[f.name]}
                onChange={handleInputChange}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          ))}

          {/* Bus Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Bus Type
            </label>
            <select
              name="bustype"
              value={busData.bustype}
              onChange={handleInputChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
            >
              <option>Seater</option>
              <option>Sleeper</option>
              <option>AC Seater</option>
              <option>AC Sleeper</option>
              <option>AC Sleeper+Seater</option>
              <option>Non-AC Sleeper+Seater</option>
            </select>
          </div>

          {/* Prices */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Seater Price (₹)
            </label>
            <input
              type="number"
              name="seaterPrice"
              value={busData.seaterPrice}
              onChange={handleInputChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Sleeper Price (₹)
            </label>
            <input
              type="number"
              name="sleeperPrice"
              value={busData.sleeperPrice}
              onChange={handleInputChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Save Bus
            </button>
          </div>
        </form>

        {/* SEAT ARRANGEMENT */}
        {busData.totalSeats && (
          <div className="space-y-8">
            {/* Lower Deck */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Lower Deck (L)
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {lowerSeats.map((seat, i) => (
                  <div
                    key={seat.seatNumber}
                    onClick={() => toggleSeat("L", i)}
                    className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                      seat.selected
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-bold">{seat.seatNumber}</div>
                    {seat.selected && (
                      <select
                        value={seat.seatType}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleSeatTypeChange("L", i, e.target.value)
                        }
                        className="mt-1 text-xs bg-white text-gray-800 rounded"
                      >
                        <option value="seater">Seater</option>
                        <option value="sleeper">Sleeper</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upper Deck */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Upper Deck (U)
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {upperSeats.map((seat, i) => (
                  <div
                    key={seat.seatNumber}
                    onClick={() => toggleSeat("U", i)}
                    className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                      seat.selected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-bold">{seat.seatNumber}</div>
                    {seat.selected && (
                      <select
                        value={seat.seatType}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleSeatTypeChange("U", i, e.target.value)
                        }
                        className="mt-1 text-xs bg-white text-gray-800 rounded"
                      >
                        <option value="seater">Seater</option>
                        <option value="sleeper">Sleeper</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatedBus;
