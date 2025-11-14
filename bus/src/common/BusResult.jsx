import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "./Navbar";

function BusResult() {
  const location = useLocation();
  const { searchResults, from, to, date } = location.state || {};

  const buses =
    searchResults?.buses?.map((bus) => {
      const seats = Array.isArray(bus.seats) ? bus.seats : [];
      const seaterSeats = seats.filter((s) => s.seatType?.trim().toLowerCase() === "seater");
      const sleeperSeats = seats.filter((s) => s.seatType?.trim().toLowerCase() === "sleeper");

      const seatPrice = seaterSeats.length ? Math.min(...seaterSeats.map((s) => s.price)) : 0;
      const berthPrice = sleeperSeats.length ? Math.min(...sleeperSeats.map((s) => s.price)) : 0;

      return {
        id: bus._id,
        operatorName: bus.busName,
        busType: bus.bustype,
        seatPrice,
        berthPrice,
        availableSeats: seats.length,
        departureTime: bus.pickupTime,
        arrivalTime: bus.dropTime,
        origin: bus.from,
        destination: bus.to,
        boardingPoint: bus.pickupLocation || "N/A",
        droppingPoint: bus.dropLocation || "N/A",
        layout: generateLayoutFromBackend(seats),
      };
    }) || [];

  const [filters, setFilters] = useState({ busType: "", boardingPoint: "", droppingPoint: "" });
  const [openBusId, setOpenBusId] = useState(null);
  const [activeDeck, setActiveDeck] = useState("lower");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const boardingPoints = [...new Set(buses.map((b) => b.boardingPoint))];
  const droppingPoints = [...new Set(buses.map((b) => b.droppingPoint))];

  const filteredBuses = buses.filter((bus) => {
    const matchesType = filters.busType ? bus.busType?.toLowerCase().includes(filters.busType.toLowerCase()) : true;
    const matchesBoarding = filters.boardingPoint ? bus.boardingPoint?.toLowerCase() === filters.boardingPoint.toLowerCase() : true;
    const matchesDropping = filters.droppingPoint ? bus.droppingPoint?.toLowerCase() === filters.droppingPoint.toLowerCase() : true;
    return matchesType && matchesBoarding && matchesDropping;
  });

  const handleSeatSelect = (busId, seatId) => {
    const key = `${busId}-${seatId}`;
    setSelectedSeats((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-[#d84e55] text-white py-6 text-center shadow-md">
        <h2 className="text-2xl font-semibold">{from} ➜ {to}</h2>
        <p className="text-sm opacity-90">Travel Date: {date}</p>
      </div>

      <div className="max-w-7xl mx-auto mt-6 p-4 flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full md:w-1/4 h-fit border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">🧭 Filters</h2>

          <FilterSelect
            label="Bus Type"
            value={filters.busType}
            onChange={(e) => setFilters({ ...filters, busType: e.target.value })}
            options={["seater", "sleeper", "AC seater", "AC sleeper", "Non-AC seater", "Non-AC sleeper"]}
          />

          <FilterSelect
            label="Boarding Point"
            value={filters.boardingPoint}
            onChange={(e) => setFilters({ ...filters, boardingPoint: e.target.value })}
            options={boardingPoints}
          />

          <FilterSelect
            label="Dropping Point"
            value={filters.droppingPoint}
            onChange={(e) => setFilters({ ...filters, droppingPoint: e.target.value })}
            options={droppingPoints}
          />

          <button
            onClick={() => setFilters({ busType: "", boardingPoint: "", droppingPoint: "" })}
            className="w-full py-2 mt-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-lg transition font-medium"
          >
            Reset Filters
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 space-y-5">
          {filteredBuses.length ? (
            filteredBuses.map((bus) => (
              <div key={bus.id} className="bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100 p-5">
                {/* Top Row */}
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{bus.operatorName}</h3>
                    <p className="text-sm text-gray-500">{bus.busType}</p>
                    <p className="text-xs mt-1 text-gray-600">
                      Seats Available:{" "}
                      <span className="font-semibold text-green-600">{bus.availableSeats}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    {bus.seatPrice > 0 && (
                      <p className="text-[#d84e55] font-bold text-sm">Seater ₹{bus.seatPrice}</p>
                    )}
                    {bus.berthPrice > 0 && (
                      <p className="text-[#c13e45] font-bold text-sm">Sleeper ₹{bus.berthPrice}</p>
                    )}
                  </div>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-3 mt-3 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900">{bus.departureTime}</p>
                    <p className="text-xs">Departs from</p>
                    <p className="font-medium">{bus.origin}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{bus.arrivalTime}</p>
                    <p className="text-xs">Arrives at</p>
                    <p className="font-medium">{bus.destination}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p>Boarding: {bus.boardingPoint}</p>
                    <p>Dropping: {bus.droppingPoint}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => setOpenBusId(openBusId === bus.id ? null : bus.id)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    {openBusId === bus.id ? "Hide Seats" : "View Seats"}
                  </button>

                  <Link
                    to="/booking"
                    state={{
                      busId: bus.id,
                      busName: bus.operatorName,
                      origin: bus.origin,
                      destination: bus.destination,
                      seatDetails: getSelectedSeats(bus, selectedSeats),
                      pickupLocation: bus.boardingPoint,
                      pickupTime: bus.departureTime,
                      dropLocation: bus.droppingPoint,
                      dropTime: bus.arrivalTime,
                      travelDate: date,
                    }}
                    className="px-5 py-2 bg-[#d84e55] hover:bg-[#c13e45] text-white rounded-lg text-sm font-semibold transition"
                  >
                    Book Now
                  </Link>
                </div>

                {/* Seat Layout */}
                {openBusId === bus.id && (
                  <div className="mt-5 border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-2">
                        <DeckButton active={activeDeck === "lower"} label="Lower Deck" onClick={() => setActiveDeck("lower")} />
                        <DeckButton active={activeDeck === "upper"} label="Upper Deck" onClick={() => setActiveDeck("upper")} />
                      </div>

                      <div className="flex gap-3 text-xs items-center">
                        <Legend color="bg-green-500" label="Selected" />
                        <Legend color="bg-gray-300 border border-gray-400" label="Available" />
                      </div>
                    </div>

                    <BusLayout
                      deck={bus.layout[activeDeck]}
                      busId={bus.id}
                      selectedSeats={selectedSeats}
                      onSelect={handleSeatSelect}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No buses found for your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* === Helper Components === */
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#d84e55] outline-none"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function DeckButton({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-lg text-sm font-medium ${
        active ? "bg-[#d84e55] text-white" : "bg-gray-100 text-gray-700"
      } transition`}
    >
      {label}
    </button>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-4 h-4 rounded ${color}`}></div>
      <span>{label}</span>
    </div>
  );
}

function BusLayout({ deck, busId, selectedSeats, onSelect }) {
  return (
    <div className="relative bg-gray-50 rounded-lg p-4 flex justify-between gap-6">
      <div className="absolute right-3 top-2 bg-yellow-500 text-xs text-white px-2 py-1 rounded-md">
        Driver
      </div>
      <Row data={deck.left.lower} busId={busId} selectedSeats={selectedSeats} onSelect={onSelect} />
      <Row data={deck.right.lower} busId={busId} selectedSeats={selectedSeats} onSelect={onSelect} />
    </div>
  );
}

function Row({ data, busId, selectedSeats, onSelect }) {
  return (
    <div className="flex flex-col gap-2">
      {data.map((s) => (
        <Seat key={s._id || s.id} seat={s} busId={busId} selectedSeats={selectedSeats} onSelect={onSelect} />
      ))}
    </div>
  );
}

function Seat({ seat, busId, selectedSeats, onSelect }) {
  const key = `${busId}-${seat._id || seat.id}`;
  const isSelected = selectedSeats.includes(key);

  const baseStyle = "cursor-pointer flex items-center justify-center text-xs font-semibold rounded-md transition";
  const shape = seat.seatType === "sleeper" ? "w-14 h-6 rounded-full" : "w-8 h-8";
  const color = isSelected
    ? "bg-green-500 text-white"
    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-200";

  return (
    <div onClick={() => onSelect(busId, seat._id || seat.id)} className={`${baseStyle} ${shape} ${color}`}>
      {seat.seatNumber}
    </div>
  );
}

function generateLayoutFromBackend(seats) {
  const lowerSeats = seats.filter((s) => s.seatNumber?.toUpperCase().startsWith("L"));
  const upperSeats = seats.filter((s) => s.seatNumber?.toUpperCase().startsWith("U"));
  const split = (arr) => ({
    left: { lower: arr.slice(0, Math.ceil(arr.length / 2)) },
    right: { lower: arr.slice(Math.ceil(arr.length / 2)) },
  });
  return { lower: split(lowerSeats), upper: split(upperSeats) };
}

function getSelectedSeats(bus, selectedSeats) {
  return Object.values(bus.layout)
    .flatMap((deck) => [...Object.values(deck.left.lower), ...Object.values(deck.right.lower)])
    .filter((s) => selectedSeats.includes(`${bus.id}-${s._id || s.id}`))
    .map((s) => ({
      seatId: s._id || s.id,
      seatNumber: s.seatNumber,
      seatType: s.seatType,
      price: s.price,
    }));
}

export default BusResult;
