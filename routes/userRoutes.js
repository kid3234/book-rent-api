import express from "express";
import { deleteUser, getUser, updateUser, updateUserStatus } from "../controllers/userController";
import authenticateToken from "../middlewares/authMidleware";
import { checkAbility } from "../middlewares/abilityMiddleware";

const userRouter = express.Router();

userRouter.get('/',authenticateToken,checkAbility('read','User'),getUser);
userRouter.put('/:id',authenticateToken,checkAbility('update','User'),updateUser);
userRouter.delete('/',authenticateToken,checkAbility('delete','User'),deleteUser);
userRouter.patch('/:id/status',authenticateToken,checkAbility('manage','all'),updateUserStatus);


export default userRouter;