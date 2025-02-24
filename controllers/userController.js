// backend/controllers/userController.js
import User from "../model/userModel.js"; // Corrected path
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    console.log("Received data:", req.body);
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ fullName, username, email, password: hashedPassword });
    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message, error.stack);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt by:", { username });
    if (!username || !password) {
      return res.status(400).json({ message: "Please enter the proper username and password" });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName, 
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    res.status(500).json({ message: "Server error during login" });
  }
};