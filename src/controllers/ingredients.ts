import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import Users from '../models/user';
import Ingredient from '../models/ingredient';
import UserIngredients from '../models/joins/UserIngredients';

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

    try {
      // Check if ingredient exists in users list
      const userIngredient = await getUserIngredientInstanceByName(
        res.locals.uid,
        req.body.name
      );

      if (userIngredient) {
        res.status(400).json({
          err: `${req.body.name} already exists in user ingredient table`,
        });
        return;
      }

      // Check if ingredient exists in global table
      let globalIngredientInstance = await getGlobalIngredientInstance(req);

      if (!globalIngredientInstance) {
        // Add the ingredient to global table
        globalIngredientInstance = await createGlobalIngredient(req.body.name);

        if (!globalIngredientInstance) {
          res.status(400).json({ err: 'Error creating global ingredient.' });
        }
      }

      // Use the ingredient to add to user table
      const userInstance: any = await getUserInstance(res.locals.uid);
      // res.locals.userInstance
      console.log(
        '------------------------------------------------------------------------------------------------------'
      );
      const createUserIngredient = await UserIngredients.create({
        UserId: '8HY8LpUiAbc4wlR0ocp6PTA9s732',
        IngredientId: 40,
      });
      const createdIngredient = await userInstance.addIngredient(
        globalIngredientInstance
      );

      if (!createdIngredient) {
        res.status(400).json({ msg: 'Error creating user ingredient.' });
        return;
      }

      res.status(201).json({ msg: 'Successfully created user ingredient.' });
    } catch (error) {
      // Handle errors here
      res.status(500).json({ err: 'An error occurred.' });
    }
    return;
  }),
];

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

const getUserIngredientInstanceByName = async (uid: string, name: string) => {
  const userIngredient = await Ingredient.findOne({
    where: { name: name },
    include: [
      {
        model: Users,
        where: { id: uid },
        through: {
          attributes: [],
        },
      },
    ],
  });
  return userIngredient;
};

const createGlobalIngredient = async (name: string) => {
  const createdGlobalIngredient = await Ingredient.create({
    name: name,
  });

  return createdGlobalIngredient;
};

const getUserInstance = async (userId: string) => {
  const userInstance = await Users.findByPk(userId);
  return userInstance;
};

const getGlobalIngredientInstance = async (req: Request) => {
  const globalIngredientInstance = await Ingredient.findOne({
    where: { name: req.body.name },
  });
  return globalIngredientInstance;
};

export const verifyIngredientIdsInUserTable = async (
  userIngredientIds: number[],
  inputIngredientIds: number[]
) => {
  return inputIngredientIds.every((id) => userIngredientIds.includes(id));
};

export const getUserIngredientIdList = async (userId: string) => {
  // Returns an array of ALL ingredient id's in users' ingredient table
  const userWithIngredientsObj: any = await Users.findByPk(userId, {
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

  const ingredientIds: number[] = userWithIngredientsObj.Ingredients.map(
    (data: any) => data.dataValues.id
  );

  return ingredientIds;
};
