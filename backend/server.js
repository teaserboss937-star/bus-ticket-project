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
      "http://localhost:5173",
      "https://bus-ticket-project-2al8-r5al2ofi5-kengurajs-projects-bdb4b841.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());



app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authuRoutes);
app.use("/api/bus",  busRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
