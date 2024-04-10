"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const UserIngredients = db_1.sequelize.define('UserIngredients', {});
exports.default = UserIngredients;
