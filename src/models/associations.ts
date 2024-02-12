import Ingredient from './ingredients';
import Journal from './journal';
import Users from './user';
import EatLogs from './eat_logs';
import Measurement from './measurement';
import ReportLogs from './report_log';
import { sequelize } from '../db';
import UserFoods from './user_food';
import UserIngredients from './joins/UserIngredients';
import FoodIngredients from './joins/FoodIngredients';
import EatLogUserFoods from './joins/EatLogUserFoods';

const associations = () => {
  // Journal
  Users.hasMany(Journal);
  Journal.belongsTo(Users);

  // Eat_Logs
  EatLogs.belongsTo(Journal);

  // Eat_Log_User_Foods
  EatLogs.belongsToMany(UserFoods, { through: EatLogUserFoods });
  UserFoods.belongsToMany(EatLogs, { through: EatLogUserFoods });

  // Report_Logs
  ReportLogs.belongsTo(Journal);

  // User_Foods
  UserFoods.belongsTo(Users);

  // Food_Ingredients
  UserFoods.belongsToMany(Ingredient, {
    through: FoodIngredients,
  });
  Ingredient.belongsToMany(UserFoods, {
    through: FoodIngredients,
  });

  // User_Ingredients
  Users.belongsToMany(Ingredient, {
    through: UserIngredients,
  });

  Ingredient.belongsToMany(Users, {
    through: UserIngredients,
  });

  sequelize.sync({ force: true });
};

export default associations;
