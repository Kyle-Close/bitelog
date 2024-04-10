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
exports.deleteUserFood = exports.updateUserFood = exports.createUserFood = exports.getManyFoodIngredients = exports.getFoodIngredients = exports.getUserFoodList = void 0;
const express_validator_1 = require("express-validator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_food_1 = __importDefault(require("../../models/user_food"));
const db_1 = require("../../db");
const helpers_1 = require("./helpers");
const helpers_2 = require("../ingredients/helpers");
const ingredients_1 = __importDefault(require("../../models/ingredients"));
// Returns list of user food instances.
exports.getUserFoodList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const includeIngredients = req.query.includeIngredients === 'true';
    try {
        let foodInstances = [];
        if (!includeIngredients) {
            foodInstances = yield user_food_1.default.findAll({
                where: { UserId: res.locals.uid },
            });
        }
        else {
            foodInstances = yield user_food_1.default.findAll({
                where: { UserId: res.locals.uid },
                include: ingredients_1.default,
            });
        }
        const foodDataValues = yield foodInstances.map((instance) => instance.dataValues);
        res.status(200).json({
            msg: 'Successfully retrieved user food list.',
            foodDataValues,
        });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err: 'Error retrieving user food list.' });
        return;
    }
}));
// Returns list of all ingredient data values for specified food
exports.getFoodIngredients = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user food exists
    const userFoodInstance = yield (0, helpers_1.getUserFoodInstanceById)(Number(req.params.foodId));
    if (!userFoodInstance) {
        res.status(400).json({ err: 'Error user food does not exist.' });
    }
    try {
        const ingredientsIdList = yield (0, helpers_1.getIngredientListByFoodId)(Number(req.params.foodId));
        // use the id list to get all the ingredient instances
        const ingredientInstances = yield (0, helpers_1.getIngredientInstancesByIds)(ingredientsIdList);
        const ingredientsDataValues = (0, helpers_1.extractDataValues)(ingredientInstances);
        res.status(200).json({
            msg: 'Successfully retrievied food ingredients.',
            ingredientsDataValues,
        });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
        return;
    }
}));
// Gets a list of all ingredients in a list of foods (food ids)
exports.getManyFoodIngredients = [
    (0, express_validator_1.body)('foodIds').isArray().isLength({ min: 1 }),
    (0, express_validator_1.body)('foodIds.*').isNumeric(),
    (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ err: errors.array() });
            return;
        }
        // use list of ids and get results
        const ingredientIdLists = yield (0, helpers_1.getManyIngredientListsByFoodIds)(req.body.foodIds);
        const promises = ingredientIdLists.map((foodIngredientIds) => (0, helpers_1.getIngredientInstancesByIds)(foodIngredientIds));
        const promiseResult = yield Promise.all(promises);
        const foodIngredients = promiseResult.map((model) => {
            return model.map((data) => data.dataValues);
        });
        res.status(200).json({
            msg: 'Successfully retrieved bulk food ingredients',
            foodIngredients,
        });
        return;
    })),
];
// Creates a user food entry when given a food name and ingredient list
exports.createUserFood = [
    (0, express_validator_1.body)('name')
        .isString()
        .isLength({ min: 1, max: 100 })
        .withMessage('Food name must be between 1 & 100 characters.'),
    (0, express_validator_1.body)('ingredientIds').isArray().isLength({ min: 1 }),
    (0, express_validator_1.body)('ingredientIds.*').isInt(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors });
            return;
        }
        const userId = res.locals.uid;
        const foodName = req.body.name;
        // Check if food name already exists in user table
        const foodExists = yield (0, helpers_1.getUserFoodByName)(foodName, userId);
        if (foodExists) {
            res
                .status(400)
                .json({ err: `Food '${req.body.name}' already exists in table` });
            return;
        }
        const userIngredientIds = yield (0, helpers_2.getUserIngredientIdList)(userId);
        if (!userIngredientIds || userIngredientIds.length === 0) {
            res.status(400).json({ err: 'Error fetching user ingredients.' });
            return;
        }
        const isIngredientIdsValid = yield (0, helpers_2.verifyIngredientIdsInUserTable)(userIngredientIds, req.body.ingredientIds);
        if (!isIngredientIdsValid) {
            res
                .status(400)
                .json({ err: 'Not all ids exist in user ingredient table.' });
            return;
        }
        // --- Start transaction ---
        const transaction = yield db_1.sequelize.transaction();
        try {
            // Insert single UserFood entry. Using userID and name.
            const userFoodsInstance = yield user_food_1.default.create({
                name: foodName,
                UserId: userId,
            }, { transaction });
            // Create array of food objects to insert into user_foods table
            const foodObjects = (0, helpers_1.createFoodIngredientsObjectsForInsertion)(req.body.ingredientIds, userFoodsInstance.dataValues.id);
            // Insert all ingredients into FoodIngredients.
            const foodIngredients = yield (0, helpers_1.insertManyFoodIngredients)(foodObjects, transaction);
            // Check the length of the retured array and send response
            if (!foodIngredients || foodIngredients.length === 0) {
                res.status(400).json({ err: 'Error creating bulk food ingredients.' });
                return;
            }
            // --- Execute Transaction ---
            yield transaction.commit();
            res.status(200).json({
                msg: 'Food successfully created.',
                foodDataValues: userFoodsInstance.dataValues,
            });
            return;
        }
        catch (err) {
            // --- Rollback Transaction ---
            yield transaction.rollback();
            console.log(console.log(`Rolled back transaction: ${err}`));
            res.status(400).json({ err });
            return;
        }
    })),
];
// Updates a user food entry when given a food id, food name, and ingredient list
exports.updateUserFood = [
    (0, express_validator_1.param)('foodId').isString().isNumeric(),
    (0, express_validator_1.body)('name')
        .isString()
        .isLength({ min: 1, max: 100 })
        .withMessage('Food name must be between 1 & 100 characters.'),
    (0, express_validator_1.body)('ingredientIds').isArray().isLength({ min: 1 }),
    (0, express_validator_1.body)('ingredientIds.*').isInt(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors });
            return;
        }
        // Check if food name already exists in user table
        const foodExists = yield user_food_1.default.findByPk(req.params.foodId);
        if (!foodExists) {
            res.status(400).json({
                err: `Cannot update. '${req.body.name}' does not exist in user food table`,
            });
            return;
        }
        const userIngredientIds = yield (0, helpers_2.getUserIngredientIdList)(res.locals.uid);
        if (!userIngredientIds || userIngredientIds.length === 0) {
            res.status(400).json({ err: 'Error fetching user ingredients.' });
            return;
        }
        const isIngredientIdsValid = yield (0, helpers_2.verifyIngredientIdsInUserTable)(userIngredientIds, req.body.ingredientIds);
        if (!isIngredientIdsValid) {
            res
                .status(400)
                .json({ err: 'Not all ids exist in user ingredient table.' });
            return;
        }
        // --- Start transaction ---
        const transaction = yield db_1.sequelize.transaction();
        try {
            // Update single UserFood entry's name. Using userID and name.
            const userFoodsInstance = yield user_food_1.default.update({
                name: req.body.name,
                UserId: res.locals.uid,
            }, {
                transaction,
                returning: true,
                where: { UserId: res.locals.uid, id: Number(req.params.foodId) },
            });
            if (!userFoodsInstance) {
                res.status(400).json({ err: 'Error updating user food.' });
                return;
            }
            // Get a list of ingredient ids for the specified food (before update)
            const ingredientIdsInFoodList = yield (0, helpers_1.getIngredientListByFoodId)(Number(req.params.foodId));
            // Get a list of ingredient ids that will no longer be associated with this food
            const ingredientIdsToRemoveList = (0, helpers_1.getIngredientsToRemoveList)(ingredientIdsInFoodList, req.body.ingredientIds);
            // Remove the entries from foodIngredients table
            if (ingredientIdsToRemoveList.length > 0) {
                yield (0, helpers_1.removeManyFoodIngredients)(Number(req.params.foodId), ingredientIdsToRemoveList, transaction);
            }
            // Get list of new ingredients that need to be added to foodIngredients table
            const ingredientIdsToAddList = yield (0, helpers_1.getIngredientsToAddList)(ingredientIdsInFoodList, req.body.ingredientIds);
            // Create objects to be used for FoodIngredients insert
            const foodIngredientObjList = (0, helpers_1.createFoodIngredientsObjectsForInsertion)(ingredientIdsToAddList, Number(req.params.foodId));
            // Insert entries of new foodIngredients that did not previously exist
            yield (0, helpers_1.insertManyFoodIngredients)(foodIngredientObjList);
            // --- Execute Transaction ---
            yield transaction.commit();
            res.status(200).json({
                msg: 'Successfully updated user food.',
                foodDataValue: userFoodsInstance[1][0].dataValues,
            });
            return;
        }
        catch (err) {
            // --- Rollback Transaction ---
            yield transaction.rollback();
            console.log(console.log(`Rolled back transaction: ${err}`));
            res.status(400).json({ err });
            return;
        }
    })),
];
// Deletes a user food based on the user & food id - url
exports.deleteUserFood = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user food exists
    const foodExists = yield user_food_1.default.findByPk(req.params.foodId);
    if (!foodExists) {
        res.status(400).json({
            err: `Cannot delete. Food does not exist in user food table`,
        });
        return;
    }
    try {
        // Delete the UserFood entry
        yield (0, helpers_1.removeUserFood)(Number(req.params.foodId));
        res.status(200).json({ msg: 'Successfully deleted user food.' });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err: 'Error deleting user food.' });
        return;
    }
}));
