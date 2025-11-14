import User from "../models/user.js";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";

 export const    protectRoutes = async (req, res, next) => {
  try {
  
    const token = req.cookies.jwt; 
    if (!token) return res.status(401).json({ error: "Token not provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    if (!userId) return res.status(401).json({ error: "Invalid token payload" });

    let user = await User.findById(userId).select("-password");
    if (!user) {
      user = await Admin.findById(userId).select("-password");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired, please login again" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
};


