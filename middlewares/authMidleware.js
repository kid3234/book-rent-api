// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new Error('Authorization header not provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token not provided');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        throw new Error('Invalid or expired token');
      }
      req.user = user;
      next();
    });
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

export default authenticateToken