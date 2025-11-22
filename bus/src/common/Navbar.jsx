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

  
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/auth/getme`, {
          withCredentials: true,
        });
        return res.data; // includes role
      } catch {
        return null;
      }
    },
    retry: false,
  });

  
  useEffect(() => {
    if (authUser?.role === "admin" && window.location.pathname === "/adminlogin") {
      navigate("/adminpanel");
    }
    if (authUser?.role === "user" && window.location.pathname === "/login") {
      navigate("/");
    }
  }, [authUser, navigate]);

  
  const handleLogout = async () => {
    try {
      await axios.post(`${BaseUrl}/api/auth/logout`, {}, { withCredentials: true });
      queryClient.removeQueries(["authUser"]);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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
          <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 transition">
            <BusFront className="w-7 h-7 text-black" />
            <span className="font-extrabold tracking-wide text-lg text-black">
              KR <span className="text-blue-700">TRAVELS</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link to="/" className="flex items-center gap-2 hover:text-blue-700 transition">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/mybooking" className="flex items-center gap-2 hover:text-blue-700 transition">
              <User className="w-4 h-4" /> My Bookings
            </Link>
            <Link to="/support" className="flex items-center gap-2 hover:text-blue-700 transition">
              <Headphones className="w-4 h-4" /> Support
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <p className="text-sm italic text-gray-600">Checking session...</p>
            ) : authUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full font-semibold hover:bg-gray-800 transition"
              >
                {authUser.role === "admin" ? (
                  <>
                    <Shield className="w-4 h-4" /> Admin Logout
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" /> Logout
                  </>
                )}
              </button>
            ) : (
              <>
                <Link to="/login" className="bg-black text-white px-4 py-1.5 rounded-full font-semibold shadow hover:bg-gray-800 transition">
                  User Login
                </Link>
                <Link to="/adminlogin" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full font-semibold shadow hover:from-blue-500 hover:to-indigo-500 transition">
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

      {/* Mobile Menu (same logic as desktop) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-100 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 10 }}
      >
        <div className="flex flex-col items-start gap-4 px-6 py-4 text-sm font-semibold">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-700 transition">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/mybooking" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-700 transition">
            <User className="w-4 h-4" /> My Bookings
          </Link>
          <Link to="/support" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-700 transition">
            <Headphones className="w-4 h-4" /> Support
          </Link>

          {isLoading ? (
            <p className="text-sm italic text-gray-600">Checking session...</p>
          ) : authUser ? (
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full font-semibold hover:bg-gray-800 transition w-full justify-center"
            >
              {authUser.role === "admin" ? (
                <>
                  <Shield className="w-4 h-4" /> Admin Logout
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" /> Logout
                </>
              )}
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="bg-black text-white px-4 py-1.5 rounded-full font-semibold shadow hover:bg-gray-800 transition w-full text-center">
                User Login
              </Link>
              <Link to="/adminlogin" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full font-semibold shadow hover:from-blue-500 hover:to-indigo-500 transition w-full">
                <Shield className="w-4 h-4" /> Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
