import express from 'express';
import { ingredientRouter } from './ingredient';
import { foodRouter } from './food';

const router = express.Router();

router.use(ingredientRouter);
router.use(foodRouter);

export default router;
