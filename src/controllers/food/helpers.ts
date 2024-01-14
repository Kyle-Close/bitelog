import FoodIngredients from '../../models/joins/FoodIngredients';
import UserFoods from '../../models/user_food';
import { Transaction } from 'sequelize';

export const createFoodIngredientsObjectsForInsertion = (
  ingredientIdList: number[],
  foodId: number
) => {
  return ingredientIdList.map((id) => ({
    UserFoodId: foodId,
    IngredientId: id,
  }));
};

export const createBulkFoodIngredients = async (
  foodIngredientsObjects: {}[],
  transaction: Transaction
) => {
  try {
    return await FoodIngredients.bulkCreate(foodIngredientsObjects, {
      transaction,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUserFoodByName = async (name: string) => {
  return await UserFoods.findOne({
    where: { name },
  });
};
