import Ingredient from './ingredient';
import Journal from './journal';
import Users from './user';
import EatFoodLogs from './eat_food_log';
import Measurement from './measurement';
import ReportLogs from './report_log';
import { sequelize } from '../db';
import UserFoods from './user_food';
import UserIngredients from './joins/UserIngredients';

const associations = () => {
  // Journal
  Users.hasMany(Journal);
  Journal.belongsTo(Users);

  // Eat_Food_Logs
  EatFoodLogs.belongsTo(Journal);
  EatFoodLogs.belongsTo(UserFoods);
  EatFoodLogs.belongsTo(Measurement);

  // Report_Logs
  ReportLogs.belongsTo(Journal);

  // User_Foods
  UserFoods.belongsTo(Users);

  // Food_Ingredients
  UserFoods.belongsToMany(Ingredient, {
    through: 'FoodIngredients',
    timestamps: false,
  });
  Ingredient.belongsToMany(UserFoods, {
    through: 'FoodIngredients',
    timestamps: false,
  });

  // User_Ingredients
  Users.belongsToMany(Ingredient, {
    through: UserIngredients,
  });
  Ingredient.belongsToMany(Users, {
    through: UserIngredients,
  });

  sequelize.sync();
};

export default associations;
