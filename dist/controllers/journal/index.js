"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserJournal = exports.updateUserJournal = exports.createUserJournal = exports.getAllUserJournals = exports.sendUserJournalResponse = exports.attachUserJournalToResponse = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const helpers_1 = require("./helpers");
const express_validator_1 = require("express-validator");
const journal_1 = __importDefault(require("../../models/journal"));
// Middleware that verifies the url journal exists and attaches it to res.locals
exports.attachUserJournalToResponse = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const journalId = Number(req.params.journalId);
    try {
        const journal = yield (0, helpers_1.getUserJournalById)(journalId);
        if (!journal) {
            res.status(400).json({ err: 'Error fetching journal data.' });
            return;
        }
        res.locals.journal = journal.dataValues;
        if (res.locals.journal.id !== Number(req.params.journalId)) {
            res.status(400).json({ err: 'Journal IDs do not match.' });
            return;
        }
        next();
    }
    catch (err) {
        res.status(400).json({ err });
        return;
    }
}));
// Gets a specific user journal by id and returns the journal data
exports.sendUserJournalResponse = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const journal = res.locals.journal;
    if (!journal) {
        res.status(400).json({ err: 'Error fetching user journal' });
        return;
    }
    res
        .status(200)
        .json({ msg: 'Successfully retrieved user journal.', journal });
    return;
}));
// Gets all the journals associated with the user
exports.getAllUserJournals = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.uid;
    try {
        const journalInstances = yield journal_1.default.findAll({
            where: { UserId: userId },
        });
        if (!journalInstances || journalInstances.length === 0) {
            res.status(400).json({ err: 'Error fetching user journals.' });
            return;
        }
        const journals = journalInstances.map((instance) => instance.dataValues);
        res
            .status(200)
            .json({ msg: 'Successfully retrieved user journals.', journals });
        return;
    }
    catch (err) {
        res.status(400).json({ err });
        return;
    }
}));
// Creates a user journal given a name
exports.createUserJournal = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 50 })
        .withMessage('Journal name must be between 1 & 50 characters.'),
    (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ err: errors.array() });
            return;
        }
        const userId = res.locals.uid;
        const journalName = req.body.name;
        try {
            const journal = yield journal_1.default.create({
                name: journalName,
                UserId: userId,
            });
            res
                .status(200)
                .json({ msg: 'Successfully created user journal.', journal });
            return;
        }
        catch (err) {
            res.status(400).json({ err });
            return;
        }
    })),
];
// Updates a user journal given a name
exports.updateUserJournal = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 50 })
        .withMessage('Journal name must be between 1 & 50 characters.'),
    (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ err: errors.array() });
            return;
        }
        const journalId = res.locals.journal.id;
        const journalName = req.body.name;
        try {
            const journalUpdate = yield journal_1.default.update({ name: journalName }, { where: { id: journalId }, returning: true });
            const journal = journalUpdate[1][0].dataValues;
            res
                .status(200)
                .json({ msg: 'Successfully updated user journal.', journal });
            return;
        }
        catch (err) {
            res.status(400).json({ err });
            return;
        }
    })),
];
// Delete a user journal by id
exports.deleteUserJournal = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const journalId = res.locals.journal.id;
    try {
        yield journal_1.default.destroy({ where: { id: journalId } });
        res.status(200).json({ msg: 'Successfully deleted user journal.' });
        return;
    }
    catch (err) {
        res.status(400).json({ err });
        return;
    }
}));
