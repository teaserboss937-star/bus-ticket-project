import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import authuRoutes from "./Routes/authu.route.js";
import busRoutes from "./Routes/bus.route.js";
import adminRoutes from "./Routes/adminRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ⭐ DYNAMIC CORS — Works for all Vercel URLs
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      // allow localhost
      if (origin.includes("localhost")) return callback(null, true);

      // allow your main frontend
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // allow ALL Vercel preview URLs
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      // otherwise block
      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authuRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
