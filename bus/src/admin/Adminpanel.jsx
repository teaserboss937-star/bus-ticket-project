import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Bus, Ticket, Trash2, Route } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Adminpanel() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [buses, setBuses] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    busId: "",
  });

  //  Fetch all bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/allticket", {
        withCredentials: true,
      });
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.bookings)
        ? res.data.bookings
        : [];
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  };

  //  Fetch all buses (for dropdown)
  const fetchBuses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/allbus", {
        withCredentials: true,
      });
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.buses || [];
      setBuses(data);
    } catch (err) {
      console.error("Error fetching buses:", err);
      setBuses([]);
    }
  };

  //  Fetch daily sales
  const fetchDailySales = async () => {
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.status) params.status = filters.status;
      if (filters.busId) params.busId = filters.busId;

      const res = await axios.get(
        "http://localhost:5000/api/admin/daily-sales",
        { params, withCredentials: true }
      );
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.sales)
        ? res.data.sales
        : [];
      setSalesData(data);
    } catch (err) {
      console.error("Error fetching sales:", err);
      setSalesData([]);
    }
  };

  //  Initial fetch
  useEffect(() => {
    fetchBookings();
    fetchBuses();
    fetchDailySales();
  }, []);

  //  Filters
  const filteredBookings = bookings.filter((b) => {
    const matchStatus =
      !filters.status || b.status.toLowerCase() === filters.status.toLowerCase();
    const matchBus = !filters.busId || b.busId === filters.busId;
    const matchDate =
      (!filters.startDate ||
        new Date(b.travelDate) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(b.travelDate) <= new Date(filters.endDate));
    return matchStatus && matchBus && matchDate;
  });

  //  Quick stats
  const totalSales = bookings.reduce((sum, b) => sum + (b.pricePaid || 0), 0);
  const totalTickets = bookings.length;
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

const logoutAdmin = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/admin/adminlogout",
      {},
      { withCredentials: true }
    );
    navigate("/");
  } catch (error) {
    console.error("Logout error", error);
    navigate("/");
  }
};


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#d84e55] text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Panel</h1>
        <nav className="space-y-3">
          <Link
            to=""
            className="block px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            Dashboard
          </Link>
          <Link
            to="/allbooking"
            className="block px-3 py-2 rounded-lg hover:bg-white/20"
          >
            All Bookings
          </Link>
          <Link
            to="/create"
            className="block px-3 py-2 rounded-lg hover:bg-white/20"
          >
            Create Bus Routes
          </Link>
          <Link
            to="/cancelticket"
            className="block px-3 py-2 rounded-lg hover:bg-white/20"
          >
            Cancelled Tickets
          </Link>
          <Link
            to="/allbus"
            className="block px-3 py-2 rounded-lg hover:bg-white/20"
          >
            All Buses
          </Link>
        </nav>
        <div className="mt-auto text-sm text-white/70 pt-4 border-t border-white/20">
          © 2025 KR TRAVELS Admin
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Daily Sales Dashboard
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="border p-2 rounded-md"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="border p-2 rounded-md"
          />
          <select
            className="border p-2 rounded-md"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            className="border p-2 rounded-md"
            value={filters.busId}
            onChange={(e) =>
              setFilters({ ...filters, busId: e.target.value })
            }
          >
            <option value="">All Buses</option>
            {buses.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.busName || bus.title}
              </option>
            ))}
          </select>
          <button
            onClick={fetchDailySales}
            className="bg-[#d84e55] text-white px-4 py-2 rounded-md hover:bg-[#c13f46]"
          >
            Apply Filters
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3 border-l-4 border-[#d84e55]"
          >
            <Ticket className="text-[#d84e55]" />
            <div>
              <Link to="/allbooking">
                <p className="text-sm text-gray-500">Total Tickets</p>
                <h3 className="text-xl font-semibold text-gray-800">
                  {totalTickets}
                </h3>
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3 border-l-4 border-green-500"
          >
            <Route className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Completed Bookings</p>
              <h3 className="text-xl font-semibold text-gray-800">
                {completedCount}
              </h3>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3 border-l-4 border-red-400"
          >
            <Trash2 className="text-red-400" />
            <div>
              <Link to="/cancelticket">
                <p className="text-sm text-gray-500">Cancelled</p>
                <h3 className="text-xl font-semibold text-gray-800">
                  {cancelledCount}
                </h3>
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3 border-l-4 border-blue-400"
          >
            <Bus className="text-blue-400" />
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <h3 className="text-xl font-semibold text-gray-800">
                ₹{totalSales.toLocaleString()}
              </h3>
            </div>
          </motion.div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Daily Sales Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalSales" stroke="#d84e55" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
         <button
  onClick={logoutAdmin}
  className="bg-[#d84e55] text-white px-4 py-2 rounded-lg hover:bg-[#c13f46] transition"
>
  Logout & Go Home
</button>

        </div>
      </main>
    </div>
  );
}

export default Adminpanel;
