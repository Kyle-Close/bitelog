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
    tableName: 'measurements',
    timestamps: false,
  }
);

export default Measurement;
