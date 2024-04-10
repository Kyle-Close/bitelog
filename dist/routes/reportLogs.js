"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRouter = void 0;
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../auth/authenticate");
const authorized_1 = require("../auth/authorized");
const journal_1 = require("../controllers/journal");
const report_logs_1 = require("../controllers/report-logs");
const reportRouter = express_1.default.Router();
exports.reportRouter = reportRouter;
reportRouter.get('/user/:userId/journal/:journalId/report_logs/:reportLogId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, report_logs_1.getReportLog);
reportRouter.get('/user/:userId/journal/:journalId/report_logs', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, report_logs_1.getManyReportLogs);
reportRouter.post('/user/:userId/journal/:journalId/report_logs', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, report_logs_1.createReportLog);
reportRouter.put('/user/:userId/journal/:journalId/report_logs/:reportLogId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, report_logs_1.updateReportLog);
reportRouter.delete('/user/:userId/journal/:journalId/report_logs/:reportLogId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, report_logs_1.deleteReportLog);
