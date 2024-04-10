"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const Measurement = db_1.sequelize.define('Measurement', {
    full_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    abbreviation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Measurements',
});
exports.default = Measurement;
