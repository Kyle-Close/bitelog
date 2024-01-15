import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import EatLogs from '../../models/eat_logs';
import {
  createEatLogUserFoodsObjects,
  createManyEatLogUserFoodsEntries,
  getFoodIdList,
  verifyUserFoodExist,
} from './helpers';
import { sequelize } from '../../db';

export const createEatFoodEntry = [
  param('journalId').isNumeric(),
  body('notes').isString().isLength({ min: 1, max: 1000 }),
  body('foods').isArray().isLength({ min: 1 }),
  body('foods.*.id').isNumeric(),
  body('foods.*.quantity').isInt(),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ err: errors.array() });
      return;
    }

    const userId = res.locals.uid;
    const journalId = res.locals.journal.id;
    const notes: string = req.body.notes;

    // Create list of food ids
    const foodIds: number[] = getFoodIdList(req.body.foods);

    // Check if all foods exist in UserFood table.
    const isUserFoodExist = await verifyUserFoodExist(foodIds, userId);

    if (!isUserFoodExist) {
      res.status(400).json({ err: 'Not all foods exist in user food table.' });
      return;
    }

    // --- Begin Transaction ---
    const transaction = await sequelize.transaction();

    try {
      // Create EatLog entry
      const eatLogInstance = await EatLogs.create({
        JournalId: journalId,
        notes,
      });

      // Create list of objects for creating log entries
      const entriesForInsertion = await createEatLogUserFoodsObjects(
        eatLogInstance.dataValues.id,
        req.body.foods
      );

      // Create EatLogUserFoods entries
      await createManyEatLogUserFoodsEntries(entriesForInsertion, transaction);

      // --- Commit Transaction ---
      await transaction.commit();

      res.status(200).json({
        msg: 'Successfully created eat food entry.',
        eatLogInstance: eatLogInstance.dataValues,
      });
      return;
    } catch (err) {
      // --- Rollback Transaction ---
      await transaction.rollback();

      console.log(err);
      res.status(400).json({ err });
      return;
    }
  }),
];
