import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import {
  createUserFood,
  deleteUserFood,
  getUserFoodList,
  updateUserFood,
} from '../controllers/food';

const foodRouter = express.Router();

foodRouter.post(
  '/user/:userId/food',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  createUserFood
);

foodRouter.get(
  '/user/:userId/food',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserFoodList
);

foodRouter.put(
  '/user/:userId/food/:foodId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  updateUserFood
);

foodRouter.delete(
  '/user/:userId/food/:foodId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  deleteUserFood
);

export { foodRouter };
