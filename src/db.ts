import { Pool } from 'pg';
import fs from 'fs';

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync('./global-bundle.pem').toString(),
  },
});
