import { Op } from "sequelize";
import expressAsyncHandler from "express-async-handler";
import Book from "../models/book.js";
import Income from "../models/income.js";
import User from "../models/user.js";

export const CreatBook = expressAsyncHandler(async (req, res) => {
  console.log("this is me");

  try {
    const { title, author, category, quantity, image, price } = req.body;

    const bookexist = await Book.findOne({ where: { title: title } });

    if (bookexist) {
      return res.status(500).json({
        error: "Book exists",
      });
    }
    const book = await Book.create({
      title,
      image,
      author,
      category,
      quantity,
      price,
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
    const { price, quantity, availability } = req.body;

    const book = await Book.findByPk(id);

    if (!book)
      return res.status(404).json({
        error: "Book not found",
      });

    await book.update({
      price,
      availability,
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

    const book = await Book.findByPk(id);

    if (!book) return res.status(404).json({ error: "Book not found" });

    book.status = !book.status;
    await book.save();

    res.json({ message: "Book status updated successfully", book });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update book status",
    });
  }
});

export const getAdminDashboardData = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const currentMonthIncome = await Income.getCurrentMonthIncome(ownerId);
    const lastMonthIncome = await Income.getLastMonthIncome(ownerId);
    const incomeComparison =
      ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;

    const availableBooks = await Book.getAvailableBooks();

    const bookStatusData = await Book.getBookStatusDataForAdmin();

    const last6MonthsIncome = await Income.getLast6MonthsIncome(ownerId);
    const samePeriodLastYearIncome = await Income.getSamePeriodLastYearIncome(
      ownerId
    );

    res.json({
      currentMonthIncome,
      lastMonthIncome,
      incomeComparison,
      availableBooks,
      bookStatusData,
      incomeGraph: {
        last6MonthsIncome,
        samePeriodLastYearIncome,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOwnerDashboardData = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const currentMonthIncome = await Income.getCurrentMonthIncome(ownerId);
    const lastMonthIncome = await Income.getLastMonthIncome(ownerId);
    const incomeComparison =
      ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;

    const availableBooks = await Book.getAvailableBooksByOwner(ownerId);

    const bookStatusData = await Book.getBookStatusDataForOwner(ownerId);

    const last6MonthsIncome = await Income.getLast6MonthsIncome(ownerId);
    const samePeriodLastYearIncome = await Income.getSamePeriodLastYearIncome(
      ownerId
    );

    res.json({
      currentMonthIncome,
      lastMonthIncome,
      incomeComparison,
      availableBooks,
      bookStatusData,
      incomeGraph: {
        last6MonthsIncome,
        samePeriodLastYearIncome,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminBookData = async (req, res) => {
  try {
    const books = await Book.getAdminBookData();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const filterBook = async (req, res) => {
  const query = req?.query?.value;

  const book = await Book.findOne({
    where: {
      [Op.or]: [{ title: query }, { author: query }],
    },
  });

  if (!book) {
    return res.status(404).json({
      message: "Book not found!",
    });
  }

  res.json({
    message: "Book fetched successfully",
    book,
  });
};
