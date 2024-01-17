import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import {
  attachUserJournalToResponse,
  createUserJournal,
  deleteUserJournal,
  getAllUserJournals,
  sendUserJournalResponse,
  updateUserJournal,
} from '../controllers/journal';

const journalRouter = express.Router();

journalRouter.get(
  '/user/:userId/journal',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getAllUserJournals
);

journalRouter.get(
  '/user/:userId/journal/:journalId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  sendUserJournalResponse
);

journalRouter.post(
  '/user/:userId/journal',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'] }),
  createUserJournal
);

journalRouter.patch(
  '/user/:userId/journal/:journalId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  updateUserJournal
);

journalRouter.delete(
  '/user/:userId/journal/:journalId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'] }),
  attachUserJournalToResponse,
  deleteUserJournal
);

export { journalRouter };
