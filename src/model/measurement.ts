import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Measurement = sequelize.define(
  'Measurement',
  {
    Full_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Abbreviation: {
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
