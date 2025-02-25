import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import sequelize from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(helmet());
app.use(morgan("dev"));

// Serve static files from "uploads" folder
app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Connectify API");
});

sequelize.sync({ force: false })
  .then(() => {
    console.log("Database synchronized successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
