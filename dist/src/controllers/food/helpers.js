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
exports.extractDataValues = exports.getIngredientInstancesByIds = exports.removeUserFood = exports.getIngredientsToAddList = exports.removeManyFoodIngredients = exports.getManyIngredientListsByFoodIds = exports.getIngredientListByFoodId = exports.getIngredientsToRemoveList = exports.getUserFoodInstanceById = exports.getUserFoodByName = exports.insertManyFoodIngredients = exports.createFoodIngredientsObjectsForInsertion = void 0;
const ingredients_1 = __importDefault(require("../../models/ingredients"));
const FoodIngredients_1 = __importDefault(require("../../models/joins/FoodIngredients"));
const user_food_1 = __importDefault(require("../../models/user_food"));
const createFoodIngredientsObjectsForInsertion = (ingredientIdList, foodId) => {
    return ingredientIdList.map((id) => ({
        UserFoodId: foodId,
        IngredientId: id,
    }));
};
exports.createFoodIngredientsObjectsForInsertion = createFoodIngredientsObjectsForInsertion;
const insertManyFoodIngredients = (foodIngredientsObjects, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (transaction) {
            return yield FoodIngredients_1.default.bulkCreate(foodIngredientsObjects, {
                transaction,
            });
        }
        else {
            return yield FoodIngredients_1.default.bulkCreate(foodIngredientsObjects);
        }
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
exports.insertManyFoodIngredients = insertManyFoodIngredients;
const getUserFoodByName = (name, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_food_1.default.findOne({
        where: { name, UserId: userId },
    });
});
exports.getUserFoodByName = getUserFoodByName;
const getUserFoodInstanceById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_food_1.default.findOne({
        where: { id },
    });
});
exports.getUserFoodInstanceById = getUserFoodInstanceById;
const getIngredientsToRemoveList = (userIngredients, updatedIngredients) => {
    return userIngredients.filter((id) => !updatedIngredients.includes(id));
};
exports.getIngredientsToRemoveList = getIngredientsToRemoveList;
const getIngredientListByFoodId = (foodId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingredientInstances = yield FoodIngredients_1.default.findAll({
            where: { UserFoodId: foodId },
        });
        return ingredientInstances.map((instance) => instance.dataValues.IngredientId);
    }
    catch (err) {
        throw err;
    }
});
exports.getIngredientListByFoodId = getIngredientListByFoodId;
const getManyIngredientListsByFoodIds = (foodIds) => __awaiter(void 0, void 0, void 0, function* () {
    // use food ids to loop through and build arr of func calls for promise all
    const promises = foodIds.map((id) => (0, exports.getIngredientListByFoodId)(id));
    return yield Promise.all(promises);
});
exports.getManyIngredientListsByFoodIds = getManyIngredientListsByFoodIds;
const removeManyFoodIngredients = (foodId, ingredientIdList, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (transaction) {
            yield FoodIngredients_1.default.destroy({
                where: { UserFoodId: foodId, IngredientId: ingredientIdList },
                transaction,
            });
        }
        else {
            yield FoodIngredients_1.default.destroy({
                where: { UserFoodId: foodId, IngredientId: ingredientIdList },
            });
        }
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
exports.removeManyFoodIngredients = removeManyFoodIngredients;
const getIngredientsToAddList = (userIngredients, updatedIngredients) => {
    return updatedIngredients.filter((id) => !userIngredients.includes(id));
};
exports.getIngredientsToAddList = getIngredientsToAddList;
const removeUserFood = (foodId, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_food_1.default.destroy({ where: { id: foodId }, transaction });
    }
    catch (err) {
        throw err;
    }
});
exports.removeUserFood = removeUserFood;
const getIngredientInstancesByIds = (ingredientsIdList) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield ingredients_1.default.findAll({ where: { id: ingredientsIdList } });
    }
    catch (err) {
        throw err;
    }
});
exports.getIngredientInstancesByIds = getIngredientInstancesByIds;
const extractDataValues = (modelList) => {
    return modelList.map((model) => model.dataValues);
};
exports.extractDataValues = extractDataValues;
