import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";
import Book from "./book.js";

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
    },
    image: {
      type: DataTypes.STRING,
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
      type: DataTypes.ENUM("owner", "admin","renter"),
      defaultValue: "owner",
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Users", 
    timestamps: true,
  }
);



export default User;

User.getAdminOwnerData = async function () {
  return await User.findAll({
    where:{
      role:'owner'
    },
    attributes: [
      "id",
      "location",
      "status",
      "approved",
      "email",
      "phone",
      "name",
      "image",

      // Corrected subquery syntax
      [
        sequelize.literal(`(
        SELECT COUNT(*)
        FROM "Books" AS "Book"
        WHERE "Book"."ownerId" = "User"."id"
      )`),
        "booksCount",
      ], // Alias for the count of books
    ],
  });
};
