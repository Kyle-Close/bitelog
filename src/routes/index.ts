import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import {
  createNewUserIngredient,
  deleteManyUserIngredient,
  deleteUserIngredient,
  getUserIngredients,
} from '../controllers/ingredients';
import { isAuthorized } from '../auth/authorized';

const router = express.Router();

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
  createNewUserIngredient
);

router.delete(
  '/user/:userId/ingredients',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  deleteManyUserIngredient
);

router.delete(
  '/user/:userId/ingredients/:ingredientId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  deleteUserIngredient
);

export default router;
