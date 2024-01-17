import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import { attachUserJournalToResponse } from '../controllers/journal';
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
  attachUserJournalToResponse,
  getReportLog
);

reportRouter.get(
  '/user/:userId/journal/:journalId/report_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  getManyReportLogs
);

reportRouter.post(
  '/user/:userId/journal/:journalId/report_logs',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  createReportLog
);

reportRouter.put(
  '/user/:userId/journal/:journalId/report_logs/:reportLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  updateReportLog
);

reportRouter.delete(
  '/user/:userId/journal/:journalId/report_logs/:reportLogId',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
  attachUserJournalToResponse,
  deleteReportLog
);

export { reportRouter };
