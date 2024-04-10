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
exports.getUserIngredientIdList = exports.verifyIngredientIdsInUserTable = exports.getGlobalIngredientInstanceByName = exports.createGlobalIngredient = exports.getUserIngredientInstanceByName = void 0;
const ingredients_1 = __importDefault(require("../../models/ingredients"));
const user_1 = __importDefault(require("../../models/user"));
const getUserIngredientInstanceByName = (uid, name) => __awaiter(void 0, void 0, void 0, function* () {
    const userIngredient = yield ingredients_1.default.findOne({
        where: { name: name },
        include: [
            {
                model: user_1.default,
                where: { id: uid },
                through: {
                    attributes: [],
                },
            },
        ],
    });
    return userIngredient;
});
exports.getUserIngredientInstanceByName = getUserIngredientInstanceByName;
const createGlobalIngredient = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const createdGlobalIngredient = yield ingredients_1.default.create({
        name: name,
    });
    return createdGlobalIngredient;
});
exports.createGlobalIngredient = createGlobalIngredient;
const getGlobalIngredientInstanceByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const globalIngredientInstance = yield ingredients_1.default.findOne({
        where: { name },
    });
    return globalIngredientInstance;
});
exports.getGlobalIngredientInstanceByName = getGlobalIngredientInstanceByName;
const verifyIngredientIdsInUserTable = (userIngredientIds, inputIngredientIds) => __awaiter(void 0, void 0, void 0, function* () {
    return inputIngredientIds.every((id) => userIngredientIds.includes(id));
});
exports.verifyIngredientIdsInUserTable = verifyIngredientIdsInUserTable;
const getUserIngredientIdList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Returns an array of ALL ingredient id's in users' ingredient table
    const userWithIngredientsObj = yield user_1.default.findByPk(userId, {
        include: [
            {
                model: ingredients_1.default,
                attributes: ['id'], // Only fetch the ingredient IDs
                through: {
                    attributes: [], // No need to fetch attributes from the join table
                },
            },
        ],
    });
    const ingredientIds = userWithIngredientsObj.Ingredients.map((data) => data.dataValues.id);
    return ingredientIds;
});
exports.getUserIngredientIdList = getUserIngredientIdList;
