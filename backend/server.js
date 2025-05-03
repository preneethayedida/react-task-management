import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js"; // ✅ Authentication routes
import taskRoutes from "./routes/taskRoutes.js"; // ✅ Task routes

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Middleware
app.use(express.json()); // ✅ Parse JSON requests
app.use(cors()); // ✅ Handle Cross-Origin Requests

// ✅ Connect to MongoDB with Improved Error Handling
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1); // ✅ Exit if connection fails
    });

// ✅ Integrate Authentication Routes
app.use("/api/auth", authRoutes);

// ✅ Integrate Task API Routes
app.use("/api/tasks", taskRoutes);

// ✅ Basic API Endpoint
app.get("/", (req, res) => res.send("🚀 Server is Running..."));

// ✅ Error Handling Middleware (For Unexpected Errors)
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));