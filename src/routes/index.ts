import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import {
  createUserIngredient,
  deleteManyUserIngredient,
  deleteUserIngredient,
  getIngredients,
  getUserIngredients,
} from '../controllers/ingredients';
import { isAuthorized } from '../auth/authorized';

const router = express.Router();

router.get('/ingredients', getIngredients);

router.get(
  '/user/:userId/ingredients',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserIngredients
);

router.post(
  '/user/:userId/ingredients',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  createUserIngredient
);

router.delete(
  '/user/:userId/ingredients/:ingredientId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  deleteUserIngredient
);

router.delete(
  '/user/:userId/ingredients',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  deleteManyUserIngredient
);

export default router;
