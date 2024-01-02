import express, { Request, Response } from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import { sequelize } from '../db';
import User from '../model/user';

const router = express.Router();

router.get('/', isAuthenticated, (req: Request, res: Response) => {
  //console.log(res.locals);
  const a = async () => {
    try {
      const users = await User.findAll();
      console.log(users);
    } catch (error) {
      console.error(error);
    }
  };
  a();
  res.json({ msg: 'Welcome!' });
});

export default router;
