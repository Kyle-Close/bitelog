import express from 'express';
import { ingredientRouter } from './ingredient';
import { foodRouter } from './food';
import { eatLogRouter } from './eatLogs';

const router = express.Router();

router.use(ingredientRouter);
router.use(foodRouter);
router.use(eatLogRouter);

export default router;
