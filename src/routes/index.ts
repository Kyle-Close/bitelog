import express, { Request, Response } from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { isAuthorized } from '../auth/authorized';
import { sequelize } from '../db';
import Ingredient from '../model/ingredient';

const router = express.Router();

router.get('/', isAuthenticated, (req: Request, res: Response) => {
  const a = async () => {
    try {
      const users = await Ingredient.findAll();
      console.log(users);
    } catch (error) {
      console.error(error);
    }
  };
  a();
  res.json({ msg: 'Welcome!' });
});

export default router;
