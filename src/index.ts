import dotenv from 'dotenv';
dotenv.config();
import * as admin from 'firebase-admin';
import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';
import serviceAccount from '../bitelog-firebase.json';
import associations from './model/associations';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

associations(); // Setup all the necessary SQL associations

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
