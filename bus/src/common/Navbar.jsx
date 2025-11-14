import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Menu,
  X,
  BusFront,
  Headphones,
  Home,
  User,
  LogOut,
  Shield,
  MapPin,
  Plane,
} from "lucide-react";
import { BaseUrl } from "../api/BaseUrl";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  
  const { data: authUser, isLoading: userLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/auth/getme`, {
          withCredentials: true,
        });
        return res.data;
      } catch {
        return null;
      }
    },
    retry: false,
  });

  
  const { data: adminUser, isLoading: adminLoading } = useQuery({
    queryKey: ["adminUser"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/admin/adminget`, {
          withCredentials: true,
        });
        return res.data;
      } catch {
        return null;
      }
    },
    retry: false,
  });

  // Redirect admin only from login page → /adminpanel
  useEffect(() => {
    if (adminUser && window.location.pathname === "/adminpanel") {
      navigate("/adminpanel");
    }
  }, [adminUser, navigate]);

  // Redirect user only from login page → /
  useEffect(() => {
    if (authUser && window.location.pathname === "/login") {
      navigate("/");
    }
  }, [authUser, navigate]);

  // Logout handlers
  const handleUserLogout = async () => {
    try {
      await axios.post(`${BaseUrl}/api/auth/logout`, {}, { withCredentials: true });
      await queryClient.removeQueries(["authUser"]);
      navigate("/");
    } catch (err) {
      console.error("User logout failed:", err);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await axios.post(`${BaseUrl}/api/admin/adminlogout`, {}, { withCredentials: true });
      await queryClient.removeQueries(["adminUser"]);
      navigate("/");
    } catch (err) {
      console.error("Admin logout failed:", err);
    }
  };

  const loading = userLoading || adminLoading;

  return (
    <nav className="relative bg-white text-black shadow-md border-b border-gray-100">
      {/* Top Info Bar */}
      <div className="hidden md:flex items-center justify-end gap-6 px-6 py-1 text-sm bg-gray-50 border-b border-gray-100">
        <span className="flex items-center gap-2 text-gray-700">
          <Headphones className="w-4 h-4 text-blue-600" />
          24x7 Support: 1800-000-000
        </span>
        <span className="flex items-center gap-2 text-gray-700">
          <Shield className="w-4 h-4 text-blue-600" />
          Safe & Secure Travel
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            <BusFront className="w-7 h-7 text-black" />
            <span className="font-extrabold tracking-wide text-lg text-black">
              KR <span className="text-blue-700">TRAVELS</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link
              to="/"
              className="flex items-center gap-2 hover:text-blue-700 transition"
            >
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link
              to="/mybooking"
              className="flex items-center gap-2 hover:text-blue-700 transition"
            >
              <User className="w-4 h-4" /> My Bookings
            </Link>
            <Link
              to="/support"
              className="flex items-center gap-2 hover:text-blue-700 transition"
            >
              <Headphones className="w-4 h-4" /> Support
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <p className="text-sm italic text-gray-600">Checking session...</p>
            ) : adminUser ? (
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full font-semibold hover:bg-gray-800 transition"
              >
                <Shield className="w-4 h-4" /> Admin Logout
              </button>
            ) : authUser ? (
              <button
                onClick={handleUserLogout}
                className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full font-semibold hover:bg-gray-800 transition"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-black text-white px-4 py-1.5 rounded-full font-semibold shadow hover:bg-gray-800 transition"
                >
                  User Login
                </Link>
                <Link
                  to="/adminlogin"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full font-semibold shadow hover:from-blue-500 hover:to-indigo-500 transition"
                >
                  <Shield className="w-4 h-4" /> Admin Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition focus:outline-none"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Slide-down) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-100 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 10 }}
      >
        <div className="flex flex-col items-start gap-4 px-6 py-4 text-sm font-semibold">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-blue-700 transition"
            onClick={() => setOpen(false)}
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            to="/mybooking"
            className="flex items-center gap-2 hover:text-blue-700 transition"
            onClick={() => setOpen(false)}
          >
            <User classNames="w-4 h-4" /> My Bookings
          </Link>
          <Link
            to="/support"
            className="flex items-center gap-2 hover:text-blue-700 transition"
            onClick={() => setOpen(false)}
          >
            <Headphones className="w-4 h-4" /> Support
          </Link>

          {loading ? (
            <p className="text-sm italic text-gray-600">Checking session...</p>
          ) : adminUser ? (
            <button
              onClick={() => {
                handleAdminLogout();
                setOpen(false);
              }}
              className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full font-semibold hover:bg-gray-800 transition w-full justify-center"
            >
              <Shield className="w-4 h-4" /> Admin Logout
            </button>
          ) : authUser ? (
            <button
              onClick={() => {
                handleUserLogout();
                setOpen(false);
              }}
              className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full font-semibold hover:bg-gray-800 transition w-full justify-center"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-black text-white px-4 py-1.5 rounded-full font-semibold shadow hover:bg-gray-800 transition w-full text-center"
                onClick={() => setOpen(false)}
              >
                User Login
              </Link>
              <Link
                to="/adminlogin"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full font-semibold shadow hover:from-blue-500 hover:to-indigo-500 transition w-full"
                onClick={() => setOpen(false)}
              >
                <Shield className="w-4 h-4" /> Admin Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Decorative Icons */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-6 left-10">
          <MapPin size={60} />
        </div>
        <div className="absolute bottom-8 right-12">
          <Plane size={70} />
        </div>
        <div className="absolute top-10 right-1/3">
          <BusFront size={50} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
