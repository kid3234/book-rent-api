import Rental from "./rental.js";
import expressAsyncHandler from "express-async-handler";
import Book from "./book.js";
import Income from "./income.js";
import sequelize from "../config/dbConnect.js";

// Rent a book
export const rentBook = expressAsyncHandler(async (bookId, renterId) => {
  const transaction = await sequelize.transaction();

  try {
    const book = await Book.findByPk(bookId, { transaction });
    if (!book) throw new Error("Book not found");
    //    if (!await Book.isAvailableForRent(bookId)) throw new Error("Book not available for rent");
    const rentPrice = book.price;
    const owner = await book.getOwner({ transaction });
    //    if (!owner.status) throw new Error("Owner is disabled");

    const rental = await Rental.create(
      { bookId, renterId, rentPrice, rentDate: new Date() },
      { transaction }
    );

    await book.update(
      { availability: "RENTED" },
      { where: { id: bookId }, transaction }
    );

    const ownerIncome = book.price * 0.9; // 90% to owner
    const systemIncome = book.price * 0.1; // 10% to system

    await Income.create(
      { userId: owner.id, amount: ownerIncome, date: new Date() },
      { transaction }
    );

    const adminUser = await User.findOne({ where: { role: "admin" } }); // Get admin user

    if (!adminUser) throw new Error("Admin user not found");
    await Income.create(
      { userId: adminUser.id, amount: systemIncome, date: new Date() }, // Assuming system wallet is userId: null
      { transaction }
    );
    

    await transaction.commit();
    return rental;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
