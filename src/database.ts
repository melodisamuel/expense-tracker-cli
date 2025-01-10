import { Sequelize  } from "sequelize-typescript";

const sequelize = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "root",
    password: "password",
    database: "expense-tracker-cli",
    models: [__dirname + '/../models'],
    logging: false,
})

export default sequelize;