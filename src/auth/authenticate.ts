import { NextFunction, Request, Response } from 'express';
import { extractJwtToken } from './helpers';
import * as admin from 'firebase-admin';

// This function pulls the incoming JWT token and validates it.
// This function also pulls the email, uid, and role and passes it along res.locals

async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tokenObj = extractJwtToken(req);
  if (!tokenObj.success) return res.status(401).send('Unauthorized');

  try {
    const decodedToken = await admin.auth().verifyIdToken(tokenObj.token);

    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: 'Unauthorized' });
  }
}

export { isAuthenticated };
