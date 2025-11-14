import express from "express";
import dotenv    from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import authuRoutes     from "./Routes/authu.route.js";
import busRoutes       from "./Routes/bus.route.js";
import adminRoutes     from "./Routes/adminRoutes.js";

import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Derive __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin:      "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authuRoutes);
app.use("/api/bus",  busRoutes);
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../bus/dist");

  app.use(express.static(frontendPath));

  app.get( (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
