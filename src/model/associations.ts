import Ingredient from './ingredient';
import Food_Ingredient from './food_ingredient';
import Journal from './journal';
import User from './user';
import Eat_Food_Log from './eat_food_log';
import Measurement from './measurement';
import Report_Log from './report_log';
import { sequelize } from '../db';
import User_food from './user_food';

const associations = () => {
  // Journal
  User.hasMany(Journal);
  Journal.belongsTo(User);

  // Eat_Food_Logs
  Eat_Food_Log.hasOne(Journal);
  Journal.hasMany(Eat_Food_Log);

  Eat_Food_Log.hasOne(User_food);
  User_food.hasMany(Eat_Food_Log);

  Eat_Food_Log.hasOne(Measurement);
  Measurement.hasMany(Eat_Food_Log);

  // Report_Logs
  Report_Log.hasOne(Journal);
  Journal.hasMany(Report_Log);

  // User_Foods
  User_food.belongsTo(User);
  User.hasMany(User_food);

  // Food_Ingredients
  User_food.belongsToMany(Ingredient, { through: Food_Ingredient });
  Ingredient.belongsToMany(User_food, { through: Food_Ingredient });

  sequelize.sync();
};

export default associations;
