"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodRouter = void 0;
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../auth/authenticate");
const authorized_1 = require("../auth/authorized");
const food_1 = require("../controllers/food");
const foodRouter = express_1.default.Router();
exports.foodRouter = foodRouter;
foodRouter.get('/user/:userId/food', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), food_1.getUserFoodList);
foodRouter.get('/user/:userId/food/:foodId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), food_1.getFoodIngredients);
foodRouter.post('/user/:userId/food/bulk', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), food_1.getManyFoodIngredients);
foodRouter.post('/user/:userId/food', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), food_1.createUserFood);
foodRouter.put('/user/:userId/food/:foodId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), food_1.updateUserFood);
foodRouter.delete('/user/:userId/food/:foodId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), food_1.deleteUserFood);
