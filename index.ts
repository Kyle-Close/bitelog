import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { pool } from './src/db';

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.get('/test', async (req: Request, res: Response) => {
  try {
    const response = await pool.query('SELECT * FROM Users');
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
