import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import connectDB from "./config/DBConnection.js";
import authRoutes from "./routes/auth.routes.js";

const PORT = process.env.PORT || 5000;
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
