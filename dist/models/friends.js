"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("./user"));
const Friends = db_1.sequelize.define('Friends', {
    user1Id: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: user_1.default,
            key: 'id',
        },
    },
    user2Id: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: user_1.default,
            key: 'id',
        },
    },
}, {
    tableName: 'Friends',
});
exports.default = Friends;
