import expressAsyncHandler from "express-async-handler";
import Book from "../models/book.js";

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
    const book = await Book.findAll();
    res.json(book);
  } catch (error) {
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

    book.status = status;
    await book.save();

    res.json({ message: "Book status updated successfully", book });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update book status",
    });
  }
});
