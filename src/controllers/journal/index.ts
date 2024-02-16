import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getUserJournalById } from './helpers';
import { body, validationResult } from 'express-validator';
import Journal from '../../models/journal';

// Middleware that verifies the url journal exists and attaches it to res.locals
export const attachUserJournalToResponse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const journalId = Number(req.params.journalId);

    try {
      const journal = await getUserJournalById(journalId);

      if (!journal) {
        res.status(400).json({ err: 'Error fetching journal data.' });
        return;
      }

      res.locals.journal = journal.dataValues;

      if (res.locals.journal.id !== Number(req.params.journalId)) {
        res.status(400).json({ err: 'Journal IDs do not match.' });
        return;
      }

      next();
    } catch (err) {
      res.status(400).json({ err });
      return;
    }
  }
);

// Gets a specific user journal by id and returns the journal data
export const sendUserJournalResponse = asyncHandler(
  async (req: Request, res: Response) => {
    const journal = res.locals.journal;

    if (!journal) {
      res.status(400).json({ err: 'Error fetching user journal' });
      return;
    }

    res
      .status(200)
      .json({ msg: 'Successfully retrieved user journal.', journal });
    return;
  }
);

// Gets all the journals associated with the user
export const getAllUserJournals = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.uid;
    try {
      const journalInstances = await Journal.findAll({
        where: { UserId: userId },
      });

      if (!journalInstances || journalInstances.length === 0) {
        res.status(400).json({ err: 'Error fetching user journals.' });
        return;
      }

      const journals = journalInstances.map((instance) => instance.dataValues);

      res
        .status(200)
        .json({ msg: 'Successfully retrieved user journals.', journals });
      return;
    } catch (err) {
      res.status(400).json({ err });
      return;
    }
  }
);

// Creates a user journal given a name
export const createUserJournal = [
  body('name')
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Journal name must be between 1 & 50 characters.'),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ err: errors.array() });
      return;
    }

    const userId = res.locals.uid;
    const journalName = req.body.name;

    try {
      const journal = await Journal.create({
        name: journalName,
        UserId: userId,
      });

      res
        .status(200)
        .json({ msg: 'Successfully created user journal.', journal });
      return;
    } catch (err) {
      res.status(400).json({ err });
      return;
    }
  }),
];

// Updates a user journal given a name
export const updateUserJournal = [
  body('name')
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Journal name must be between 1 & 50 characters.'),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ err: errors.array() });
      return;
    }

    const journalId = res.locals.journal.id;
    const journalName = req.body.name;

    try {
      const journalUpdate = await Journal.update(
        { name: journalName },
        { where: { id: journalId }, returning: true }
      );

      const journal = journalUpdate[1][0].dataValues;

      res
        .status(200)
        .json({ msg: 'Successfully updated user journal.', journal });
      return;
    } catch (err) {
      res.status(400).json({ err });
      return;
    }
  }),
];

// Delete a user journal by id
export const deleteUserJournal = asyncHandler(
  async (req: Request, res: Response) => {
    const journalId = res.locals.journal.id;

    try {
      await Journal.destroy({ where: { id: journalId } });

      res.status(200).json({ msg: 'Successfully deleted user journal.' });
      return;
    } catch (err) {
      res.status(400).json({ err });
      return;
    }
  }
);
