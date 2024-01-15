import express from 'express';
import {
  createEatLogEntry,
  getEatLog,
  getUserEatLogs,
} from '../controllers/eat-food-logs';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import { getUserJournal } from '../controllers/journal';

const eatLogRouter = express.Router();

eatLogRouter.get(
  '/user/:userId/journal/:journalId/eat_logs/:eatLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  getEatLog
);

eatLogRouter.get(
  '/user/:userId/journal/:journalId/eat_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  getUserEatLogs
);

eatLogRouter.post(
  '/user/:userId/journal/:journalId/eat_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  createEatLogEntry
);

export { eatLogRouter };
