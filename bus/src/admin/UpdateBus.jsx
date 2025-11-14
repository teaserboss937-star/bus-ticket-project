import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UpdateBus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  });

  const [lowerSeats, setLowerSeats] = useState([]);
  const [upperSeats, setUpperSeats] = useState([]);

  //  Fetch all buses and find by ID
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/admin/getallbus`, {
          withCredentials: true,
        });
        const allBuses = res.data;

        const data = allBuses.find((b) => b._id === id);
        if (!data) {
          toast.error("Bus not found!");
          return;
        }

        setBusData({
          busName: data.busName,
          busNumber: data.busNumber,
          totalSeats: data.totalSeats,
          from: data.from,
          to: data.to,
          bustype: data.bustype,
          pickupLocation: data.pickupLocation,
          pickupTime: data.pickupTime,
          dropLocation: data.dropLocation,
          dropTime: data.dropTime,
          startDate: data.startDate?.split("T")[0],
          endDate: data.endDate?.split("T")[0],
        });

        const lower = data.seats.filter((s) => s.seatNumber.startsWith("L"));
        const upper = data.seats.filter((s) => s.seatNumber.startsWith("U"));
        setLowerSeats(lower);
        setUpperSeats(upper);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch bus details!");
      }
    };

    fetchBus();
  }, [id]);

  // 🔹 Handle input change
  const handleInputChange = (e) => {
    setBusData({ ...busData, [e.target.name]: e.target.value });
  };

  //  Handle seat type change
  const handleSeatTypeChange = (deck, index, type) => {
    const updated = deck === "L" ? [...lowerSeats] : [...upperSeats];
    updated[index].seatType = type;
    deck === "L" ? setLowerSeats(updated) : setUpperSeats(updated);
  };

  //  Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BaseUrl}/api/admin/updatebus/${id}`,
        { ...busData, seats: [...lowerSeats, ...upperSeats] },
        { withCredentials: true }
      );

      toast.success(" Bus updated successfully!");
      navigate("/adminpanel");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update bus!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
          🚌 Update Bus Details
        </h2>

        {/* === FORM FIELDS === */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-10">
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
              <label className="text-gray-600 text-sm font-medium">
                {f.label}
              </label>
              <input
                type={f.type || "text"}
                name={f.name}
                value={busData[f.name]}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          ))}

          {/* Bus Type */}
          <div>
            <label className="text-gray-600 text-sm font-medium">
              Bus Type
            </label>
            <select
              name="bustype"
              value={busData.bustype}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-red-500"
            >
              <option>Seater</option>
              <option>Sleeper</option>
              <option>AC Seater</option>
              <option>AC Sleeper</option>
              <option>AC Sleeper+Seater</option>
              <option>Non-AC Sleeper+Seater</option>
            </select>
          </div>

          <div className="col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
               Update Bus
            </button>
          </div>
        </form>

        {/* === SEAT ARRANGEMENT === */}
        <div className="space-y-10">
          {/* Lower Deck */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Lower Deck (Seater)
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {lowerSeats.map((seat, i) => (
                <div
                  key={seat.seatNumber}
                  className="p-3 border rounded-lg text-center bg-gray-100 hover:bg-gray-200 transition"
                >
                  <div className="font-semibold text-sm">{seat.seatNumber}</div>
                  <select
                    value={seat.seatType}
                    onChange={(e) =>
                      handleSeatTypeChange("L", i, e.target.value)
                    }
                    className="mt-1 text-xs bg-white rounded"
                  >
                    <option value="seater">Seater</option>
                    <option value="sleeper">Sleeper</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Upper Deck */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Upper Deck (Sleeper)
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {upperSeats.map((seat, i) => (
                <div
                  key={seat.seatNumber}
                  className="p-3 border rounded-lg text-center bg-gray-100 hover:bg-gray-200 transition"
                >
                  <div className="font-semibold text-sm">{seat.seatNumber}</div>
                  <select
                    value={seat.seatType}
                    onChange={(e) =>
                      handleSeatTypeChange("U", i, e.target.value)
                    }
                    className="mt-1 text-xs bg-white rounded"
                  >
                    <option value="seater">Seater</option>
                    <option value="sleeper">Sleeper</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBus;
