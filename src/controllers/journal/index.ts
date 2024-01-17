import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getUserJournalByUserId } from './helpers';
import { body, validationResult } from 'express-validator';
import Journal from '../../models/journal';

export const attachUserJournalToResponse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const journal = await getUserJournalByUserId(res.locals.uid);

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
