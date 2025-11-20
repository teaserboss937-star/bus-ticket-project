import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaBusAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Lading from "./Lading";

 function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formdata,setFormdata]=useState({
username:"",
password:""
  })
const nagivate=useNavigate()
  const queryClient =useQueryClient()
const {mutate:log,isPending,isError,error}=useMutation({
mutationFn:async({username,password})=>{
    try{
const res=await axios.post(`${BaseUrl}/api/auth/login`,{username,password},{withCredentials:true})
 return res.data
    }catch(error){
throw error
    }
},
onSuccess:()=>{
    toast.success("login succesfult")
  
    queryClient.invalidateQueries({queryKey:["authUser"]})
      nagivate("/")
},
onError:()=>{
    toast.error(console.log(error))
}
})

const handlesumbit=(e)=>{
e.preventDefault()
log(formdata)
}

const handleChange=(e)=>{
    e.preventDefault()
    setFormdata({...formdata,[e.target.name]:e.target.value})
}
{isPending ? <Lading /> :"login..."}
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 overflow-hidden">
      {/* Floating Bus Icons Background */}
      <FaBusAlt className="absolute text-white/20 text-8xl top-10 left-10 animate-bounce" />
      <FaBusAlt className="absolute text-white/20 text-9xl bottom-16 right-12 animate-pulse" />
      <FaBusAlt className="absolute text-white/10 text-7xl top-1/2 left-1/3 rotate-12 animate-spin-slow" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-[380px] bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8"
      >
        <div className="flex justify-center mb-4">
          <FaBusAlt className="text-4xl text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h1>

        <form className="space-y-5" onSubmit={handlesumbit}>
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-1">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <FaUser className="text-gray-500 mr-2" />
              <input
                name="username"
                type="text"
                placeholder="Enter username"
                onChange={handleChange}
                value={formdata.username}
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <FaLock className="text-gray-500 mr-2" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={handleChange}
                value={formdata.password}
                className="w-full outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 text-sm focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
     {isError && <p>{error.message}</p>}
          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Login
          </button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            
            <Link  to="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Login