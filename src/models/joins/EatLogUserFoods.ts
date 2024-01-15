import { DataTypes } from 'sequelize';
import { sequelize } from '../../db';

const EatLogUserFoods = sequelize.define(
  'EatLogUserFoods',
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

export default EatLogUserFoods;
