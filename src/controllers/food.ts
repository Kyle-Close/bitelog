import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';

export const createUserFood = [
  body('ingredientIds').isNumeric(),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors });
      return;
    }

    return;
  }),
];
