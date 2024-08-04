import express from "express";
import { login, registerUser } from "../controllers/authController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { loginSchema, registerSchema } from "../validation/authValidation";

const authroutes = express.Router();

authroutes.post('/register',validationMiddleware(registerSchema),registerUser);
authroutes.post('/login',validationMiddleware(loginSchema),login);


export default authroutes;