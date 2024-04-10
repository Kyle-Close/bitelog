"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../../db");
const EatLogUserFoods = db_1.sequelize.define('EatLogUserFoods', {
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, { timestamps: false });
exports.default = EatLogUserFoods;
