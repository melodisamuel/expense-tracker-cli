import { Sequelize  } from "sequelize-typescript";
import  Expenses from './models/expenses.js'

const sequelize = new Sequelize({
    dialect: "mysql",
    host: "127.0.0.1",
    username: "root",
    password: "prismasql",
    database: "sys",
    models: [Expenses],
    logging: false,
})

// Sync models with the database
sequelize.sync({ force: true }).then(() => {
    console.log('Database synchronized successfully');
  }).catch((error) => {
    console.error('Error synchronizing database:', error);
  });
  
export default sequelize;