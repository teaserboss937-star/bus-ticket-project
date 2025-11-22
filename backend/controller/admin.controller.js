
import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import Bus from "../models/bus.js";
import Booking from "../models/Booking.js"
import { generatedToken } from "../token/generatedToken.js";

export const signupadmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin username already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    generatedToken(newAdmin._id, newAdmin.role, res);

    res.status(201).json({
      _id: newAdmin._id,
      username: newAdmin.username,
      role: newAdmin.role,
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.error("Error in admin signup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ error: "Invalid admin username or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid admin username or password" });
    }

    generatedToken(admin._id, admin.role, res);

    res.status(200).json({
      _id: admin._id,
      username: admin.username,
      role: admin.role,
    });
  } catch (error) {
    console.error("Error in admin login:", error.message);
    res.status(500).json({ error: "Server error during admin login" });
  }
};

export const createBus = async (req, res) => {
  try {
    const {
      busName,
      busNumber,
      totalSeats,
      from,
      to,
      bustype,
      pickupLocation,
      dropLocation,
      pickupTime,
      dropTime,
      startDate,
      endDate,
      seats, 
    } = req.body;

    
    if (
      !busName ||
      !busNumber ||
      !totalSeats ||
      !from ||
      !to ||
      !bustype ||
      !pickupLocation ||
      !dropLocation ||
      !pickupTime ||
      !dropTime ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: "At least one seat must be added" });
    }
    for (const seat of seats) {
      if (!seat.seatNumber || !seat.seatType || !seat.price) {
        return res.status(400).json({
          error: "Each seat must have seatNumber, seatType, and price",
        });
      }
    }

    const newBus = new Bus({
      busName,
      busNumber,
      totalSeats,
      from,
      to,
      bustype,
      pickupLocation,
      dropLocation,
      pickupTime,
      dropTime,
      startDate,
      endDate,
      seats,
    });

    await newBus.save();

    return res.status(201).json({
      message: "Bus created successfully",
      bus: newBus,
    });
  } catch (error) {
    console.error("Error in createBus:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getallbus=async(req,res)=>{
  try{
const get=await Bus.find()

res.status(200).json(get)

  }catch(error){
     console.error("Error in getallbus:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const updatebus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBus = await Bus.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBus) return res.status(404).json({ message: "Bus not found" });
    res.status(200).json(updatedBus);
  } catch (error) {
    console.error("Error updating bus:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getallticket=async(req,res)=>{
  try{
const ticket=await Booking.find()
res.status(200).json(ticket)
  }catch(error){
 console.error("Error get all ticket:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

export const deleteticket =async(req,res)=>{
  try{
const {id}=req.params
const deleteTicket=await Booking.findByIdAndDelete(id)
if(!deleteTicket){
  return res.status(404).json({error:"ticket not found"})
}
res.status(200).json({error:"deleted successfuly"})
  }catch(error){
     console.error("Error in deleteticket:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const deletebus=async(req,res)=>{
  try{
const {id}=req.params

const bus=await Bus.findByIdAndDelete(id)
if(!bus){
  res.status(404).json({error:"deleted bus sussfuly"})
}

res.status(200).json({message:"deleted bus succesfuly"})
  }catch(error){
console.error("Error in deletebus:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
//admin get all cancelled ticket
export const getCancelledBookings = async (req, res) => {
  try {
    // Only admins should access this endpoint — you can verify via middleware
    const cancelledBookings = await Booking.find({ status: "cancelled" })
      .populate("bus", "busName busNumber") 
      .populate("user", "username email")   
      .sort({ cancelledAt: -1 });           

    if (cancelledBookings.length === 0) {
      return res.status(200).json({ message: "No cancelled bookings found." });
    }

    res.status(200).json({
      success: true,
      count: cancelledBookings.length,
      cancelledBookings,
    });
  } catch (error) {
    console.error("Error fetching cancelled bookings:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const bookingAnalyticsRoute = async (req, res) => {
  try {
    const { startDate, endDate, status, busId } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.travelDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (status) filter.status = status;

    if (busId) {
      if (!mongoose.Types.ObjectId.isValid(busId)) {
        return res.status(400).json({ message: "Invalid busId" });
      }
      filter.bus = new mongoose.Types.ObjectId(busId);
    }

    console.log(" Filter:", filter);

    const stats = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$travelDate" } },
            month: { $month: { $toDate: "$travelDate" } },
            day: { $dayOfMonth: { $toDate: "$travelDate" } },
          },
          totalTicketsSold: { $sum: 1 },
          totalSales: { $sum: "$pricePaid" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          totalTicketsSold: 1,
          totalSales: 1,
        },
      },
    ]);

    console.log(" Stats:", stats);
    res.json(stats);
  } catch (err) {
    console.error(" Error in bookingAnalyticsRoute:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};