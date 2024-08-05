import sequelize from '../config/db.js';
import User from './user.js';
import Book from './book.js';

// Optionally, you can add associations here if needed
// User.hasMany(Book);
// Book.belongsTo(User);

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created');
}).catch(error => {
  console.error('Error syncing database:', error);
});

export default { User, Book };
