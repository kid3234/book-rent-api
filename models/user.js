import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("renter", "owner", "admin"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "disabled"),
      defaultValue: "disabled",
    },
  },
  {
    tableName: "Users", // Explicitly set table name
    timestamps: true,
  }
);

export default User;
