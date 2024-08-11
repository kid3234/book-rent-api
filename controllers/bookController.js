import { Op } from "sequelize";
import sequelize from "../config/dbConnect.js";
import expressAsyncHandler from "express-async-handler";
import { Book } from "../models/book.js";
import Income from "../models/income.js";
import { User } from "../models/user.js";
import Rental from "../models/rental.js";

export const CreatBook = expressAsyncHandler(async (req, res) => {
  console.log("this is me");

  try {
    const { title, author, category, quantity, image, price } = req.body;

    // const bookexist = await Book.findOne({ where: { title: title } });

    // if (bookexist) {
    //   return res.status(500).json({
    //     error: "Book exists",
    //   });
    // }
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

    const availableBooks = await Book.getAvailableBooksForDashboardForAdmin();

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

    const availableBooks = await Book.getAvailableBooksForDashboardForOwner(
      ownerId
    );

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
  const ownerId = req.user.id;
  const query = req?.query?.value;

  try {
    const book = await Book.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ title: query }, { author: query }],
          },
          { ownerId: ownerId },
        ],
      },
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found or you do not own this book!",
      });
    }

    res.json({
      message: "Book fetched successfully",
      book,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({
      message: "An error occurred while fetching the book",
    });
  }
};
export const getAvailableBooksForRent = async (req, res) => {
  const books = await Book.getAvailableBooks();
  res.json({
    message: "Avalable books ",
    books,
  });
};

export const rentBook = expressAsyncHandler(async (req, res) => {
  const { bookId, renterId } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const book = await Book.findByPk(bookId, { transaction });
    if (!book) throw new Error("Book not found");

    const rentPrice = book.price;
    const owner = await book.getOwner({ transaction });

    const rental = await Rental.create(
      { bookId, renterId, rentPrice, rentDate: new Date() },
      { transaction }
    );

    await book.update(
      { availability: "RENTED" },
      { where: { id: bookId }, transaction }
    );

    const ownerIncome = book.price * 0.9;
    const systemIncome = book.price * 0.1;

    await Income.create(
      { userId: owner.id, amount: ownerIncome, date: new Date() },
      { transaction }
    );

    const adminUser = await User.findOne({ where: { role: "admin" } });

    if (!adminUser) throw new Error("Admin user not found");
    await Income.create(
      { userId: adminUser.id, amount: systemIncome, date: new Date() },
      { transaction }
    );

    await transaction.commit();
    return res.json({
      message: "rented susccesfuly",
      rental,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      message: "error onrenting book",
      error,
    });
  }
});
