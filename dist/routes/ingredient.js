"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingredientRouter = void 0;
const express_1 = __importDefault(require("express"));
const ingredients_1 = require("../controllers/ingredients");
const authenticate_1 = require("../auth/authenticate");
const authorized_1 = require("../auth/authorized");
const ingredientRouter = express_1.default.Router();
exports.ingredientRouter = ingredientRouter;
ingredientRouter.get('/ingredients', ingredients_1.getIngredients);
ingredientRouter.get('/user/:userId/ingredients', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), ingredients_1.getUserIngredients);
ingredientRouter.post('/user/:userId/ingredients', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), ingredients_1.createUserIngredient);
ingredientRouter.delete('/user/:userId/ingredients/:ingredientId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), ingredients_1.deleteUserIngredient);
ingredientRouter.delete('/user/:userId/ingredients', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), ingredients_1.deleteManyUserIngredient);
