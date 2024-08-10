import Book from '../models/book.js';
import User from '../models/user.js';
import sequelize from './dbConnect.js';

export const initializeDatabase = async () => {
  try {
    // Synchronize models with the database
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database & tables created or updated');
    } else {
      await sequelize.authenticate();
      console.log('Database connected without altering schema.');
    }
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

export default sequelize;
