import { DataTypes } from 'sequelize';
import { sequelize } from '../../db';
import Users from '../user';
import Ingredient from '../ingredients';

const UserIngredients = sequelize.define('UserIngredients', {});

export default UserIngredients;
