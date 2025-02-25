// backend/model/postModel.js
import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";

const PostEntry = sequelize.define("PostEntry", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Stores file path
  },
});

User.hasMany(PostEntry, { foreignKey: "userId" });
PostEntry.belongsTo(User, { foreignKey: "userId" });

export default PostEntry;