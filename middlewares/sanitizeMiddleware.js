import sanitizeBody  from 'express-validator'

export const sanitizeInputs = [
  sanitizeBody('*').escape().trim(),
  (req, res, next) => {
    next();
  }
];

