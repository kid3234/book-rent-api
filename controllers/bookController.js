import Book from "../models/book";

export const CreatBook = async (req, res) => {
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
      detailes: error,
    });
  }
};

export const getBooks = async (req, res) => {
  try {
    const book = await Book.findAll();
    res.json(book);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch books",
      details: error,
    });
  }
};

export const updateBook = async (req, res) => {
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
      details: error,
    });
  }
};

export const deleteBook = async (req, res) => {
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
      detailes: error,
    });
  }
};

export const approveBook = async(req,res) =>{
  try{
    const {id} = req.params;
    const {status} = req.body;

    const book = await Book.findByPk(id);

    if(!book) return res.status(404).json({error:'Book not found'})

      book.status = status;
      await book.save();

      res.json({message:'Book status updated successfully',book})


  }catch(error){
    res.status(500).json({
      error:'Failed to update book status',
      detailes:error
    })
  }
}