import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import ReportLogs from '../../models/report_log';

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
      const reportLogInstance = ReportLogs.create({
        JournalId: res.locals.journal.id,
        discomfort_rating: req.body.discomfortRating,
        notes: req.body.notes,
      });

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
