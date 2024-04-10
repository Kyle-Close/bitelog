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
exports.deleteManyEatLogEntries = exports.deleteEatLogEntry = exports.updateEatLogEntry = exports.createEatLogEntry = exports.getUserEatLogs = exports.getEatLog = void 0;
const express_validator_1 = require("express-validator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const eat_logs_1 = __importDefault(require("../../models/eat_logs"));
const helpers_1 = require("./helpers");
const db_1 = require("../../db");
const helpers_2 = require("./helpers");
// Returns a single EatLog entry given the id
exports.getEatLog = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const eatLogId = Number(req.params.eatLogId);
    const journalId = res.locals.journal.id;
    try {
        const eatLogInstance = yield (0, helpers_1.getJournalEatLogInstanceById)(eatLogId, journalId);
        if (!eatLogInstance) {
            res
                .status(400)
                .json({ err: 'Entry not found for the specified journal' });
            return;
        }
        const eatLogDataValues = eatLogInstance.dataValues;
        res
            .status(200)
            .json({ msg: 'Successfully retrieved eat log', eatLogDataValues });
        return;
    }
    catch (err) {
        res.status(400).json({ err });
        return;
    }
}));
// Returns a list of ALL EatFood entries given the user ID / journal ID
exports.getUserEatLogs = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const journalId = res.locals.journal.id;
    try {
        const eatLogInstances = yield (0, helpers_1.getManyEatLogs)(journalId, fromDate, toDate);
        const eatLogDataValues = eatLogInstances.map((instance) => instance.dataValues);
        res.status(200).json({
            msg: `Successfully retrieved eat logs between ${fromQuery} and ${toQuery}`,
            eatLogDataValues,
        });
        return;
    }
    catch (err) {
        res.status(400).json({ err });
        return;
    }
}));
// Creates a EatLog entry given a journal ID, food ID list, and notes (optional)
exports.createEatLogEntry = [
    (0, express_validator_1.param)('journalId').isNumeric(),
    (0, express_validator_1.body)('logTimestamp').isISO8601().withMessage('Must be a valid ISO8601 date'),
    (0, express_validator_1.body)('notes').isString(),
    (0, express_validator_1.body)('foods').isArray().isLength({ min: 1 }),
    (0, express_validator_1.body)('foods.*.id').isNumeric(),
    (0, express_validator_1.body)('foods.*.quantity').isInt(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ err: errors.array() });
            return;
        }
        const userId = res.locals.uid;
        const journalId = res.locals.journal.id;
        const notes = req.body.notes;
        const logTimestamp = req.body.logTimestamp;
        const foods = req.body.foods;
        if (!foods || foods.length < 1) {
            res.status(400).json({ err: 'Eat log must contain at least 1 food.' });
            return;
        }
        // Get list of food ids to update to - from body
        const foodIds = (0, helpers_1.getFoodIdList)(req.body.foods);
        // Get list of all UserFood instances
        const userFoodInstances = yield (0, helpers_1.getAllUserFoods)(userId);
        // Create list of UserFood IDs
        const userFoodIds = (yield userFoodInstances).map((instance) => instance.dataValues.id);
        // Check if all foods exist in UserFood table.
        const isUserFoodExist = foodIds.every((id) => userFoodIds.includes(id));
        if (!isUserFoodExist) {
            res.status(400).json({ err: 'Not all foods exist in user food table.' });
            return;
        }
        // --- Begin Transaction ---
        const transaction = yield db_1.sequelize.transaction();
        try {
            // Create EatLog entry
            const eatLogInstance = yield eat_logs_1.default.create({
                JournalId: journalId,
                notes,
                logTimestamp,
            });
            // Create list of objects for creating log entries
            const entriesForInsertion = yield (0, helpers_1.createEatLogUserFoodsObjects)(eatLogInstance.dataValues.id, req.body.foods);
            // Create EatLogUserFoods entries
            yield (0, helpers_1.createManyEatLogUserFoodsEntries)(entriesForInsertion, transaction);
            // --- Commit Transaction ---
            yield transaction.commit();
            res.status(200).json({
                msg: 'Successfully created eat food entry.',
                eatLogInstance: eatLogInstance.dataValues,
            });
            return;
        }
        catch (err) {
            // --- Rollback Transaction ---
            yield transaction.rollback();
            console.log(err);
            res.status(400).json({ err });
            return;
        }
    })),
];
// Updates a EatFood entry given log ID, journal ID, food ID list, and notes (optional)
exports.updateEatLogEntry = [
    (0, express_validator_1.body)('logTimestamp').isISO8601().withMessage('Must be a valid ISO8601 date'),
    (0, express_validator_1.body)('notes').isString(),
    (0, express_validator_1.body)('foods').custom((value) => Array.isArray(value) && value.length > 0),
    (0, express_validator_1.body)('foods.*.id').isNumeric(),
    (0, express_validator_1.body)('foods.*.quantity').isInt(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ err: errors.array() });
            return;
        }
        const logTimestamp = req.body.logTimestamp;
        const userId = res.locals.uid;
        const journalId = res.locals.journal.id;
        const eatLogId = Number(req.params.eatLogId);
        const notes = req.body.notes;
        const foods = req.body.foods;
        // Get list of food ids from body
        const postFoodIds = (0, helpers_1.getFoodIdList)(foods);
        // Get list of all UserFood instances
        const userFoodInstances = yield (0, helpers_1.getAllUserFoods)(userId);
        // Create list of UserFood IDs
        const userFoodIds = (yield userFoodInstances).map((instance) => instance.dataValues.id);
        // Check if all foods exist in UserFood table.
        const isUserFoodExist = postFoodIds.every((id) => userFoodIds.includes(id));
        if (!isUserFoodExist) {
            res.status(400).json({ err: 'Not all foods exist in user food table.' });
            return;
        }
        // Get current EatLogUserFoods instances based on UserFoodId + EatLogId
        const preLogUserFoodInstances = yield (0, helpers_1.getEatLogUserFoodInstances)(eatLogId);
        const preLogUserFoodDataValues = preLogUserFoodInstances.map((instance) => instance.dataValues);
        const preUserFoodIds = preLogUserFoodDataValues.map((dataValue) => dataValue.UserFoodId);
        // Returns list of food ids that were not previously in the log
        const userFoodIdsToAdd = postFoodIds.filter((id) => !preUserFoodIds.includes(id));
        // Returns list of any food ids that had their quantity changed
        const updatedQuantityUserFoodIds = (0, helpers_1.getFoodIdsThatUpdatedQuantity)(preLogUserFoodDataValues, foods);
        // Add list from last step to the list of ids to add
        userFoodIdsToAdd.push(...updatedQuantityUserFoodIds);
        // Returns a list food ids that need to be removed from EatLogUserFoods
        const userFoodIdsToRemove = preUserFoodIds.filter((id) => !postFoodIds.includes(id));
        // Add list of quantity change foods to ids to remove
        userFoodIdsToRemove.push(...updatedQuantityUserFoodIds);
        // --- Begin Transaction ---
        const transaction = yield db_1.sequelize.transaction();
        try {
            // Update EatLog entry
            const updateResponse = yield (0, helpers_1.updateJournalEatLogEntry)(eatLogId, journalId, notes, logTimestamp, transaction);
            if (userFoodIdsToRemove.length > 0) {
                // Remove all the entries with these ids
                yield (0, helpers_1.deleteManyEatLogUserFoods)(userFoodIdsToRemove, eatLogId, transaction);
            }
            if (userFoodIdsToAdd.length > 0) {
                // Bulk insert the missing EatLogUserFood entries
                const eatLogUserFoodObjList = (0, helpers_1.getEatLogUserFoodObjList)(eatLogId, (0, helpers_1.addQuantitiesToUserFoodIdList)(userFoodIdsToAdd, req.body.foods));
                yield (0, helpers_1.insertManyEatLogUserFoods)(eatLogUserFoodObjList, transaction);
            }
            // --- Commit Transaction ---
            yield transaction.commit();
            const eatLogDataValues = updateResponse[1][0].dataValues;
            res
                .status(200)
                .json({ msg: 'Successfully updated eat log entry.', eatLogDataValues });
            return;
        }
        catch (err) {
            // --- Rollback Transaction ---
            yield transaction.rollback();
            res.status(400).json({ err });
            return;
        }
    })),
];
// Delete a EatLog entry based on ID
exports.deleteEatLogEntry = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const journalId = res.locals.journal.id;
    const eatLogId = Number(req.params.eatLogId);
    try {
        yield eat_logs_1.default.destroy({
            where: { id: eatLogId, JournalId: journalId },
        });
        res.status(200).json({ msg: 'Successfully deleted eat log entry.' });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
        return;
    }
}));
// Delete many EatLog entry based on list of EatLog IDs
exports.deleteManyEatLogEntries = [
    (0, express_validator_1.body)('logIds').isArray().isLength({ min: 1 }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const journalId = res.locals.journal.id;
        const eatLogIds = req.body.logIds;
        try {
            yield eat_logs_1.default.destroy({
                where: { id: eatLogIds, JournalId: journalId },
            });
            res.status(200).json({ msg: 'Successfully deleted eat log entries.' });
            return;
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ err });
            return;
        }
    })),
];
