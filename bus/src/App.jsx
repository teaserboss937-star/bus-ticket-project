import React from "react";
import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "./api/BaseUrl";
import { Toaster } from "react-hot-toast";
import Lading from "./common/Lading";
import Home from "./common/Home";
import BusResult from "./common/BusResult";
import BookingForm from "./Bookings/BookingForm";
import Login from "./common/Login";
import Signup from "./common/Signup";
import MyBooking from "./Bookings/MyBooking";
import BookingSummary from "./common/BookingSummary";
import Supportpage from "./common/Supportpage";
import AdminSignup from "./admin/AdminSignup";
import Adminpanel from "./admin/Adminpanel";
import CreatedBus from "./admin/CreatedBus";
import AdminAllBuses from "./admin/AdminAllBuses";
import UpdateBus from "./admin/UpdateBus";
import AdminBookings from "./admin/AdminBookings";
import AdminCancelledTickets from "./admin/AdminCancelledTickets";

// Route Guards
import { ProtectedRoute, AdminRoute } from "./common/ProtectedRoute";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axios.get(`${BaseUrl}/api/auth/getme`, {
        withCredentials: true,
      });
      return res.data; // should include { userId, role }
    },
    retry: false,
  });

  if (isLoading) return <Lading />;

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/bus" element={<BusResult />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/adminlogin" element={<AdminSignup />} />
        <Route path="/support" element={<Supportpage />} />

        {/* User Protected Routes */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute authUser={authUser}>
              <BookingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mybooking"
          element={
            <ProtectedRoute authUser={authUser}>
              <MyBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute authUser={authUser}>
              <BookingSummary />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/adminpanel"
          element={
            <AdminRoute authUser={authUser}>
              <Adminpanel />
            </AdminRoute>
          }
        />
        <Route
          path="/create"
          element={
            <AdminRoute authUser={authUser}>
              <CreatedBus />
            </AdminRoute>
          }
        />
        <Route
          path="/allbus"
          element={
            <AdminRoute authUser={authUser}>
              <AdminAllBuses />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/update-bus/:id"
          element={
            <AdminRoute authUser={authUser}>
              <UpdateBus />
            </AdminRoute>
          }
        />
        <Route
          path="/allbooking"
          element={
            <AdminRoute authUser={authUser}>
              <AdminBookings />
            </AdminRoute>
          }
        />
        <Route
          path="/cancelticket"
          element={
            <AdminRoute authUser={authUser}>
              <AdminCancelledTickets />
            </AdminRoute>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
