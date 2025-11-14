import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { BaseUrl } from "../api/BaseUrl"; 

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  //  Fetch all bus bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}/api/admin/allticket`);
      console.log(" API Response:", response.data);

      //  Safely extract array data (works with most API formats)
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || response.data.bookings || [];

      setBookings(data);
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      setBookings([]);
    }
    setLoading(false);
  };

  //  Delete ticket
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await axios.delete(`${BaseUrl}/api/admin/deleteticket/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      alert(" Ticket deleted successfully!");
    } catch (error) {
      console.error(" Error deleting booking:", error);
      alert("Failed to delete booking.");
    }
  };

  
  const isFutureOrToday = (date) => {
    const today = new Date();
    const travelDate = new Date(date);
    return travelDate >= new Date(today.toDateString());
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          All Bus Bookings
        </h1>

        {loading ? (
          <p>Loading bookings...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-2 px-4 border">#</th>
                  <th className="py-2 px-4 border">Passenger Name</th>
                  <th className="py-2 px-4 border">Bus</th>
                  <th className="py-2 px-4 border">Travel Date</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <tr
                      key={booking._id || index}
                      className="text-center border-t hover:bg-gray-50 transition"
                    >
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">
                        {booking.name || booking.passengerName || "—"}
                      </td>
                      <td className="py-2 px-4">
                        {booking.busName || booking.busTitle || "—"}
                      </td>
                      <td className="py-2 px-4">
                        {booking.travelDate
                          ? new Date(booking.travelDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-2 px-4">
                        {isFutureOrToday(booking.travelDate) && (
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md mx-auto transition"
                          >
                            <FaTrash /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-4 text-center text-gray-500 italic"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
