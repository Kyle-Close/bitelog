import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Measurement = sequelize.define(
  'Measurement',
  {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'Measurements',
    timestamps: false,
  }
);

export default Measurement;
