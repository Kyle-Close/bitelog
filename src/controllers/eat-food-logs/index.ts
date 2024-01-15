import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';

export const createEatFoodEntry = [
  param('journalId').isNumeric(),
  body('foodIds').isArray().isLength({ min: 1 }),
  body('foodIds.*').isNumeric(),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ err: errors.array() });
      return;
    }

    // Check if food entry aleady exists.

    // Create array of objects. Used for inserting into EatFoodLogs
    // [{}]

    // --- Begin Transaction ---
    // Create journal entry
  }),
];
