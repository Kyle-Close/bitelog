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
import { attachUserJournalToResponse } from '../controllers/journal';

const eatLogRouter = express.Router();

eatLogRouter.get(
  '/user/:userId/journal/:journalId/eat_logs/:eatLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  getEatLog
);

eatLogRouter.get(
  '/user/:userId/journal/:journalId/eat_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  getUserEatLogs
);

eatLogRouter.post(
  '/user/:userId/journal/:journalId/eat_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  createEatLogEntry
);

eatLogRouter.put(
  '/user/:userId/journal/:journalId/eat_logs/:eatLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  updateEatLogEntry
);

eatLogRouter.delete(
  '/user/:userId/journal/:journalId/eat_logs/:eatLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  deleteEatLogEntry
);

eatLogRouter.delete(
  '/user/:userId/journal/:journalId/eat_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  deleteManyEatLogEntries
);

export { eatLogRouter };
