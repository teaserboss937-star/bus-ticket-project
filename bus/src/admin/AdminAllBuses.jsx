import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Edit, Trash2, BusFront } from "lucide-react";

const AdminAllBuses = () => {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuses();
  }, []);

  //  Fetch all buses
  const fetchBuses = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/api/admin/getallbus`, {
        withCredentials:true,
      });
      setBuses(res.data);
    } catch (error) {
      toast.error(" Failed to fetch buses!");
    }
  };

  //  Delete bus
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;
    try {
      await axios.delete(`${BaseUrl}/api/admin/deletebus/${id}`, {
        withCredentials: true,
      });
      toast.success(" Bus deleted successfully!");
      fetchBuses();
    } catch (error) {
      toast.error("Error deleting bus!");
    }
  };

  //  Edit bus
  const handleEdit = (id) => {
    navigate(`/admin/update-bus/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">
           All Buses
        </h2>

        {buses.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No buses found.</p>
        ) : (
          <div className="space-y-5">
            {buses.map((bus) => (
              <div
                key={bus._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-l-4 border-red-500"
              >
                {/* === LEFT: Bus Info === */}
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 text-red-600 p-3 rounded-xl">
                    <BusFront size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {bus.busName}{" "}
                      <span className="text-sm text-gray-500">
                        ({bus.bustype})
                      </span>
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {bus.from} → {bus.to}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      🕒 {bus.pickupTime} → {bus.dropTime}
                    </p>
                  </div>
                </div>

                {/* === MIDDLE: Details === */}
                <div className="mt-3 sm:mt-0 text-sm text-gray-700 text-center sm:text-left">
                  <p>
                    <strong>Total Seats:</strong> {bus.totalSeats}
                  </p>
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(bus.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(bus.endDate).toLocaleDateString()}
                  </p>
                </div>

                {/* === RIGHT: Action Buttons === */}
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleEdit(bus._id)}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bus._id)}
                    className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllBuses;
