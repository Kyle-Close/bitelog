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
exports.deleteManyUserIngredient = exports.deleteUserIngredient = exports.createUserIngredient = exports.getUserIngredients = exports.getIngredients = void 0;
const express_validator_1 = require("express-validator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_1 = __importDefault(require("../../models/user"));
const ingredients_1 = __importDefault(require("../../models/ingredients"));
const UserIngredients_1 = __importDefault(require("../../models/joins/UserIngredients"));
const helpers_1 = require("./helpers");
exports.getIngredients = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredients = yield ingredients_1.default.findAll();
    if (ingredients) {
        res.status(200).json({
            msg: 'Successfully retrieved list of ingredients',
            ingredients,
        });
        return;
    }
    else {
        res.status(400).json({ err: 'Could not retrieve list of ingredients' });
        return;
    }
}));
exports.getUserIngredients = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userWithIngredients = yield user_1.default.findOne({
        where: { id: res.locals.uid },
        include: [
            {
                model: ingredients_1.default,
                through: { attributes: [] },
            },
        ],
    });
    if (userWithIngredients) {
        const ingredients = userWithIngredients.Ingredients.map((ingredient) => ingredient.dataValues);
        res.status(200).json({
            msg: 'Successfully retrieved user ingredients.',
            ingredients,
        });
        return;
    }
    else {
        res.status(400).json({ err: 'Could not retrieve user ingredients.' });
        return;
    }
}));
exports.createUserIngredient = [
    (0, express_validator_1.body)('name')
        .isString()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Ingredient name must be between 2 & 50 characters.')
        .escape(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ err: errors.array() });
            return;
        }
        const userId = res.locals.uid;
        const ingredientName = req.body.name;
        try {
            // Check if ingredient exists in users list
            const userIngredient = yield (0, helpers_1.getUserIngredientInstanceByName)(userId, ingredientName);
            if (userIngredient) {
                res.status(400).json({
                    err: `${ingredientName} already exists in user ingredient table`,
                });
                return;
            }
            // Check if ingredient exists in global table
            let globalIngredientInstance = yield (0, helpers_1.getGlobalIngredientInstanceByName)(ingredientName);
            if (!globalIngredientInstance) {
                // Add the ingredient to global table
                globalIngredientInstance = yield (0, helpers_1.createGlobalIngredient)(ingredientName);
                if (!globalIngredientInstance) {
                    res.status(400).json({ err: 'Error creating global ingredient.' });
                }
            }
            // res.locals.userInstance
            const userIngredientInstance = yield UserIngredients_1.default.create({
                UserId: userId,
                IngredientId: globalIngredientInstance.dataValues.id,
            });
            if (!userIngredientInstance) {
                res.status(400).json({ msg: 'Error creating user ingredient.' });
                return;
            }
            res.status(201).json({
                msg: 'Successfully created user ingredient.',
                ingredientDataValues: userIngredientInstance.dataValues,
            });
            return;
        }
        catch (error) {
            res.status(500).json({ err: error });
            return;
        }
    })),
];
exports.deleteUserIngredient = [
    (0, express_validator_1.param)('ingredientId').isInt().withMessage('Ingredient ID must be an integer'),
    (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ err: errors.array() });
            return;
        }
        const ingredientId = req.params.ingredientId;
        const userId = res.locals.uid;
        // Find the user instance
        const userInstance = (yield user_1.default.findByPk(userId));
        if (!userInstance) {
            res.status(404).json({ err: 'User not found' });
            return;
        }
        // Remove the ingredient from the user's list
        try {
            yield userInstance.removeIngredient(ingredientId);
            res.status(200).json({ msg: 'Ingredient removed successfully' });
        }
        catch (error) {
            res.status(500).json({ err: 'Error removing ingredient from user' });
        }
    })),
];
exports.deleteManyUserIngredient = [
    (0, express_validator_1.body)('ingredientIds')
        .isArray({ min: 1 })
        .withMessage("Expected list of user ID's"),
    (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ err: errors.array() });
            return;
        }
        const userId = res.locals.uid;
        const ingredientIdList = req.body.ingredientIds;
        // Find the user instance
        const userInstance = (yield user_1.default.findByPk(userId));
        if (!userInstance) {
            res.status(404).json({ err: 'User not found' });
            return;
        }
        // Remove the ingredient from the user's list
        try {
            yield userInstance.removeIngredients(ingredientIdList);
            res.status(200).json({ msg: 'Ingredients removed successfully' });
        }
        catch (error) {
            res.status(500).json({ err: 'Error removing ingredients from user' });
        }
    })),
];
