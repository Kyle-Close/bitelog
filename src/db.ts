import { Sequelize } from 'sequelize';

const user = process.env.DB_USER ? process.env.DB_USER : '';
const dbName = process.env.DB_DATABASE ? process.env.DB_DATABASE : '';
const pass = process.env.DB_PASS ? process.env.DB_PASS : '';

export const sequelize = new Sequelize(dbName, user, pass, {
  logging: console.log,
  host: process.env.DB_HOST,
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
