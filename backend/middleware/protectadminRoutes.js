
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";

const protectadminRoutes = async (req, res, next) => {
  try {
    const token = req.cookies?.adminjwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Admin token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admins only" });
    }

    const admin = await Admin.findById(decoded.userId).select("-password");

    if (!admin) {
      return res.status(401).json({ error: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("protectAdminRoutes:", error.message);
    return res.status(401).json({ error: "Invalid or expired admin token" });
  }
};

export default protectadminRoutes