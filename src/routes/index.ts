import express from 'express';
import { isAuthenticated } from '../auth/authenticate';
import { addNewUserIngredient } from '../controllers/ingredients';
import { isAuthorized } from '../auth/authorized';

const router = express.Router();

router.post(
  '/ingredients/:id',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin', 'user'], allowSameUser: true }),
  addNewUserIngredient
);

export default router;
