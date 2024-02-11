import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import ReportLogs from '../../models/report_log';
import { subtractHoursFromDate, updateReportLogInstance } from './helpers';
import { Op } from 'sequelize';
import { convertDateQueryParamToDate } from '../eat-food-logs/helpers';

// Return a single report log based on id provided in URL
export const getReportLog = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportLog = await ReportLogs.findByPk(req.params.reportLogId);

      if (!reportLog) {
        res.status(400).json({ err: 'Report log does not exist.' });
        return;
      }

      res
        .status(200)
        .json({ msg: 'Successfully retrieved report log.', reportLog });
      return;
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
      return;
    }
  }
);

// Get many report entries in journal based on query params
export const getManyReportLogs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const fromQuery = req.query.from as string; // YYYY-MM-DD
    const toQuery = req.query.to as string; // YYYY-MM-DD

    if (!fromQuery || !toQuery) {
      res
        .status(400)
        .json({ err: "Must send 'from' and 'to' dates as query params." });
      return;
    }

    const fromDate = convertDateQueryParamToDate(fromQuery);
    const toDate = convertDateQueryParamToDate(toQuery);

    try {
      const reportLogs = await ReportLogs.findAll({
        where: { createdAt: { [Op.between]: [fromDate, toDate] } },
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
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
      return;
    }
  }
);

// Create a single report log entry in journal for user.
export const createReportLog = [
  body('discomfortRating').exists().isString().isNumeric(),
  body('notes').exists().isString().isLength({ min: 1, max: 1000 }),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ err: errors.array() });
      return;
    }

    try {
      const reportLogInstance = await ReportLogs.create(
        {
          JournalId: res.locals.journal.id,
          discomfort_rating: req.body.discomfortRating,
          notes: req.body.notes,
        },
        { returning: true }
      );

      const reportLogDataValues = reportLogInstance.dataValues;

      res
        .status(200)
        .json({ msg: 'Successfully created report log.', reportLogDataValues });
      return;
    } catch (err) {
      console.log(err);

      res.status(400).json({ err });
      return;
    }
  }),
];

// Update a single report log entry in journal for user.
export const updateReportLog = [
  body('discomfortRating').exists().isString().isNumeric(),
  body('notes').exists().isString().isLength({ min: 1, max: 1000 }),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const logId = Number(req.params.reportLogId);
    const discomfortRating = req.body.discomfortRating;
    const notes = req.body.notes;

    if (!errors.isEmpty()) {
      res.status(400).json({ err: errors.array() });
      return;
    }

    try {
      const reportLogInstance = await updateReportLogInstance(
        logId,
        discomfortRating,
        notes
      );

      res
        .status(200)
        .json({ msg: 'Successfully created report log.', reportLogInstance });
      return;
    } catch (err) {
      console.log(err);

      res.status(400).json({ err });
      return;
    }
  }),
];

// Delete a single report log entry in journal for user
export const deleteReportLog = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ReportLogs.destroy({ where: { id: req.params.reportLogId } });

      res.status(200).json({ msg: 'Successfully deleted report log.' });
      return;
    } catch (err) {
      console.log(err);

      res.status(400).json({ err });
      return;
    }
  }
);
