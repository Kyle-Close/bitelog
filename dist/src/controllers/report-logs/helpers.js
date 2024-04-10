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
exports.subtractHoursFromDate = exports.updateReportLogInstance = void 0;
const report_log_1 = __importDefault(require("../../models/report_log"));
const updateReportLogInstance = (logId, discomfortRating, notes, logTimestamp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!discomfortRating)
            discomfortRating = null;
        return yield report_log_1.default.update({
            logTimestamp,
            discomfortRating: discomfortRating,
            notes: notes,
        }, {
            where: {
                id: logId,
            },
            returning: true,
        });
    }
    catch (err) {
        throw err;
    }
});
exports.updateReportLogInstance = updateReportLogInstance;
// Given a date, returns a new date with the amount of hours subtracted
const subtractHoursFromDate = (hours, date) => {
    const MS_IN_MINUTE = 60000;
    const givenDateInMs = date.valueOf();
    const msToSubtract = hours * (MS_IN_MINUTE * 60);
    return new Date(givenDateInMs - msToSubtract);
};
exports.subtractHoursFromDate = subtractHoursFromDate;
