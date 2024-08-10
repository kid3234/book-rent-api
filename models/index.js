import sequelize from '../config/db.js';
import User from './User.js';
import Book from './book.js';

// Optionally, you can add associations here if needed
// User.hasMany(Book);
// Book.belongsTo(User);

Book.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

User.hasMany(Book, { as: "books", foreignKey: "ownerId", onDelete: "CASCADE" });

sequelize.sync({ force: false,alter: true }).then(() => {
  console.log('Database & tables created');
}).catch(error => {
  console.error('Error syncing database:', error);
});

export default { User, Book };
