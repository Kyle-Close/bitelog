"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const user = process.env.DB_USER ? process.env.DB_USER : '';
const dbName = process.env.DB_DATABASE ? process.env.DB_DATABASE : '';
const pass = process.env.DB_PASS ? process.env.DB_PASS : '';
exports.sequelize = new sequelize_1.Sequelize(dbName, user, pass, {
    logging: false, //customLogger,
    logQueryParameters: true,
    host: process.env.DB_HOST,
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
function customLogger(queryString, queryObject) {
    console.log(queryString); // outputs a string
    console.log(queryObject.bind); // outputs an array
}
