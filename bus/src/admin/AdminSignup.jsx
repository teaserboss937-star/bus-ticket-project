import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Lading from "../common/Lading";

function AdminSignup() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const nagivate=useNavigate()

  const queryclient=useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await axios.post(
        `${BaseUrl}/api/admin/adminlogin`,
        { username, password },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Login successful!");
      nagivate("/adminpanel")
      queryclient.invalidateQueries({queryKey:["adminUser"]})
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Login failed");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient-xy" />
        <svg
          className="absolute -left-10 -top-10 opacity-30 w-96 h-96 blur-3xl"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="200" fill="url(#g)" />
          <defs>
            <radialGradient id="g">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </radialGradient>
          </defs>
        </svg>

        <svg
          className="absolute -right-24 -bottom-24 opacity-30 w-96 h-96 blur-3xl"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="200" fill="url(#g2)" />
          <defs>
            <radialGradient id="g2">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 z-10"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">ADMIN LOGIN</h1>
          <p className="text-sm text-gray-500 mt-1">
            Access your admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="admin@example"
              aria-label="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Enter password"
                aria-label="password"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
            >
              {isPending ? <Lading /> : "Login"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Styles for animated gradient */}
      <style jsx>{`
        .animate-gradient-xy {
          background: linear-gradient(
            120deg,
            rgba(139, 92, 246, 0.25),
            rgba(6, 182, 212, 0.25) 35%,
            rgba(249, 115, 22, 0.2) 70%
          );
          width: 150%;
          height: 150%;
          position: absolute;
          left: -25%;
          top: -25%;
          transform-origin: center;
          animation: gradientShift 12s ease-in-out infinite;
          filter: blur(40px);
        }

        @keyframes gradientShift {
          0% {
            transform: rotate(0deg) translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: rotate(15deg) translate(5%, -5%) scale(1.05);
            opacity: 0.95;
          }
          100% {
            transform: rotate(0deg) translate(0, 0) scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .animate-gradient-xy {
            filter: blur(30px);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminSignup;
