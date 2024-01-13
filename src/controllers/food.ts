import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import Users from '../models/user';
import Ingredient from '../models/ingredient';
import {
  getUserIngredientIdList,
  verifyIngredientIdsInUserTable,
} from './ingredients';

export const createUserFood = [
  body('ingredientIds').isArray().isLength({ min: 1 }),
  body('ingredientIds.*').isInt(),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors });
      return;
    }

    const userIngredientIds = await getUserIngredientIdList(res.locals.uid);

    if (!userIngredientIds || userIngredientIds.length === 0) {
      res.status(400).json({ err: 'Error fetching user ingredients.' });
      return;
    }

    const isIngredientIdsValid = await verifyIngredientIdsInUserTable(
      userIngredientIds,
      req.body.ingredientIds
    );

    if (!isIngredientIdsValid) {
      res
        .status(400)
        .json({ err: 'Not all ids exist in user ingredient table.' });
      return;
    }

    return;
  }),
];
