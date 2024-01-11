import express from 'express';
import {
  createUserIngredient,
  deleteManyUserIngredient,
  deleteUserIngredient,
  getIngredients,
  getUserIngredients,
} from '../controllers/ingredients';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';

const ingredientRouter = express.Router();

ingredientRouter.get('/ingredients', getIngredients);

ingredientRouter.get(
  '/user/:userId/ingredients',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserIngredients
);

ingredientRouter.post(
  '/user/:userId/ingredients',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  createUserIngredient
);

ingredientRouter.delete(
  '/user/:userId/ingredients/:ingredientId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  deleteUserIngredient
);

ingredientRouter.delete(
  '/user/:userId/ingredients',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  deleteManyUserIngredient
);

export { ingredientRouter };
