import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"; // Import userRoutes
import sequelize from "./config/db.js"; // Import sequelize

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from the frontend
app.use(helmet());
app.use(morgan("dev"));

// Mount userRoutes under /api/users
app.use("/api/users", userRoutes);

// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log("Database synchronized successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });