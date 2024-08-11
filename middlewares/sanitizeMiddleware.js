import { check } from "express-validator";

export const sanitizeInputs = [

  check('*').escape().trim(),
  (req, res, next) => {
    next();
  }
];


