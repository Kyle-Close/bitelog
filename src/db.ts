import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const sslCertPath = fs
  .readFileSync(path.join(__dirname, '../us-east-2-bundle.pem'), 'utf-8')
  .toString();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: 5432,
  ssl: false,
});
