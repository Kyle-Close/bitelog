import { Transaction } from 'sequelize';
import EatLogUserFoods from '../../models/joins/EatLogUserFoods';
import UserFoods from '../../models/user_food';

type EatLogUserFoodObject = {
  EatLogId: number;
  UserFoodId: number;
  quantity: number;
};

export const verifyUserFoodExist = async (
  foodIds: number[],
  userId: string
): Promise<boolean> => {
  try {
    const userFoods = await UserFoods.findAll({
      where: { id: foodIds, UserId: userId },
    });
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
    return await EatLogUserFoods.bulkCreate(entries, { transaction });
  } catch (err) {
    throw err;
  }
};

export const createEatLogUserFoodsObjects = async (
  logId: number,
  foods: { id: number; quantity: number }[]
) => {
  return foods.map((food) => ({
    EatLogId: logId,
    UserFoodId: food.id,
    quantity: food.quantity,
  }));
};
