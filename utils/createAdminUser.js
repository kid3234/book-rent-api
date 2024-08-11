import sequelize from "../config/dbConnect.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";

export const createAdminUser = async () => {
  try {

    const adminCount = await User.count({ where: { role: "admin" } });

    if (adminCount === 0) {
  
        const hashedPassword = await bcrypt.hash("adminpassword", 10);
      await User.create({
        email: "admin@example.com",
        phone: "0912456789",
        location: "Admin Location",
        password: hashedPassword,
        role: "admin",
        status: true,
        approved: true,
      });



      console.log("Admin user created successfully.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}
