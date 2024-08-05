import express from "express";
import { deleteUser, getUser, updateUser, updateUserStatus } from "../controllers/userController.js";
import authenticateToken from "../middlewares/authMidleware.js";
import { checkAbility } from "../middlewares/abilityMiddleware.js";

const userRouter = express.Router();

userRouter.get('/',authenticateToken,checkAbility('read','User'),getUser);
userRouter.put('/:id',authenticateToken,checkAbility('update','User'),updateUser);
userRouter.delete('/:id',authenticateToken,checkAbility('delete','User'),deleteUser);
userRouter.patch('/:id/status',authenticateToken,checkAbility('manage','all'),updateUserStatus);


export default userRouter;