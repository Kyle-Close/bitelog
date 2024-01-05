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
//    - if does not exist, then ahgjdd it to the global table, then add it to user list

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
    const userIngredient = await Ingredient.findOne({
      where: { name: req.body.name },
      include: [
        {
          model: Users,
          where: { id: res.locals.uid },
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (userIngredient) {
      res.status(400).json({
        err: `${req.body.name} already exists in user ingredient table`,
      });
      return;
    }

    // Check if ingredient exists in global table
    /*     const globalIngredient = await Ingredient.findOne({
      where: { name: req.body.name },
    });

    if (!globalIngredient) {
      // Add the ingredient to global table
    } else {
      // Use the ingredient to add to user table
    } */
    res.send('Ingredient added successfully');
    return;
    // Note: No need to return the response object
  }
);
