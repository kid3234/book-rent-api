import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../config/logger.js";
import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();


export const registerUser = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password, phone, location,role } = req.body;

    // Check if the user already exists with the provided email
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res
        .status(400)
        .json({ error: "User already exists with this email." });
    }

    // Check if the user already exists with the provided phone number
    const phoneExists = await User.findOne({ where: { phone } });
    if (phoneExists) {
      return res
        .status(400)
        .json({ error: "User already exists with this phone number." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      email,
      phone,
      password: hashedPassword,
      location,
      role
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to register user",
    });
  }
});

export const login = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.sttus(404).json({
        error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    logger.info("User logged in", { userId: user.id });
    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    logger.error("Login failed", { error: error.message });
    res.status(500).json({ error: "Faild to login" });
  }
});
