"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const EatLogs = db_1.sequelize.define('EatLogs', {
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    logTimestamp: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'EatLogs',
});
exports.default = EatLogs;
