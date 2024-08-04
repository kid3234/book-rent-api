import sequelize from "../config/db.js";
import User from "./user.js";
import Book from "./book.js";

sequelize.sync({force:false}).then(()=>{
    console.log('Database & table created');;
    
});

export default {User,Book}