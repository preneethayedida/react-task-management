import express from "express";
import Task from "../models/Task.js"; // ✅ Import Task model
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ Import authentication middleware

const router = express.Router();

// ✅ Get All Tasks (Only for logged-in users)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.error("❌ Failed to fetch tasks:", error.message);
        res.status(500).json({ success: false, error: "Failed to fetch tasks" });
    }
});

// ✅ Create a New Task (Assign it to the logged-in user)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, status = "pending", priority = "medium" } = req.body;

        if (!title.trim()) {
            return res.status(400).json({ success: false, error: "Title is required" });
        }

        const task = new Task({ 
            title, 
            description, 
            status, 
            priority, 
            userId: req.user.userId 
        });

        await task.save();
        res.status(201).json({ success: true, message: "Task created successfully", task });
    } catch (error) {
        console.error("❌ Failed to create task:", error.message);
        res.status(500).json({ success: false, error: "Failed to create task" });
    }
});

// ✅ Update Task Status (Only if the user owns the task)
router.patch("/:id/status", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["pending", "in progress", "completed"].includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid task status" });
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Task status updated successfully", task });
    } catch (error) {
        console.error("❌ Failed to update task status:", error.message);
        res.status(500).json({ success: false, error: "Failed to update task status" });
    }
});

// ✅ Update Full Task Details (Only if the user owns the task)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Task updated successfully", task });
    } catch (error) {
        console.error("❌ Failed to update task:", error.message);
        res.status(500).json({ success: false, error: "Failed to update task" });
    }
});

// ✅ Delete a Task (Only if the user owns the task)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error("❌ Failed to delete task:", error.message);
        res.status(500).json({ success: false, error: "Failed to delete task" });
    }
});

export default router;