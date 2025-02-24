import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  port: process.env.DB_PORT || 5432,
  logging: false,  // Disable SQL logging in production
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected Successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

export default sequelize;
