import React from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import {  useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "./api/BaseUrl";
import Home   from "./common/Home"
import { Toaster } from "react-hot-toast";
import BusResult from "./common/BusResult";
import BookingForm from "./Bookings/BookingForm"
import Login from "./common/Login"
import MyBooking from "./Bookings/MyBooking.jsx";

import Signup from "./common/Signup";
import AdminSignup from "./admin/AdminSignup";
import Adminpanel from "./admin/Adminpanel";
import CreatedBus from "./admin/CreatedBus";
import AdminAllBuses from "./admin/AdminAllBuses";
import UpdateBus from "./admin/UpdateBus";
import AdminBookings from "./admin/AdminBookings";
import AdminCancelledTickets from "./admin/AdminCancelledTickets";
import BookingSummary from "./common/BookingSummary"
import Supportpage from "./common/Supportpage";
import Lading from "./common/Lading";

const App = () => {
  const {data:authUser,isLoading}=useQuery({
    queryKey:["authUser"],
    queryFn:async()=>{
      const res=await axios.get(`${BaseUrl}/api/auth/getme`,{withCredentials:true})
      return res.data
    },
    retry:false
  })
 const { data: adminUser, isLoading: adminLoading } = useQuery({
    queryKey: ["adminUser"],
    queryFn: async () => {
      const res = await axios.get(`${BaseUrl}/api/admin/adminget`, {
        withCredentials: true,
      });
      return res.data;
    },
    retry: false,
  });

  if (isLoading || adminLoading) return <Lading />
  return (

      <div>
  <Routes>
          {/* Admin Bookings Page */}
          <Route path="/" element={<Home/>} />
          <Route path="/bus" element={<BusResult />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/booking" element={authUser?<BookingForm /> :<Navigate to="/login" />} />
          <Route path="/mybooking" element={<MyBooking />} />
          <Route path="/adminlogin" element={<AdminSignup />} />
          <Route path="/adminpanel" element={adminUser ?<Adminpanel />:<Navigate to="/adminlogin" />} />
          <Route path="/create" element={<CreatedBus />}/>
          <Route path="/allbus" element={adminUser ?<AdminAllBuses />:<Navigate to="/adminlogin" />} />
          <Route path="/admin/update-bus/:id"  element={adminUser ?<UpdateBus />:<Navigate to="/adminlogin" />} />
          <Route path="allbooking" element={<AdminBookings />} />
          <Route path="/cancelticket" element={<AdminCancelledTickets />} />
          <Route path="/book/:id" element={<BookingSummary />} />
          <Route path="/support" element={<Supportpage />} />
        </Routes>
      <Toaster />
      </div>
      
      
      
  );
};

export default App;
