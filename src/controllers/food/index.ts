import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import UserFoods from '../../models/user_food';
import { sequelize } from '../../db';
import {
  getUserFoodByName,
  createBulkFoodIngredients,
  createFoodIngredientsObjectsForInsertion,
  getIngredientListByFoodId,
  getIngredientsToRemoveList,
  removeManyFoodIngredients,
  getIngredientsToAddList,
} from './helpers';
import {
  getUserIngredientIdList,
  verifyIngredientIdsInUserTable,
} from '../ingredients/helpers';

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

    // Check if food name already exists in user table
    const foodExists = await getUserFoodByName(req.body.name);

    if (foodExists) {
      res
        .status(400)
        .json({ err: `Food '${req.body.name}' already exists in table` });
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

    // --- Start transaction ---
    const transaction = await sequelize.transaction();

    try {
      // Insert single UserFood entry. Using userID and name.
      const userFoodsInstance = await UserFoods.create(
        {
          name: req.body.name,
          UserId: res.locals.uid,
        },
        { transaction }
      );

      // Create array of food objects to insert into user_foods table
      const foodObjects = createFoodIngredientsObjectsForInsertion(
        req.body.ingredientIds,
        userFoodsInstance.dataValues.id
      );

      // Insert all ingredients into FoodIngredients.
      const foodIngredients = await createBulkFoodIngredients(
        foodObjects,
        transaction
      );

      // Check the length of the retured array and send response
      if (!foodIngredients || foodIngredients.length === 0) {
        res.status(400).json({ err: 'Error creating bulk food ingredients.' });
        return;
      }
      // --- Execute Transaction ---
      await transaction.commit();
    } catch (err) {
      // --- Rollback Transaction ---
      await transaction.rollback();

      console.log(console.log(`Rolled back transaction: ${err}`));
      res.status(400).json({ err });
      return;
    }

    // TODO: IF a food is deleted. Need to first delete all the entries in FoodIngredients table
    res.status(200).json({ msg: 'Food successfully created.' });
    return;
  }),
];

export const getUserFoodList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foodList = await UserFoods.findAll({
        where: { UserId: res.locals.uid },
      });
      res
        .status(200)
        .json({ msg: 'Successfully retrieved user food list.', foodList });
      return;
    } catch (err) {
      console.log(err);
      res.status(400).json({ err: 'Error retrieving user food list.' });
      return;
    }
  }
);

export const updateUserFood = [
  param('foodId').isString().isNumeric(),
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

    // Check if food name already exists in user table
    const foodExists = await UserFoods.findByPk(req.params.foodId);

    if (!foodExists) {
      res.status(400).json({
        err: `Cannot update. '${req.body.name}' does not exist in user food table`,
      });
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

    // --- Start transaction ---
    const transaction = await sequelize.transaction();

    try {
      // Update single UserFood entry's name. Using userID and name.
      const userFoodsInstance = await UserFoods.update(
        {
          name: req.body.name,
          UserId: res.locals.uid,
        },
        { transaction, where: { UserId: res.locals.uid } }
      );

      if (!userFoodsInstance) {
        res.status(400).json({ err: 'Error updating user food.' });
        return;
      }
      // Updating to [3, 6]

      // Get a list of ingredient ids for the specified food (before update)
      // [3, 4, 5]
      const ingredientIdsInFoodList = await getIngredientListByFoodId(
        Number(req.params.foodId)
      );

      // Get a list of ingredient ids that will no longer be associated with this food
      // [4, 5]
      const ingredientIdsToRemoveList = getIngredientsToRemoveList(
        ingredientIdsInFoodList,
        req.body.ingredientIds
      );

      // Remove the entries from foodIngredients table
      if (ingredientIdsToRemoveList.length > 0) {
        await removeManyFoodIngredients(
          Number(req.params.foodId),
          ingredientIdsToRemoveList,
          transaction
        );
      }

      // Get list of new ingredients that need to be added to foodIngredients table
      const ingredientIdsToAddList = await getIngredientsToAddList(
        ingredientIdsInFoodList,
        req.body.ingredientIds
      );
      // Insert entries of new foodIngredients that did not previously exist

      // --- Execute Transaction ---
      await transaction.commit();

      res.status(200).json({ msg: 'Successfully updated user food.' });
      return;
    } catch (err) {
      // --- Rollback Transaction ---
      await transaction.rollback();

      console.log(console.log(`Rolled back transaction: ${err}`));
      res.status(400).json({ err });
      return;
    }
  }),
];

// TODO: Document each endpoint. Expects in body, returns ?
