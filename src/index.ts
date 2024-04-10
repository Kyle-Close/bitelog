import dotenv from 'dotenv';
dotenv.config();
import * as admin from 'firebase-admin';
import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';
import associations from './models/associations';

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

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
