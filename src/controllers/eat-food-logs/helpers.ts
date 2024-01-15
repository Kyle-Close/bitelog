import { Transaction } from 'sequelize';
import EatLogUserFoods from '../../models/joins/EatLogUserFoods';
import UserFoods from '../../models/user_food';

type EatLogUserFoodObject = {
  EatLogId: number;
  UserFoodId: number;
  quantity: number;
};

export const verifyUserFoodExist = async (
  foodIds: number[]
): Promise<boolean> => {
  try {
    const userFoods = await UserFoods.findAll({ where: { id: foodIds } });
    if (userFoods.length === foodIds.length) return true;
    else return false;
  } catch (err) {
    throw err;
  }
};

export const getFoodIdList = (foods: { id: number; quantity: number }[]) => {
  return foods.map((food) => food.id);
};

export const createManyEatLogUserFoodsEntries = async (
  entries: EatLogUserFoodObject[],
  transaction: Transaction
) => {
  try {
    await EatLogUserFoods.bulkCreate(entries, { transaction });
  } catch (err) {
    throw err;
  }
};
