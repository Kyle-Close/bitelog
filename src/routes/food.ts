import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import { createUserFood } from '../controllers/food';

const foodRouter = express.Router();

foodRouter.post(
  '/user/:userId/foods',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  createUserFood
);

export { foodRouter };
