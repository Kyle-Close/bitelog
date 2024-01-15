import express from 'express';
import { createEatFoodEntry } from '../controllers/eat-food-logs';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import { getUserJournal } from '../controllers/journal';

const eatLogRouter = express.Router();

eatLogRouter.post(
  '/user/:userId/journal/:journalId/eat_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  createEatFoodEntry
);

export { eatLogRouter };
