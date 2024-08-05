import { check } from "express-validator";

export const sanitizeInputs = [
  // Assuming you want to sanitize all fields in req.body
  check('*').escape().trim(),
  (req, res, next) => {
    next();
  }
];


