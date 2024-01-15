import { Transaction } from 'sequelize';
import EatLogUserFoods from '../../models/joins/EatLogUserFoods';
import UserFoods from '../../models/user_food';
import EatLogs from '../../models/eat_logs';

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

export const getJournalEatLogInstanceById = async (
  logId: number,
  journalId: number
) => {
  try {
    return await EatLogs.findOne({
      where: { id: logId, JournalId: journalId },
    });
  } catch (err) {
    throw err;
  }
};

export const getAllEatLogInstancesByJournalId = async (journalId: number) => {
  try {
    return await EatLogs.findAll({ where: { JournalId: journalId } });
  } catch (err) {
    throw err;
  }
};
