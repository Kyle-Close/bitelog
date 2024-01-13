import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import {
  getUserIngredientIdList,
  verifyIngredientIdsInUserTable,
} from './ingredients';
import Users from '../models/user';

export const createUserFood = [
  body('name')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Food name must be between 1 & 100 characters.'),
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

    // Create array of food objects to insert into user_foods table
    const foodObjects = createFoodObjectsForInsertion(
      req.body.name,
      userIngredientIds
    );

    // Create food - all checks complete
    const foods = await createFoods(userIngredientIds);

    return;
  }),
];

const createFoodObjectsForInsertion = (
  name: string,
  ingredientIdList: number[]
) => {
  return ingredientIdList.map((id) => {
    const obj = { name };
  });
};

const createFoods = async (ingredientIds: number[]) => {
  //
  Users.bulkCreate([{}, {}]);
};
