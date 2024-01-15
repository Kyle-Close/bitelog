import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import Users from '../../models/user';
import Ingredient from '../../models/ingredients';
import UserIngredients from '../../models/joins/UserIngredients';
import {
  getUserIngredientInstanceByName,
  getGlobalIngredientInstanceByName,
  createGlobalIngredient,
} from './helpers';

export const getIngredients = asyncHandler(
  async (req: Request, res: Response) => {
    const ingredients = await Ingredient.findAll();
    if (ingredients) {
      res.status(200).json({
        msg: 'Successfully retrieved list of ingredients',
        ingredients,
      });
      return;
    } else {
      res.status(400).json({ err: 'Could not retrieve list of ingredients' });
      return;
    }
  }
);

export const getUserIngredients = asyncHandler(
  async (req: Request, res: Response) => {
    const ingredients: any = await Users.findByPk(res.locals.uid, {
      include: [
        {
          model: Ingredient,
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (ingredients) {
      const ingredientArray = ingredients.Ingredients;
      res.status(200).json({
        msg: 'Successfully retrieved user ingredients.',
        ingredients: ingredientArray,
      });
      return;
    } else {
      res.status(400).json({ err: 'Could not retrieve user ingredients.' });
      return;
    }
  }
);

export const createUserIngredient = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ingredient name must be between 2 & 50 characters.')
    .escape(),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ err: errors.array() });
      return;
    }

    const userId = res.locals.uid;
    const ingredientName = req.body.name;

    try {
      // Check if ingredient exists in users list
      const userIngredient = await getUserIngredientInstanceByName(
        userId,
        ingredientName
      );

      if (userIngredient) {
        res.status(400).json({
          err: `${ingredientName} already exists in user ingredient table`,
        });
        return;
      }

      // Check if ingredient exists in global table
      let globalIngredientInstance = await getGlobalIngredientInstanceByName(
        ingredientName
      );

      if (!globalIngredientInstance) {
        // Add the ingredient to global table
        globalIngredientInstance = await createGlobalIngredient(ingredientName);

        if (!globalIngredientInstance) {
          res.status(400).json({ err: 'Error creating global ingredient.' });
        }
      }

      // res.locals.userInstance
      const userIngredientInstance = await UserIngredients.create({
        UserId: userId,
        IngredientId: globalIngredientInstance.dataValues.id,
      });

      if (!userIngredientInstance) {
        res.status(400).json({ msg: 'Error creating user ingredient.' });
        return;
      }

      res.status(201).json({
        msg: 'Successfully created user ingredient.',
        ingredientDataValues: userIngredientInstance.dataValues,
      });
      return;
    } catch (error) {
      res.status(500).json({ err: error });
      return;
    }
  }),
];

export const deleteUserIngredient = [
  param('ingredientId').isInt().withMessage('Ingredient ID must be an integer'),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ err: errors.array() });
      return;
    }

    const ingredientId = req.params.ingredientId;
    const userId = res.locals.uid;

    // Find the user instance
    const userInstance = (await Users.findByPk(userId)) as any;
    if (!userInstance) {
      res.status(404).json({ err: 'User not found' });
      return;
    }

    // Remove the ingredient from the user's list
    try {
      await userInstance.removeIngredient(ingredientId);
      res.status(200).json({ msg: 'Ingredient removed successfully' });
    } catch (error) {
      res.status(500).json({ err: 'Error removing ingredient from user' });
    }
  }),
];

export const deleteManyUserIngredient = [
  body('ingredientIds')
    .isArray({ min: 1 })
    .withMessage("Expected list of user ID's"),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ err: errors.array() });
      return;
    }

    const userId = res.locals.uid;
    const ingredientIdList = req.body.ingredientIds;

    // Find the user instance
    const userInstance = (await Users.findByPk(userId)) as any;
    if (!userInstance) {
      res.status(404).json({ err: 'User not found' });
      return;
    }

    // Remove the ingredient from the user's list
    try {
      await userInstance.removeIngredients(ingredientIdList);
      res.status(200).json({ msg: 'Ingredients removed successfully' });
    } catch (error) {
      res.status(500).json({ err: 'Error removing ingredients from user' });
    }
  }),
];
