import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import EatLogs from '../../models/eat_logs';
import {
  createEatLogUserFoodsObjects,
  createManyEatLogUserFoodsEntries,
  getFoodIdList,
  getJournalEatLogInstanceById,
  getAllEatLogInstancesByJournalId,
  updateJournalEatLogEntry,
  getAllUserFoods,
  getEatLogUserFoodInstances,
  insertManyEatLogUserFoods,
  getEatLogUserFoodObjList,
  addQuantitiesToUserFoodIdList,
  deleteManyEatLogUserFoods,
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

// Creates a EatLog entry given a journal ID, food ID list, and notes (optional)
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

    // Get list of food ids to update to - from body
    const foodIds: number[] = getFoodIdList(req.body.foods);

    // Get list of all UserFood instances
    const userFoodInstances = await getAllUserFoods(userId);

    // Create list of UserFood IDs
    const userFoodIds = (await userFoodInstances).map(
      (instance) => instance.dataValues.id
    );

    // Check if all foods exist in UserFood table.
    const isUserFoodExist = foodIds.every((id) => userFoodIds.includes(id));

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
  body('foods').custom((value) => Array.isArray(value) && value.length > 0),
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
    const eatLogId = Number(req.params.eatLogId);
    const notes: string = req.body.notes;

    // Get list of food ids from body
    const postFoodIds: number[] = getFoodIdList(req.body.foods);

    // Get list of all UserFood instances
    const userFoodInstances = await getAllUserFoods(userId);

    // Create list of UserFood IDs
    const userFoodIds = (await userFoodInstances).map(
      (instance) => instance.dataValues.id
    );

    // Check if all foods exist in UserFood table.
    const isUserFoodExist = postFoodIds.every((id) => userFoodIds.includes(id));

    if (!isUserFoodExist) {
      res.status(400).json({ err: 'Not all foods exist in user food table.' });
      return;
    }

    // Get current EatLogUserFoods instances based on UserFoodId + EatLogId
    const preLogUserFoodInstances = await getEatLogUserFoodInstances(eatLogId);

    const preLogUserFoodDataValues = preLogUserFoodInstances.map(
      (instance) => instance.dataValues
    );

    const preUserFoodIds = preLogUserFoodDataValues.map(
      (dataValue) => dataValue.UserFoodId
    );

    // Returns list of food ids that need to be added to EatLogUserFoods
    const userFoodIdsToAdd = postFoodIds.filter(
      (id) => !preUserFoodIds.includes(id)
    );

    // Returns a list food ids that need to be removed from EatLogUserFoods
    const userFoodIdsToRemove = preUserFoodIds.filter(
      (id) => !postFoodIds.includes(id)
    );

    // --- Begin Transaction ---
    const transaction = await sequelize.transaction();

    try {
      // Update EatLog entry
      const updateResponse = await updateJournalEatLogEntry(
        eatLogId,
        journalId,
        notes,
        transaction
      );

      if (userFoodIdsToAdd.length > 0) {
        // Bulk insert the missing EatLogUserFood entries
        const eatLogUserFoodObjList = getEatLogUserFoodObjList(
          eatLogId,
          addQuantitiesToUserFoodIdList(userFoodIdsToAdd, req.body.foods)
        );
        await insertManyEatLogUserFoods(eatLogUserFoodObjList, transaction);
      }

      if (userFoodIdsToRemove.length > 0) {
        // Remove all the entries with these ids
        await deleteManyEatLogUserFoods(
          userFoodIdsToRemove,
          eatLogId,
          transaction
        );
      }

      // --- Commit Transaction ---
      await transaction.commit();

      const eatLogDataValues = updateResponse[1][0].dataValues;

      res
        .status(200)
        .json({ msg: 'Successfully updated eat log entry.', eatLogDataValues });
      return;
    } catch (err) {
      // --- Rollback Transaction ---
      await transaction.rollback();

      res.status(400).json({ err });
      return;
    }
  }),
];

// Delete a EatLog entry based on ID
export const deleteEatLogEntry = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const journalId = res.locals.journal.id;
    const eatLogId = Number(req.params.eatLogId);

    try {
      await EatLogs.destroy({
        where: { id: eatLogId, JournalId: journalId },
      });

      res.status(200).json({ msg: 'Successfully deleted eat log entry.' });
      return;
    } catch (err) {
      console.log(err);

      res.status(400).json({ err });
      return;
    }
  }
);

// Delete many EatLog entry based on list of EatLog IDs
export const deleteManyEatLogEntries = [
  body('logIds').isArray().isLength({ min: 1 }),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const journalId = res.locals.journal.id;
    const eatLogIds = req.body.logIds;

    try {
      await EatLogs.destroy({
        where: { id: eatLogIds, JournalId: journalId },
      });

      res.status(200).json({ msg: 'Successfully deleted eat log entries.' });
      return;
    } catch (err) {
      console.log(err);

      res.status(400).json({ err });
      return;
    }
  }),
];
