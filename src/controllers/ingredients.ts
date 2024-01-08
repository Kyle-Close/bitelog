import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import Users from '../models/user';
import Ingredient from '../models/ingredient';

export const createNewUserIngredient = asyncHandler(
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
    const globalIngredientInstance = await Ingredient.findOne({
      where: { name: req.body.name },
    });

    if (!globalIngredientInstance) {
      // Add the ingredient to global table
      const addedGlobalIngredient = await Ingredient.create({
        name: req.body.name,
      });

      if (addedGlobalIngredient) {
        const result = await addIngredientToUserTable(res, req);
        if (result) {
          res.status(201).json({
            msg: 'Ingredient added successfully',
            ingredient: result[0].dataValues,
          });
          return;
        } else {
          res
            .status(400)
            .json({ err: 'Could not complete insert into user table.' });
          return;
        }
      }
    } else {
      // Use the ingredient to add to user table
      const result = await addIngredientToUserTable(res, req);
      if (result) {
        res.status(201).json({
          msg: 'Ingredient added successfully',
          ingredient: result[0].dataValues,
        });
        return;
      } else {
        res
          .status(400)
          .json({ err: 'Could not complete insert into user table.' });
        return;
      }
    }
  }
);

export const getUserIngredients = asyncHandler(
  async (req: Request, res: Response) => {
    const ingredients = (await Users.findByPk(res.locals.uid, {
      include: [
        {
          model: Ingredient,
          through: {
            attributes: [],
          },
        },
      ],
    })) as any;

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

export const getIngredients = async (req: Request, res: Response) => {
  const ingredients = await Ingredient.findAll();
  if (ingredients) {
    res
      .status(200)
      .json({ msg: 'Successfully retrieved list of ingredients', ingredients });
    return;
  } else {
    res.status(400).json({ err: 'Could not retrieve list of ingredients' });
    return;
  }
};

export const deleteUserIngredient = asyncHandler(
  async (req: Request, res: Response) => {
    param('ingredientId').isInt().withMessage('User ID must be an integer');

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
  }
);

export const deleteManyUserIngredient = asyncHandler(
  async (req: Request, res: Response) => {
    body('ingredientIds')
      .isArray({ min: 1 })
      .withMessage("Expected list of user ID's");

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
  }
);

const addIngredientToUserTable = async (res: Response, req: Request) => {
  // Add the ingredient to the user ingredient table
  const UserInstance = (await Users.findByPk(res.locals.uid)) as any;

  const addedGlobalIngredientInstance = await Ingredient.findOne({
    where: { name: req.body.name },
  });

  const result = await UserInstance.addIngredient(
    addedGlobalIngredientInstance
  );

  return result;
};
