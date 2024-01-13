import { DataTypes } from 'sequelize';
import { sequelize } from '../../db';
import Users from '../user';
import Ingredient from '../ingredient';

const UserIngredients = sequelize.define('UserIngredients', {});

export default UserIngredients;
