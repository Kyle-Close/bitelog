import { Sequelize } from 'sequelize';

const user = process.env.DB_USER ? process.env.DB_USER : '';
const dbName = process.env.DB_DATABASE ? process.env.DB_DATABASE : '';
const pass = process.env.DB_PASS ? process.env.DB_PASS : '';

export const sequelize = new Sequelize(dbName, user, pass, {
  logging: customLogger,
  logQueryParameters: true,
  host: process.env.DB_HOST,
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

function customLogger(queryString: string, queryObject: any) {
  console.log(queryString); // outputs a string
  console.log(queryObject.bind); // outputs an array
}
