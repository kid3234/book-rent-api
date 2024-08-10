// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";


// // Load environment variables
// dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     logging: false,
//   }
// );

// export default sequelize;

// export const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// const fs = require('fs');
// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'host',
//   dialect: 'postgres',
//   port: 'port',
//   dialectOptions: {
//     ssl: {
//       rejectUnauthorized: true,
//       ca: fs.readFileSync('./ca.pem').toString(),
//     },
//   },
// });




// sequelize.authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// // Sync your models
// sequelize.sync()
//   .then(() => {
//     console.log('Database synced successfully.');
//   })
//   .catch(err => {
//     console.error('Error syncing database:', err);
//   });

// export default sequelize;




import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const caCertificateBase64 = process.env.CA_CERTIFICATE_BASE64;
const caCertificate = Buffer.from(caCertificateBase64, 'base64').toString('utf-8');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false, // Change this to false to allow self-signed certificates
      ca: caCertificate,
    },
  },
  logging: false,
});

export default sequelize;

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};






// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// import fs from 'fs';
// import path from 'path';

// // Load environment variables
// dotenv.config();

// const caPath = path.resolve('./utils/ca.pem'); // Adjusted path

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       rejectUnauthorized: true,
//       ca: fs.readFileSync(caPath).toString(),
//     },
//   },
//   logging: false,
// });

// export default sequelize;

// export const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

