import express from "express";
import { login, registerUser } from "../controllers/authController.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { loginSchema, registerSchema } from "../validation/authValidation.js";
import { sanitizeInputs } from "../middlewares/sanitizeMiddleware.js";

const authRoutes = express.Router();


authRoutes.post('/register',sanitizeInputs, validationMiddleware(registerSchema), registerUser);
  
authRoutes.post('/login',sanitizeInputs,validationMiddleware(loginSchema),login);


export default authRoutes;