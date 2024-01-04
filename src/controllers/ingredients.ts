/*
  Create: when a user wants to add an ingredient to their list but the value doesn't exist here
  Read: return list of all ingredients
  Update: don't allow
  Delete: don't allow
*/

import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { sequelize } from '../db';
import Users from '../models/user';
import Ingredient from '../models/ingredient';

// When a user attempts to add a ingredient

//  - check if user is logged in, if not, abort
//  - check if ingredient exists in their list
//    - if exists, no need to add it, abort
//  - check if ingredient exists in the global table
//    - if exists, then add the reference to the user list
//    - if does not exist, then add it to the global table, then add it to user list

export const addNewUserIngredient = asyncHandler(
  async (req: Request, res: Response) => {
    body('name')
      .isString()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Ingredient name must be between 2 & 50 characters.')
      .escape();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ err: errors.array() });
      return;
    }

    // Check if ingredient exists in users list
    const results = await Ingredient.findOne({
      where: { name: req.body.name },
      include: Users,
    });

    console.log(results?.dataValues);

    res.send('Ingredient added successfully');
    return;
    // Note: No need to return the response object
  }
);
