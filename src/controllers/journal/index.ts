import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getUserJournalByUserId } from './helpers';

export const getUserJournal = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const journal = await getUserJournalByUserId(res.locals.uid);

      if (!journal) {
        res.status(400).json({ err: 'Error fetching journal data.' });
        return;
      }

      res.locals.journal = journal.dataValues;
      next();
    } catch (err) {
      res.status(400).json({ err });
      return;
    }
  }
);
