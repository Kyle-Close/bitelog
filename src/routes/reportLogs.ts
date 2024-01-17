import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import { getUserJournal } from '../controllers/journal';
import {
  createReportLog,
  deleteReportLog,
  getManyReportLogs,
  getReportLog,
  updateReportLog,
} from '../controllers/report-logs';

const reportRouter = express.Router();

reportRouter.get(
  '/user/:userId/journal/:journalId/report_logs/:reportLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  getReportLog
);

reportRouter.get(
  '/user/:userId/journal/:journalId/report_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  getManyReportLogs
);

reportRouter.post(
  '/user/:userId/journal/:journalId/report_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  createReportLog
);

reportRouter.put(
  '/user/:userId/journal/:journalId/report_logs/:reportLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  updateReportLog
);

reportRouter.delete(
  '/user/:userId/journal/:journalId/report_logs/:reportLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  getUserJournal,
  deleteReportLog
);

export { reportRouter };
