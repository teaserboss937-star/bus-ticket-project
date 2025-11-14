import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FaRedoAlt } from "react-icons/fa";
import { BaseUrl } from "../api/BaseUrl"; 
import Lading from "../common/Lading";

//  Fetch Cancelled Tickets
const fetchCancelledTickets = async () => {
  const res = await axios.get(`${BaseUrl}/api/admin/cancelled`);

  
  return (
    res.data?.cancelledBookings ||
    res.data?.tickets ||
    res.data?.data ||
    (Array.isArray(res.data) ? res.data : [])
  );
};

const AdminCancelledTickets = () => {
  const {
    data: cancelledTickets = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cancelledTickets"],
    queryFn: fetchCancelledTickets,
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Cancelled Tickets
          </h1>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
          >
            <FaRedoAlt /> Refresh
          </button>
        </div>

        {/* Table / Loading / Error states */}
        {isLoading ? (
          <Lading />
        ) : isError ? (
          <p className="text-red-600">Error fetching cancelled tickets.</p>
        ) : cancelledTickets.length === 0 ? (
          <p className="text-gray-500 italic">No cancelled tickets found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-2 px-4 border">#</th>
                  <th className="py-2 px-4 border">Passenger Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Bus Name</th>
                  <th className="py-2 px-4 border">Bus Number</th>
                  <th className="py-2 px-4 border">Seat No.</th>
                  <th className="py-2 px-4 border">Travel Date</th>
                  <th className="py-2 px-4 border">Cancelled On</th>
                  <th className="py-2 px-4 border">Pickup</th>
                  <th className="py-2 px-4 border">Drop</th>
                  <th className="py-2 px-4 border">Price (₹)</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {cancelledTickets.map((ticket, index) => (
                  <tr
                    key={ticket._id || index}
                    className="text-center border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">
                      {ticket.passengerName || "—"}
                    </td>
                    <td className="py-2 px-4">
                      {ticket.email || ticket.user?.email || "—"}
                    </td>
                    <td className="py-2 px-4">
                      {ticket.busName || ticket.bus?.busName || "—"}
                    </td>
                    <td className="py-2 px-4">
                      {ticket.busNumber || ticket.bus?.busNumber || "—"}
                    </td>
                    <td className="py-2 px-4">{ticket.seatNumber || "—"}</td>
                    <td className="py-2 px-4">
                      {ticket.travelDate
                        ? new Date(ticket.travelDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-2 px-4">
                      {ticket.updatedAt
                        ? new Date(ticket.updatedAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-2 px-4">
                      {ticket.pickupLocation || "—"}
                      <br />
                      <span className="text-xs text-gray-500">
                        {ticket.pickupTime}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {ticket.dropLocation || "—"}
                      <br />
                      <span className="text-xs text-gray-500">
                        {ticket.dropTime}
                      </span>
                    </td>
                    <td className="py-2 px-4">{ticket.pricePaid || "—"}</td>
                    <td className="py-2 px-4 text-red-600 font-semibold">
                      {ticket.status || "Cancelled"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCancelledTickets;
