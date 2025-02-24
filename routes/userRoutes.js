import express from 'express';
import { registerUser } from '../controllers/userController.js';
import { loginUser } from '../controllers/userController.js';

const router = express.Router();

// POST /api/users/register - Register a new user
router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;