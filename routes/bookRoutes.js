import express from "express";
import { approveBook, CreatBook, deleteBook, filterBook, filterBookForAll, getAvailableBooksForRent, getBooks, rentBook, updateBook } from "../controllers/bookController.js";
import authenticateToken from "../middlewares/authMidleware.js";
import { checkAbility } from "../middlewares/abilityMiddleware.js";

const bookRoutes = express.Router();


bookRoutes.post('/',authenticateToken,checkAbility('create','Book'),CreatBook);
bookRoutes.get('/',authenticateToken,checkAbility('read','Book'),getBooks);
bookRoutes.put('/:id',authenticateToken,checkAbility('update','Book'),updateBook);
bookRoutes.delete('/:id',authenticateToken,checkAbility('delete','Book'),deleteBook);
bookRoutes.patch('/:id/approve',authenticateToken,checkAbility('manage','all'),approveBook);
bookRoutes.get('/filter',authenticateToken,checkAbility('read','Book'),filterBook);
bookRoutes.get('/filterall',filterBookForAll);
bookRoutes.get('/rent',getAvailableBooksForRent)
bookRoutes.post('/rent',rentBook)

export default bookRoutes;
