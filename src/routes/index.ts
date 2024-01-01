import express, { Request, Response } from 'express';
import { isAuthenticated } from '../auth/authenticate';

const router = express.Router();

router.get('/', isAuthenticated, (req: Request, res: Response) => {
  console.log(res.locals);
  res.json({ msg: 'Welcome!' });
});

export default router;
