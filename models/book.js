import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";
import User from "./User.js";

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
      type: DataTypes.ENUM("FREE", "RENTED"),
      defaultValue: "FREE",
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

// Static methods for fetching data

// Get available books
Book.getAvailableBooks = async function () {
  return await Book.findAll({ where: { availability: "FREE" } });
};

// Get book status data for admin
Book.getBookStatusDataForAdmin = async function () {
  return await Book.findAll({
    attributes: ["id", "title", "author", "availability", "ownerId"],
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name"], // Assuming User model has a 'name' field
      },
    ],
  });
};

// Get available books by owner
Book.getAvailableBooksByOwner = async function (ownerId) {
  return await Book.findAll({
    where: { ownerId, availability: "FREE" },
  });
};

// Get book status data for owner
Book.getBookStatusDataForOwner = async function (ownerId) {
  return await Book.findAll({
    where: { ownerId },
    attributes: ["id", "title", "availability", "ownerId"],
  });
};

// Get admin book data
Book.getAdminBookData = async function () {
  return await Book.findAll({
    attributes: ["id", "title", "author", "category", "availability", "ownerId"],
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "location", "status"], // Assuming User model has these fields
      },
    ],
  });
};

export default Book;
