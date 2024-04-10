"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalRouter = void 0;
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../auth/authenticate");
const authorized_1 = require("../auth/authorized");
const journal_1 = require("../controllers/journal");
const journalRouter = express_1.default.Router();
exports.journalRouter = journalRouter;
journalRouter.get('/user/:userId/journal', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.getAllUserJournals);
journalRouter.get('/user/:userId/journal/:journalId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, journal_1.sendUserJournalResponse);
journalRouter.post('/user/:userId/journal', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'] }), journal_1.createUserJournal);
journalRouter.patch('/user/:userId/journal/:journalId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'], allowSameUser: true }), journal_1.attachUserJournalToResponse, journal_1.updateUserJournal);
journalRouter.delete('/user/:userId/journal/:journalId', authenticate_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ['admin'] }), journal_1.attachUserJournalToResponse, journal_1.deleteUserJournal);
