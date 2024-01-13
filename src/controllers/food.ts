import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import {
  getUserIngredientIdList,
  verifyIngredientIdsInUserTable,
} from './ingredients';
import Users from '../models/user';
import FoodIngredients from '../models/joins/FoodIngredients';
import UserFoods from '../models/user_food';

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

    // Insert single UserFood entry. Using userID and name.
    const userFoodsInstance = await UserFoods.create({
      name: req.body.name,
      UserId: res.locals.uid,
    });

    // Create array of food objects to insert into user_foods table
    const foodObjects = createFoodIngredientsObjectsForInsertion(
      req.body.ingredientIds,
      userFoodsInstance.dataValues.id
    );

    // Insert all ingredients into FoodIngredients.
    const foodIngredients = await createBulkFoodIngredients(foodObjects);

    // Check the length of the retured array and send response

    // TODO: Add a check near the start to see if food has already been created. Check the name
    // TODO: Make the above a transaction.
    // TODO: IF a food is deleted. Need to first delete all the entries in FoodIngredients table

    return;
  }),
];

const createFoodIngredientsObjectsForInsertion = (
  ingredientIdList: number[],
  foodId: number
) => {
  return ingredientIdList.map((id) => ({
    UserFoodId: foodId,
    IngredientId: id,
  }));
};

const createBulkFoodIngredients = async (foodIngredientsObjects: {}[]) => {
  try {
    return await FoodIngredients.bulkCreate(foodIngredientsObjects);
  } catch (err) {
    console.log(err);
  }
};
