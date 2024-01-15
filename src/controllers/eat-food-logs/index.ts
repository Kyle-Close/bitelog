import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import EatLogs from '../../models/eat_logs';
import {
  createEatLogUserFoodsObjects,
  createManyEatLogUserFoodsEntries,
  getFoodIdList,
  verifyUserFoodExist,
  getJournalEatLogInstanceById,
  getAllEatLogInstancesByJournalId,
} from './helpers';
import { sequelize } from '../../db';

// Returns a single EatLog entry given the id
export const getEatLog = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const eatLogId = Number(req.params.eatLogId);
    const journalId = res.locals.journal.id;

    try {
      const eatLogInstance = await getJournalEatLogInstanceById(
        eatLogId,
        journalId
      );
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
    } catch (err) {
      res.status(400).json({ err });
      return;
    }
  }
);

// Returns a list of ALL EatFood entries given the user ID / journal ID
export const getUserEatLogs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const journalId = res.locals.journal.id;

    try {
      const eatLogInstances = await getAllEatLogInstancesByJournalId(journalId);
      const eatLogDataValues = eatLogInstances.map(
        (instance) => instance.dataValues
      );

      res.status(200).json({
        msg: 'Successfully retrieved eat logs for specified journal',
        eatLogDataValues,
      });

      return;
    } catch (err) {
      res.status(400).json({ err });
      return;
    }
  }
);

// Creates a EatFood entry given a journal ID, food ID list, and notes (optional)
export const createEatLogEntry = [
  param('journalId').isNumeric(),
  body('notes').isString(),
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

    // Get list of food ids from body
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

// Updates a EatFood entry given log ID, journal ID, food ID list, and notes (optional)
export const updateEatLogEntry = [
  body('notes').isString(),
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

    // Get list of food ids from body
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
      // Update EatLog entry
      const eatLogInstance = await EatLogs.create({
        JournalId: journalId,
        notes,
      });

      // Get list of UserFood IDs to be removed from table

      // Remove them if needed

      // Get list of UserFood IDs to be added to table

      // Add them if needed

      // --- Commit Transaction ---
    } catch (err) {
      // --- Rollback Transaction ---
      await transaction.rollback();

      res.status(400).json({ err });
      return;
    }
  }),
];
