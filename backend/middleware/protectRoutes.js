import User from "../models/user.js";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken"

export const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Token not provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user or admin depending on role
    let user;
    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.userId).select("-password");
    } else {
      user = await User.findById(decoded.userId).select("-password");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Extra guard for admin-only routes
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }
  next();
};
