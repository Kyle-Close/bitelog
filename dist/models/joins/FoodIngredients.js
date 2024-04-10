"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const FoodIngredients = db_1.sequelize.define('FoodIngredients', {}, { timestamps: false });
exports.default = FoodIngredients;
