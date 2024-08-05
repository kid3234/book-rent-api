import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";
import User from "./user.js";

const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    availability: {
      type: DataTypes.ENUM("available", "rented", "unavailable"),
      defaultValue: "available",
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);
Book.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.hasMany(Book, { as: "books", foreignKey: "ownerId" });

export default Book;
