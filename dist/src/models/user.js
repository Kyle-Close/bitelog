"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const sequelize_1 = require("sequelize");
const Users = db_1.sequelize.define('Users', {
    id: {
        type: sequelize_1.DataTypes.TEXT,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Users',
});
exports.default = Users;
