import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import {
  attachUserJournalToResponse,
  sendUserJournalResponse,
  updateUserJournal,
} from '../controllers/journal';

const journalRouter = express.Router();

journalRouter.get(
  '/user/:userId/journal/:journalId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  sendUserJournalResponse
);

journalRouter.patch(
  '/user/:userId/journal/:journalId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  updateUserJournal
);

export { journalRouter };
