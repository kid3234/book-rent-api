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
      type: DataTypes.ENUM("owner", "admin"),
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
    tableName: "Users", // Explicitly set table name
    timestamps: true,
  }
);

export default User;

User.getAdminOwnerData = async function () {
  return await User.findAll({
    attributes: [
      "id",
      "location",
      "status",
      "approved",
      "email",
      "phone",

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


 // name: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },