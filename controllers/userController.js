import PostEntry from "../model/postModel.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "uploads"); // /web-dev/backend/uploads/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to backend/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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

export const createPost = async (req, res) => {
  try {
    const { content, userId } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

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
    console.error("Post creation error:", error);
    res.status(500).json({ message: "Server error creating post", error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await PostEntry.findAll({
      include: [
        {
          model: User,
          attributes: ["fullName", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    console.log(
      "Fetched posts:",
      posts.map((p) => ({
        id: p.id,
        content: p.content,
        imageUrl: p.imageUrl,
        user: p.User,
      }))
    );
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error fetching posts", error: error.message });
  }
};

export { upload };