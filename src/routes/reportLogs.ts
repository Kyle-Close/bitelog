import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import { getUserJournal } from '../controllers/journal';
import { createReportLog } from '../controllers/report-logs';

const reportRouter = express.Router();

reportRouter.post(
  '/user/:userId/journal/:journalId/report_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  createReportLog
);

export { reportRouter };
