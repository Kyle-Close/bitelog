import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import {
  createUserFood,
  getUserFoodList,
  updateUserFood,
} from '../controllers/food';

const foodRouter = express.Router();

foodRouter.post(
  '/user/:userId/foods',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  createUserFood
);

foodRouter.get(
  '/user/:userId/foods',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserFoodList
);

foodRouter.put(
  '/user/:userId/foods/:foodId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  updateUserFood
);

export { foodRouter };
