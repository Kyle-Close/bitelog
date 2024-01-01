import dotenv from 'dotenv';
dotenv.config();
import * as admin from 'firebase-admin';
import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';

admin.initializeApp();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
