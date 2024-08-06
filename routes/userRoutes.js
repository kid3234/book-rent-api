import express from "express";
import { deleteUser, getAdminOwnerData, getUser, updateUser, updateUserStatus } from "../controllers/userController.js";
import authenticateToken from "../middlewares/authMidleware.js";
import { checkAbility } from "../middlewares/abilityMiddleware.js";
import { getAdminBookData, getAdminDashboardData, getOwnerDashboardData } from "../controllers/bookController.js";

const userRouter = express.Router();

userRouter.get('/',authenticateToken,checkAbility('read','User'),getUser);
userRouter.put('/:id',authenticateToken,checkAbility('update','User'),updateUser);
userRouter.delete('/:id',authenticateToken,checkAbility('delete','User'),deleteUser);
userRouter.patch('/:id/status',authenticateToken,checkAbility('manage','all'),updateUserStatus);

userRouter.get("/admin/dashboard",authenticateToken,checkAbility('manage','all'),getAdminDashboardData);
userRouter.get("/owner",authenticateToken,checkAbility('manage','all'),getAdminOwnerData);
userRouter.get("/admin/books",authenticateToken,checkAbility('manage','all'),getAdminBookData); 

userRouter.get("/owner/dashboard",authenticateToken,checkAbility('read','User'),getOwnerDashboardData);
// userRouter.get("/owner/books",authenticateToken,checkAbility('read','User'),geta)


export default userRouter;