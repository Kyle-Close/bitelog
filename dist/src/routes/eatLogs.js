"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eatLogRouter = void 0;
const express_1 = __importDefault(require("express"));
const eat_food_logs_1 = require("../controllers/eat-food-logs");
const authenticate_1 = require("../auth/authenticate");
const authorized_1 = require("../auth/authorized");
const journal_1 = require("../controllers/journal");
const eatLogRouter = express_1.default.Router();
exports.eatLogRouter = eatLogRouter;
eatLogRouter.get('/user/:userId/journal/:journalId/eat_logs/:eatLogId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, eat_food_logs_1.getEatLog);
eatLogRouter.get('/user/:userId/journal/:journalId/eat_logs', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, eat_food_logs_1.getUserEatLogs);
eatLogRouter.post('/user/:userId/journal/:journalId/eat_logs', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, eat_food_logs_1.createEatLogEntry);
eatLogRouter.put('/user/:userId/journal/:journalId/eat_logs/:eatLogId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, eat_food_logs_1.updateEatLogEntry);
eatLogRouter.delete('/user/:userId/journal/:journalId/eat_logs/:eatLogId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, eat_food_logs_1.deleteEatLogEntry);
eatLogRouter.delete('/user/:userId/journal/:journalId/eat_logs', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, eat_food_logs_1.deleteManyEatLogEntries);
