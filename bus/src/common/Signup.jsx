import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import toast from "react-hot-toast";
import Lading from "./Lading";
import { useNavigate } from "react-router-dom";

 function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [text,setText]=useState({
username:"",
email:"",
password:""
  })
    const navigate=useNavigate()
    const{mutate,isError,isPending,error}=useMutation({
mutationFn:async({username,email,password})=>{
    try{
const res=await axios.post(`${BaseUrl}/api/auth/signup`,{username,email,password},{withCredentials:true})
return res.data
    }catch(error){
throw error
    }
},onSuccess:()=>{
    toast.success("created succesfuky")
    navigate("/")
},
onError:()=>{
    toast.error(console.log(error))
}
    })
const handlesumbit=(e)=>{
e.preventDefault()
mutate(text)
}

const handleInputchange=(e)=>{
    setText({...text,[e.target.name]:e.target.value})
}

{isPending?<Lading />:"signup"}
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[380px] bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h1>

        <form className="space-y-5" onSubmit={handlesumbit}>
        
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-1">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Enter username"
                 name="username"
                 onChange={handleInputchange}
                 value={text.username}
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

    
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                name="email"
                type="email"
                placeholder="example@email.com"
                onChange={handleInputchange}
                value={text.email}
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

        
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
                onChange={handleInputchange}
                value={text.password}
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

        
          {isError && <p>{error.message}
          </p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Sign Up
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Log in
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup