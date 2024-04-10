"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoodIdsThatUpdatedQuantity = exports.convertDateQueryParamToDate = exports.deleteManyEatLogUserFoods = exports.addQuantitiesToUserFoodIdList = exports.getEatLogUserFoodObjList = exports.insertManyEatLogUserFoods = exports.getEatLogUserFoodInstances = exports.updateJournalEatLogEntry = exports.getEatLogUserFoods = exports.getManyEatLogs = exports.getJournalEatLogInstanceById = exports.createEatLogUserFoodsObjects = exports.createManyEatLogUserFoodsEntries = exports.getFoodIdList = exports.getFoodIdsByEatLogId = exports.getAllUserFoods = void 0;
const EatLogUserFoods_1 = __importDefault(require("../../models/joins/EatLogUserFoods"));
const user_food_1 = __importDefault(require("../../models/user_food"));
const eat_logs_1 = __importDefault(require("../../models/eat_logs"));
const sequelize_1 = require("sequelize");
const getAllUserFoods = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_food_1.default.findAll({
            where: { UserId: userId },
        });
    }
    catch (err) {
        throw err;
    }
});
exports.getAllUserFoods = getAllUserFoods;
const getFoodIdsByEatLogId = (userId, foodIds, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield eat_logs_1.default.findAll({
            where: { UserId: userId, FoodId: foodIds },
            transaction,
        });
    }
    catch (err) {
        throw err;
    }
});
exports.getFoodIdsByEatLogId = getFoodIdsByEatLogId;
const getFoodIdList = (foods) => {
    return foods.map((food) => food.id);
};
exports.getFoodIdList = getFoodIdList;
const createManyEatLogUserFoodsEntries = (entries, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield EatLogUserFoods_1.default.bulkCreate(entries, { transaction });
    }
    catch (err) {
        throw err;
    }
});
exports.createManyEatLogUserFoodsEntries = createManyEatLogUserFoodsEntries;
const createEatLogUserFoodsObjects = (logId, foods) => __awaiter(void 0, void 0, void 0, function* () {
    return foods.map((food) => ({
        EatLogId: logId,
        UserFoodId: food.id,
        quantity: food.quantity,
    }));
});
exports.createEatLogUserFoodsObjects = createEatLogUserFoodsObjects;
const getJournalEatLogInstanceById = (logId, journalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield eat_logs_1.default.findOne({
            where: { id: logId, JournalId: journalId },
            include: [user_food_1.default],
        });
    }
    catch (err) {
        throw err;
    }
});
exports.getJournalEatLogInstanceById = getJournalEatLogInstanceById;
const getManyEatLogs = (journalId, fromDate, toDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield eat_logs_1.default.findAll({
            where: {
                JournalId: journalId,
                logTimestamp: { [sequelize_1.Op.between]: [fromDate, toDate] },
            },
        });
    }
    catch (err) {
        throw err;
    }
});
exports.getManyEatLogs = getManyEatLogs;
const getEatLogUserFoods = (userFoodId, eatLogId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield EatLogUserFoods_1.default.findAll({
            where: { UserFoodId: userFoodId, EatLogId: eatLogId },
        });
    }
    catch (err) {
        throw err;
    }
});
exports.getEatLogUserFoods = getEatLogUserFoods;
const updateJournalEatLogEntry = (logId, journalId, notes, logTimestamp, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield eat_logs_1.default.update({
            logTimestamp,
            notes,
        }, {
            where: { id: logId, JournalId: journalId },
            transaction,
            returning: true,
        });
    }
    catch (err) {
        throw err;
    }
});
exports.updateJournalEatLogEntry = updateJournalEatLogEntry;
const getEatLogUserFoodInstances = (eatLogId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield EatLogUserFoods_1.default.findAll({
            where: { EatLogId: eatLogId },
        });
    }
    catch (err) {
        throw err;
    }
});
exports.getEatLogUserFoodInstances = getEatLogUserFoodInstances;
// Given a list of food ids and log id add them in bulk
const insertManyEatLogUserFoods = (eatLogUserFoods, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield EatLogUserFoods_1.default.bulkCreate(eatLogUserFoods, { transaction });
    }
    catch (err) {
        throw err;
    }
});
exports.insertManyEatLogUserFoods = insertManyEatLogUserFoods;
const getEatLogUserFoodObjList = (eatLogId, foods) => {
    return foods.map((food) => ({
        EatLogId: eatLogId,
        UserFoodId: food.id,
        quantity: food.quantity,
    }));
};
exports.getEatLogUserFoodObjList = getEatLogUserFoodObjList;
const addQuantitiesToUserFoodIdList = (userFoodIds, bodyFoodList) => {
    return bodyFoodList.filter((food) => userFoodIds.includes(food.id));
};
exports.addQuantitiesToUserFoodIdList = addQuantitiesToUserFoodIdList;
// Given list of UserFood IDs & EatLog ID, delete them
const deleteManyEatLogUserFoods = (userFoodIds, eatLogId, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield EatLogUserFoods_1.default.destroy({
            where: { UserFoodId: userFoodIds, EatLogId: eatLogId },
            transaction,
        });
    }
    catch (err) {
        throw err;
    }
});
exports.deleteManyEatLogUserFoods = deleteManyEatLogUserFoods;
function convertDateQueryParamToDate(from) {
    // input - 2024-02-11
    const parts = from.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}
exports.convertDateQueryParamToDate = convertDateQueryParamToDate;
function getFoodIdsThatUpdatedQuantity(originalFoodDataValues, foods) {
    const resultList = [];
    originalFoodDataValues.forEach((originalFood) => {
        const updatingFood = foods.find((food) => food.id === originalFood.UserFoodId);
        if (!updatingFood)
            return;
        if (updatingFood.quantity !== originalFood.quantity)
            resultList.push(originalFood.UserFoodId);
    });
    return resultList;
}
exports.getFoodIdsThatUpdatedQuantity = getFoodIdsThatUpdatedQuantity;
