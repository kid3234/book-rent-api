import { Op } from "sequelize";
import expressAsyncHandler from "express-async-handler";
import Book from "../models/book.js";
import Income from "../models/income.js";
import User from "../models/User.js";

export const CreatBook = expressAsyncHandler(async (req, res) => {
  console.log("this is me");
  
  try {
    const { title, author, category, quantity } = req.body;
    const book = await Book.create({
      title,
      author,
      category,
      quantity,
      ownerId: req.user.id,
    });

    res.status(201).json({
      message: "Book created successfuly",
      book,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create book",
    });
  }
});

export const getBooks = expressAsyncHandler(async (req, res) => {
  try {
    // Fetch books that are approved and have owners with a status other than 'disabled'
    const books = await Book.findAll({
      where: {
        approved: true,
      },
      include: [
        {
          model: User,
          as: "owner",
          where: {
            status: {
              [Op.ne]: "disabled",
            },
          },
          attributes: [], // We don't need any attributes from User, just the filter
        },
      ],
    });
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      error: "Failed to fetch books",
    });
  }
});

export const updateBook = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, quantity } = req.body;

    const book = await Book.findByPk(id);

    if (!book)
      return res.status(404).json({
        error: "Book not found",
      });

    await book.update({
      title,
      author,
      category,
      quantity,
    });
    res.json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update book",
    });
  }
});

export const deleteBook = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id);
    if (!book)
      return res.status(404).json({
        message: "Book not found",
      });

    if (book.ownerId !== req.user.id)
      return res.status(403).json({
        error: "Not authorized",
      });

    await book.destroy();

    res.json({
      message: "Book deleted successfuly",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete book",
    });
  }
});

export const approveBook = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const book = await Book.findByPk(id);

    if (!book) return res.status(404).json({ error: "Book not found" });

    book.approved = !book.approved;
    await book.save();

    res.json({ message: "Book status updated successfully", book });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update book status",
    });
  }
});


                                          



export const getAdminDashboardData =async(req, res) => {
  try {
    // 1. Fetch admin income statistics
    const currentMonthIncome = await Income.getAdminCurrentMonthIncome();
    const lastMonthIncome = await Income.getAdminLastMonthIncome();
    const incomeComparison = ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;

    // 2. Fetch available books
    const availableBooks = await Book.getAvailableBooks(); // Define getAvailableBooks in the Book model

    // 3. Fetch book status data
    const bookStatusData = await Book.getBookStatusDataForAdmin(); // Define getBookStatusDataForAdmin in the Book model

    // 4. Fetch income data for line graph
    const last6MonthsIncome = await Income.getAdminLast6MonthsIncome(); // Define getAdminLast6MonthsIncome in the Income model
    const samePeriodLastYearIncome = await Income.getAdminSamePeriodLastYearIncome(); // Define getAdminSamePeriodLastYearIncome in the Income model

    res.json({
      currentMonthIncome,
      lastMonthIncome,
      incomeComparison,
      availableBooks,
      bookStatusData,
      incomeGraph: {
        last6MonthsIncome,
        samePeriodLastYearIncome
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Fetch owner dashboard data
export const getOwnerDashboardData = async(req, res) =>{
  try {
    const ownerId = req.user.id; // Assuming you have owner authentication and the owner ID is available

    // 1. Fetch owner income statistics
    const currentMonthIncome = await Income.getOwnerCurrentMonthIncome(ownerId);
    const lastMonthIncome = await Income.getOwnerLastMonthIncome(ownerId);
    const incomeComparison = ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;

    // 2. Fetch available books by owner
    const availableBooks = await Book.getAvailableBooksByOwner(ownerId); // Define getAvailableBooksByOwner in the Book model

    // 3. Fetch book status data for owner
    const bookStatusData = await Book.getBookStatusDataForOwner(ownerId); // Define getBookStatusDataForOwner in the Book model

    // 4. Fetch income data for line graph
    const last6MonthsIncome = await Income.getOwnerLast6MonthsIncome(ownerId);
    const samePeriodLastYearIncome = await Income.getOwnerSamePeriodLastYearIncome(ownerId);

    res.json({
      currentMonthIncome,
      lastMonthIncome,
      incomeComparison,
      availableBooks,
      bookStatusData,
      incomeGraph: {
        last6MonthsIncome,
        samePeriodLastYearIncome
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Fetch admin book data
export const getAdminBookData = async(req, res)=> {
  try {
    const books = await Book.getAdminBookData(); // Define getAdminBookData in the Book model
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}