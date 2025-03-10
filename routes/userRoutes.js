import express from "express";
import { registerUser, loginUser, createPost, upload, getPosts, getUserByUsername } from "../controllers/userController.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Post routes (image upload enabled)
router.post("/posts", upload.single("image"), createPost);
router.get("/posts", getPosts);

// Profile route
router.get("/user/:username", getUserByUsername); // Fetch user by username

export default router;