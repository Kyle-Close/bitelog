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

export const getIngredientsToRemoveList = (
  userIngredients: number[],
  updatedIngredients: number[]
) => {
  return userIngredients.filter((id) => !updatedIngredients.includes(id));
};

export const getIngredientListByFoodId = async (foodId: number) => {
  try {
    const ingredientInstances = await FoodIngredients.findAll({
      where: { UserFoodId: foodId },
    });

    return ingredientInstances.map(
      (instance) => instance.dataValues.IngredientId
    );
  } catch (err) {
    throw err;
  }
};

export const removeManyFoodIngredients = async (
  foodId: number,
  ingredientIdList: number[],
  transaction?: Transaction
) => {
  try {
    if (transaction) {
      await FoodIngredients.destroy({
        where: { UserFoodId: foodId, IngredientId: ingredientIdList },
        transaction,
      });
    } else {
      await FoodIngredients.destroy({
        where: { UserFoodId: foodId, IngredientId: ingredientIdList },
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getIngredientsToAddList = (
  userIngredients: number[],
  updatedIngredients: number[]
) => {
  return updatedIngredients.filter((id) => !userIngredients.includes(id));
};
