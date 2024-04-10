"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const ReportLogs = db_1.sequelize.define('ReportLogs', {
    discomfortRating: {
        type: sequelize_1.DataTypes.ENUM,
        values: ['1', '2', '3', '4', '5'],
        allowNull: true,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    logTimestamp: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'ReportLogs',
});
exports.default = ReportLogs;
