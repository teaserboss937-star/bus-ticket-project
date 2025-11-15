import express from "express";
import dotenv    from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import authuRoutes     from "./Routes/authu.route.js";
import busRoutes       from "./Routes/bus.route.js";
import adminRoutes     from "./Routes/adminRoutes.js";

import cors from "cors";



dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: [
      "http://localhost:5173",        // Local frontend
      process.env.FRONTEND_URL       // Render frontend URL
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authuRoutes);
app.use("/api/bus",  busRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
