import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ User Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // ✅ Validate input fields
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Email is already in use" });
        }

        // ✅ Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create a new user & save to DB
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // ✅ Generate JWT token using `process.env.JWT_SECRET`
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ success: true, token, user: { id: newUser._id, username, email } });
    } catch (error) {
        console.error("❌ Signup Error:", error.message);
        res.status(500).json({ success: false, error: "Signup failed, please try again" });
    }
});

// ✅ User Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login request received:", email);

        const user = await User.findOne({ email });
        console.log("User found in DB:", user);

        if (!user) return res.status(400).json({ success: false, error: "User not found" });

        console.log("Checking password validity...");
        console.log("Hashed password in DB:", user.password);
        console.log("Entered password:", password);

        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isValidPassword);

        if (!isValidPassword) return res.status(400).json({ success: false, error: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ success: true, token, user: { id: user._id, username: user.username, email } });
    } catch (error) {
        console.error("❌ Login Error:", error.message);
        res.status(500).json({ success: false, error: "Login failed, please try again" });
    }
});

export default router;