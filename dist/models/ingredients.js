"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const Ingredients = db_1.sequelize.define('Ingredients', {
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    tableName: 'Ingredients',
});
exports.default = Ingredients;
