import expressAsyncHandler from "express-async-handler";
// import { Book } from "../models/book";
import {User} from "../models/user.js";


export const getUser = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

export const getProfile = expressAsyncHandler(async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findByPk(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

export const updateUser = expressAsyncHandler(async (req, res) => {
  try {
    const id = req.user.id;
    const { name, email, phone, image } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    await user.update({
      name,
      email,
      phone,
      image,
    });

    res.json({
      message: "User updated successfilly",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: "Faild to update user",
    });
  }
});

export const deleteUser = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const user = await User.findByPk(id);
    console.log("user", user);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await user.destroy();
    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete user",
    });
  }
});

export const updateUserStatus = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    let user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    user.status = !user.status;

    await user.save();
    res.json({ message: "User status updated successfully", user });
  } catch (error) {
    res.status(500).json({
      error: "Error updating user status",
    });
  }
});

export const approveOwner = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    let user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    user.approved = true;

    await user.save();
    res.json({ message: "User approved successfully", user });
  } catch (error) {
    res.status(500).json({
      error: "Error updating user status",
    });
  }
});

export const getAdminOwnerData = async (req, res) => {
  try {
    const owners = await User.getAdminOwnerData();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
