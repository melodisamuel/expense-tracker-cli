import { Sequelize } from "sequelize-typescript";
import Expense from "./models/expenses.js"; // ✅ Import your model
import dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "prismasql",
    database: process.env.DB_NAME || "mydb",
    logging: false,
    models: [Expense], // ✅ Register your model
});
// ✅ Sync database (use `alter: true` instead of `force: true`)
sequelize.sync({ alter: true })
    .then(() => console.log("Database synchronized successfully"))
    .catch((error) => console.error("Error synchronizing database:", error));
export { sequelize, Expense };
