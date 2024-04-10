"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ingredient_1 = require("./ingredient");
const food_1 = require("./food");
const eatLogs_1 = require("./eatLogs");
const reportLogs_1 = require("./reportLogs");
const journal_1 = require("./journal");
const router = express_1.default.Router();
router.use(ingredient_1.ingredientRouter);
router.use(food_1.foodRouter);
router.use(eatLogs_1.eatLogRouter);
router.use(reportLogs_1.reportRouter);
router.use(journal_1.journalRouter);
exports.default = router;
