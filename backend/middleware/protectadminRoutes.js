import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

const protectadminRoutes = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.jwt ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Find admin
    const admin = await Admin.findById(decoded.userId).select("-password");
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin not found" }); 
    }

    if (admin.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error(" protectAdminRoutes:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default protectadminRoutes;
