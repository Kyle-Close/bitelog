import Ingredient from '../../models/ingredients';
import Users from '../../models/user';

export const getUserIngredientInstanceByName = async (
  uid: string,
  name: string
) => {
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

export const createGlobalIngredient = async (name: string) => {
  const createdGlobalIngredient = await Ingredient.create({
    name: name,
  });

  return createdGlobalIngredient;
};

export const getGlobalIngredientInstanceByName = async (name: string) => {
  const globalIngredientInstance = await Ingredient.findOne({
    where: { name },
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
