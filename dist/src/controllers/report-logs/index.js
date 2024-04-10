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
exports.deleteReportLog = exports.updateReportLog = exports.createReportLog = exports.getManyReportLogs = exports.getReportLog = void 0;
const express_validator_1 = require("express-validator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const report_log_1 = __importDefault(require("../../models/report_log"));
const helpers_1 = require("./helpers");
const sequelize_1 = require("sequelize");
const helpers_2 = require("../eat-food-logs/helpers");
// Return a single report log based on id provided in URL
exports.getReportLog = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportLog = yield report_log_1.default.findByPk(req.params.reportLogId);
        if (!reportLog) {
            res.status(400).json({ err: 'Report log does not exist.' });
            return;
        }
        res
            .status(200)
            .json({ msg: 'Successfully retrieved report log.', reportLog });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
        return;
    }
}));
// Get many report entries in journal based on query params
exports.getManyReportLogs = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fromQuery = req.query.from; // YYYY-MM-DD
    const toQuery = req.query.to; // YYYY-MM-DD
    if (!fromQuery || !toQuery) {
        res
            .status(400)
            .json({ err: "Must send 'from' and 'to' dates as query params." });
        return;
    }
    const fromDate = (0, helpers_2.convertDateQueryParamToDate)(fromQuery);
    const toDate = (0, helpers_2.convertDateQueryParamToDate)(toQuery);
    try {
        const reportLogs = yield report_log_1.default.findAll({
            where: { logTimestamp: { [sequelize_1.Op.between]: [fromDate, toDate] } },
        });
        if (!reportLogs) {
            res.status(400).json({ err: 'Report log does not exist.' });
            return;
        }
        res.status(200).json({
            msg: `Successfully retrieved report logs between ${fromQuery} to ${toQuery}.`,
            reportLogs,
        });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
        return;
    }
}));
// Create a single report log entry in journal for user.
exports.createReportLog = [
    (0, express_validator_1.body)('discomfortRating').optional().isString().isNumeric(),
    (0, express_validator_1.body)('logTimestamp').isISO8601().withMessage('Must be a valid ISO8601 date'),
    (0, express_validator_1.body)('notes').exists().isString().isLength({ min: 1, max: 1000 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ err: errors.array() });
            return;
        }
        try {
            const reportLogInstance = yield report_log_1.default.create({
                JournalId: res.locals.journal.id,
                discomfortRating: req.body.discomfortRating || null,
                notes: req.body.notes,
                logTimestamp: req.body.logTimestamp,
            }, { returning: true });
            const reportLogDataValues = reportLogInstance.dataValues;
            res
                .status(200)
                .json({ msg: 'Successfully created report log.', reportLogDataValues });
            return;
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ err });
            return;
        }
    })),
];
// Update a single report log entry in journal for user.
exports.updateReportLog = [
    (0, express_validator_1.body)('logTimestamp').isISO8601().withMessage('Must be a valid ISO8601 date'),
    (0, express_validator_1.body)('discomfortRating').optional().isString().isNumeric(),
    (0, express_validator_1.body)('notes').exists().isString().isLength({ min: 1, max: 1000 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const logId = Number(req.params.reportLogId);
        const discomfortRating = req.body.discomfortRating;
        const notes = req.body.notes;
        const logTimestamp = req.body.logTimestamp;
        if (!errors.isEmpty()) {
            res.status(400).json({ err: errors.array() });
            return;
        }
        try {
            const reportLogInstance = yield (0, helpers_1.updateReportLogInstance)(logId, discomfortRating, notes, logTimestamp);
            res
                .status(200)
                .json({ msg: 'Successfully created report log.', reportLogInstance });
            return;
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ err });
            return;
        }
    })),
];
// Delete a single report log entry in journal for user
exports.deleteReportLog = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield report_log_1.default.destroy({ where: { id: req.params.reportLogId } });
        res.status(200).json({ msg: 'Successfully deleted report log.' });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
        return;
    }
}));
