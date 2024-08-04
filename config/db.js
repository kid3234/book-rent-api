import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port:process.env.DB_PORT,
        dialect:'postgres'

    }
);



export default sequelize ;

// const connectDB = async()=>{
//     try{
//         await sequelize.authenticate();
//         console.log("Connection has been established successfuly.");
//     }catch(error){
//         console.log("Unable to connect to the database: ",error);
//     }
// };

// connectDB();