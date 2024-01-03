import Ingredient from './ingredient';
import Food_Ingredient from './food_ingredient';
import Journal from './journal';
import User from './user';
import Eat_Food_Log from './eat_food_log';
import Measurement from './measurement';
import Report_Log from './report_log';
import { sequelize } from '../db';
import User_Food from './user_food';

const associations = () => {
  // Journal
  User.hasMany(Journal);
  Journal.belongsTo(User);

  // Eat_Food_Logs
  Eat_Food_Log.hasOne(Journal);
  Journal.hasMany(Eat_Food_Log);

  Eat_Food_Log.hasOne(User_Food);
  User_Food.hasMany(Eat_Food_Log);

  Eat_Food_Log.hasOne(Measurement);
  Measurement.hasMany(Eat_Food_Log);

  // Report_Logs
  Report_Log.hasOne(Journal);
  Journal.hasMany(Report_Log);

  // User_Foods
  User_Food.belongsTo(User);
  User.hasMany(User_Food);

  // Food_Ingredients
  User_Food.belongsToMany(Ingredient, { through: Food_Ingredient });
  Ingredient.belongsToMany(User_Food, { through: Food_Ingredient });

  sequelize.sync();
};

export default associations;
