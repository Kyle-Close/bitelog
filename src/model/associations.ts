import Food from './food';
import Ingredient from './ingredient';
import Food_Ingredient from './food_ingredient';
import Journal from './journal';
import User from './user';

const associations = () => {
  // Food_Ingredients table
  Food.belongsToMany(Ingredient, { through: Food_Ingredient });
  Ingredient.belongsToMany(Food, { through: Food_Ingredient });

  // Journal table
  User.hasMany(Journal);
  Journal.belongsTo(User);
};

export default associations;
