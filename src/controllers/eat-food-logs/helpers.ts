import { Transaction } from 'sequelize';
import EatLogUserFoods from '../../models/joins/EatLogUserFoods';
import UserFoods from '../../models/user_food';
import EatLogs from '../../models/eat_logs';
import { Op } from 'sequelize';

type EatLogUserFoodObject = {
  EatLogId: number;
  UserFoodId: number;
  quantity: number;
};

export const getAllUserFoods = async (userId: string) => {
  try {
    return await UserFoods.findAll({
      where: { UserId: userId },
    });
  } catch (err) {
    throw err;
  }
};

export const getFoodIdsByEatLogId = async (
  userId: string,
  foodIds: number[],
  transaction?: Transaction
) => {
  try {
    return await EatLogs.findAll({
      where: { UserId: userId, FoodId: foodIds },
      transaction,
    });
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
      include: [UserFoods],
    });
  } catch (err) {
    throw err;
  }
};

export const getManyEatLogs = async (
  journalId: number,
  fromDate: Date,
  toDate: Date
) => {
  try {
    return await EatLogs.findAll({
      where: {
        JournalId: journalId,
        logTimestamp: { [Op.between]: [fromDate, toDate] },
      },
    });
  } catch (err) {
    throw err;
  }
};

export const getEatLogUserFoods = async (
  userFoodId: number,
  eatLogId: number
) => {
  try {
    return await EatLogUserFoods.findAll({
      where: { UserFoodId: userFoodId, EatLogId: eatLogId },
    });
  } catch (err) {
    throw err;
  }
};

export const updateJournalEatLogEntry = async (
  logId: number,
  journalId: number,
  notes: string,
  logTimestamp: string,
  transaction: Transaction
) => {
  try {
    return await EatLogs.update(
      {
        logTimestamp,
        notes,
      },
      {
        where: { id: logId, JournalId: journalId },
        transaction,
        returning: true,
      }
    );
  } catch (err) {
    throw err;
  }
};

export const getEatLogUserFoodInstances = async (eatLogId: number) => {
  try {
    return await EatLogUserFoods.findAll({
      where: { EatLogId: eatLogId },
    });
  } catch (err) {
    throw err;
  }
};

// Given a list of food ids and log id add them in bulk
export const insertManyEatLogUserFoods = async (
  eatLogUserFoods: EatLogUserFoodObject[],
  transaction?: Transaction
) => {
  try {
    return await EatLogUserFoods.bulkCreate(eatLogUserFoods, { transaction });
  } catch (err) {
    throw err;
  }
};

export const getEatLogUserFoodObjList = (
  eatLogId: number,
  foods: { id: number; quantity: number }[]
) => {
  return foods.map((food) => ({
    EatLogId: eatLogId,
    UserFoodId: food.id,
    quantity: food.quantity,
  }));
};

export const addQuantitiesToUserFoodIdList = (
  userFoodIds: number[],
  bodyFoodList: { id: number; quantity: number }[]
) => {
  return bodyFoodList.filter((food) => userFoodIds.includes(food.id));
};

// Given list of UserFood IDs & EatLog ID, delete them
export const deleteManyEatLogUserFoods = async (
  userFoodIds: number[],
  eatLogId: number,
  transaction?: Transaction
) => {
  try {
    return await EatLogUserFoods.destroy({
      where: { UserFoodId: userFoodIds, EatLogId: eatLogId },
      transaction,
    });
  } catch (err) {
    throw err;
  }
};
export function convertDateQueryParamToDate(from: string) {
  // input - 2024-02-11
  const parts = from.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

export function getFoodIdsThatUpdatedQuantity(
  originalFoodDataValues: {
    EatLogId: number;
    quantity: number;
    UserFoodId: number;
  }[],
  foods: { id: number; quantity: number }[]
) {
  const resultList: number[] = [];
  originalFoodDataValues.forEach((originalFood) => {
    const updatingFood = foods.find(
      (food) => food.id === originalFood.UserFoodId
    );
    if (!updatingFood) return;

    if (updatingFood.quantity !== originalFood.quantity)
      resultList.push(originalFood.UserFoodId);
  });
  return resultList;
}
