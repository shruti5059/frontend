const { Sequelize } = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASES, process.env.USER_NAME, process.env.PASSWORDS, {
    dialect: "mysql",
    host: process.env.HOST_NAME,
    port: 3306,
});

module.exports={sequelize}