// // import http from "http";
// // import app from "./app/app.js";

// // const PORT =  3001;
// // const server = http.createServer(app);
// // // process.env.PORT ||
// // server.listen(PORT, console.log(`server is runing at port ${PORT}`));

// import http from 'http';
// import app from './app/app.js';
// import sequelize from './config/dbConnect.js';


// const PORT = process.env.PORT || 3001;

// // Define a function to start the server
// const startServer = async () => {
//   try {
//     // Synchronize Sequelize models with the database
//     await sequelize.sync({ alter: true }); // or { force: false } if you don't want to drop tables
//     console.log('Database & tables created or updated');

//     // Create the server
//     const server = http.createServer(app);

//     // Start listening for requests
//     server.listen(PORT, () => {
//       console.log(`Server is running at port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Error syncing database:', error);
//   }
// };

// // Call the function to start the server
// startServer();


import http from 'http';
import app from './app/app.js';
import { initializeDatabase } from './config/database.js';
// import { initializeDatabase } from './database.js'; // Import the initialization function
initializeDatabase

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Initialize the database
    await initializeDatabase();

    // Start the server
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Call the function to start the server
startServer();
