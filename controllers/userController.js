// backend/controllers/userController.js
import PostEntry from "../model/postModel.js"; // ✅ Correct import
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import multer from "multer";

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Register User Function (No changes needed)
export const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
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
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// ✅ Login User Function (No changes needed)
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
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
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

// ✅ Create Post Function (Fixed)
export const createPost = async (req, res) => {
  try {
    const { content, userId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; 

    console.log("Received post data:", { content, userId, image });

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await PostEntry.create({ userId, content, imageUrl: image });

    res.status(201).json({
      success: true,
      post: { id: post.id, userId, content, imageUrl: post.imageUrl },
    });
  } catch (error) {
    console.error("Post creation error:", error);  // 👈 This will print the real issue
    res.status(500).json({ message: "Server error creating post", error: error.message });
  }
};


// Export multer upload function so it can be used in routes
export { upload };
