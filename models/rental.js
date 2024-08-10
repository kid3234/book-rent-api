import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";
import Book from "./book.js";
import User from "./user.js";

const Rental = sequelize.define(
  "Rental",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rentPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Book,
        key: "id",
      },
    },
    renterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

Rental.belongsTo(Book, { as: "book", foreignKey: "bookId" });
Rental.belongsTo(User, { as: "renter", foreignKey: "renterId" });
Book.hasMany(Rental, { as: "rentals", foreignKey: "bookId" });
User.hasMany(Rental, { as: "rentals", foreignKey: "renterId" });

export default Rental;
