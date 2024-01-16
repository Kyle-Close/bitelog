import express from 'express';
import {
  createEatLogEntry,
  deleteEatLogEntry,
  deleteManyEatLogEntries,
  getEatLog,
  getUserEatLogs,
  updateEatLogEntry,
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

eatLogRouter.put(
  '/user/:userId/journal/:journalId/eat_logs/:eatLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  updateEatLogEntry
);

eatLogRouter.delete(
  '/user/:userId/journal/:journalId/eat_logs/:eatLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  deleteEatLogEntry
);

eatLogRouter.delete(
  '/user/:userId/journal/:journalId/eat_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  deleteManyEatLogEntries
);

export { eatLogRouter };
