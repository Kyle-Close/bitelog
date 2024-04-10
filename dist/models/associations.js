"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ingredients_1 = __importDefault(require("./ingredients"));
const journal_1 = __importDefault(require("./journal"));
const user_1 = __importDefault(require("./user"));
const eat_logs_1 = __importDefault(require("./eat_logs"));
const report_log_1 = __importDefault(require("./report_log"));
const db_1 = require("../db");
const user_food_1 = __importDefault(require("./user_food"));
const UserIngredients_1 = __importDefault(require("./joins/UserIngredients"));
const FoodIngredients_1 = __importDefault(require("./joins/FoodIngredients"));
const EatLogUserFoods_1 = __importDefault(require("./joins/EatLogUserFoods"));
const associations = () => {
    // Journal
    user_1.default.hasMany(journal_1.default);
    journal_1.default.belongsTo(user_1.default);
    // Eat_Logs
    eat_logs_1.default.belongsTo(journal_1.default);
    // Eat_Log_User_Foods
    eat_logs_1.default.belongsToMany(user_food_1.default, { through: EatLogUserFoods_1.default });
    user_food_1.default.belongsToMany(eat_logs_1.default, { through: EatLogUserFoods_1.default });
    // Report_Logs
    report_log_1.default.belongsTo(journal_1.default);
    // User_Foods
    user_food_1.default.belongsTo(user_1.default);
    // Food_Ingredients
    user_food_1.default.belongsToMany(ingredients_1.default, {
        through: FoodIngredients_1.default,
    });
    ingredients_1.default.belongsToMany(user_food_1.default, {
        through: FoodIngredients_1.default,
    });
    // User_Ingredients
    user_1.default.belongsToMany(ingredients_1.default, {
        through: UserIngredients_1.default,
    });
    ingredients_1.default.belongsToMany(user_1.default, {
        through: UserIngredients_1.default,
    });
    db_1.sequelize.sync();
};
exports.default = associations;
