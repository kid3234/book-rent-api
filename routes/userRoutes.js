import express from "express";
import {
  approveOwner,
  deleteUser,
  filterUser,
  getAdminOwnerData,
  getProfile,
  getUser,
  updateUser,
  updateUserStatus,
} from "../controllers/userController.js";
import authenticateToken from "../middlewares/authMidleware.js";
import { checkAbility } from "../middlewares/abilityMiddleware.js";
import {
  getAdminBookData,
  getAdminDashboardData,
  getOwnerDashboardData,
} from "../controllers/bookController.js";

const userRouter = express.Router();

userRouter.get("/", authenticateToken, checkAbility("read", "User"), getUser);

userRouter.get("/profile", authenticateToken, getProfile);
userRouter.put(
  "/update",
  authenticateToken,
  updateUser
);
userRouter.delete(
  "/:id",
  authenticateToken,
  checkAbility("delete", "User"),
  deleteUser
);
userRouter.patch(
  "/:id/status",
  authenticateToken,
  checkAbility("manage", "all"),
  updateUserStatus
);
userRouter.patch(
  "/:id/approve",
  authenticateToken,
  checkAbility("manage", "all"),
  approveOwner
);

userRouter.get(
  "/admin/dashboard",
  authenticateToken,
  checkAbility("manage", "all"),
  getAdminDashboardData
);
userRouter.get(
  "/admin/owners",
  authenticateToken,
  checkAbility("manage", "all"),
  getAdminOwnerData
);
userRouter.get(
  "/admin/books",
  authenticateToken,
  checkAbility("manage", "all"),
  getAdminBookData
);

userRouter.get(
  "/owner/dashboard",
  authenticateToken,
  checkAbility("read", "Book"),
  getOwnerDashboardData
);

userRouter.get(
  "/owner/filter",
  authenticateToken,
  checkAbility("read", "User"),
  filterUser
);



export default userRouter;
