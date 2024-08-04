import express from "express";
import { approveBook, CreatBook, deleteBook, getBooks, updateBook } from "../controllers/bookController";
import authenticateToken from "../middlewares/authMidleware";
import { checkAbility } from "../middlewares/abilityMiddleware";

const bookRoutes = express.Router();

bookRoutes.post('/',authenticateToken,checkAbility('create','Book',CreatBook));
bookRoutes.get('/',authenticateToken,checkAbility('read','Book',getBooks));
bookRoutes.put('/:id',authenticateToken,checkAbility('update','Book',updateBook));
bookRoutes.delete('/:id',authenticateToken,checkAbility('delete','Book',deleteBook));
bookRoutes.patch('/:id/approve',authenticateToken,checkAbility('manage','all',approveBook));

export default bookRoutes;

