import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import Users from '../models/user';
import Ingredient from '../models/ingredient';

export const createUserFood = [
  body('ingredientIds').isArray().isLength({ min: 1 }),
  body('ingredientIds.*').isNumeric(),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors });
      return;
    }

    // Check if all ingredients in list exists in user ingredient table
    const userWithIngredients: any = await Users.findByPk(res.locals.uid, {
      include: [
        {
          model: Ingredient,
          attributes: ['id'], // Only fetch the ingredient IDs
          through: {
            attributes: [], // No need to fetch attributes from the join table
          },
        },
      ],
    });

    console.dir(userWithIngredients);

    if (!userWithIngredients) {
      res.status(400).json({ err: 'Error fetching user ingredients.' });
      return;
    }

    // .dataValues.id
    // Extract ingredient IDs
    const ingredientIds = userWithIngredients.Ingredients.map(
      (data: any) => data.dataValues.id
    );
    const isValid = ingredientIds.every((id: string) =>
      req.body.ingredientIds.includes(id)
    );

    console.log(isValid);
    if (isValid) {
      res.status(200).json({ msg: 'All valid' });
    } else {
      res
        .status(400)
        .json({ err: 'Not all ids exist in user ingredient table' });
    }
    return;
  }),
];
