import express from "express";
import { login, registerUser } from "../controllers/authController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { loginSchema, registerSchema } from "../validation/authValidation";
import { sanitizeInputs } from "../middlewares/sanitizeMiddleware";

const authroutes = express.Router();

authroutes.post('/register',sanitizeInputs,validationMiddleware(registerSchema),registerUser);
authroutes.post('/login',sanitizeInputs,validationMiddleware(loginSchema),login);


export default authroutes;