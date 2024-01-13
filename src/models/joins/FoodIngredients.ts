import { sequelize } from '../../db';

const FoodIngredients = sequelize.define(
  'FoodIngredients',
  {},
  { timestamps: false }
);

export default FoodIngredients;
