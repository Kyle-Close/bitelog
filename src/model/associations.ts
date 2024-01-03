import Ingredient from './ingredient';
import Journal from './journal';
import User from './user';
import EatFoodLogs from './eat_food_log';
import Measurement from './measurement';
import Report_Log from './report_log';
import { sequelize } from '../db';
import User_Food from './user_food';

const associations = () => {
  // Journal
  User.hasMany(Journal);
  Journal.belongsTo(User);

  // Eat_Food_Logs
  EatFoodLogs.hasOne(Journal);
  Journal.hasMany(EatFoodLogs);

  EatFoodLogs.hasOne(User_Food);
  User_Food.hasMany(EatFoodLogs);

  EatFoodLogs.hasOne(Measurement);
  Measurement.hasMany(EatFoodLogs);

  // Report_Logs
  Report_Log.hasOne(Journal);
  Journal.hasMany(Report_Log);

  // User_Foods
  User_Food.belongsTo(User);
  User.hasMany(User_Food);

  // Food_Ingredients
  User_Food.belongsToMany(Ingredient, {
    through: 'FoodIngredients',
    timestamps: false,
  });
  Ingredient.belongsToMany(User_Food, {
    through: 'FoodIngredients',
    timestamps: false,
  });

  // User_Ingredients
  User.belongsToMany(Ingredient, {
    through: 'UserIngredients',
    timestamps: false,
  });
  Ingredient.belongsToMany(User, {
    through: 'UserIngredients',
    timestamps: false,
  });

  sequelize.sync();
};

export default associations;
