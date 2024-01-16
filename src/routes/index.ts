import express from 'express';
import { ingredientRouter } from './ingredient';
import { foodRouter } from './food';
import { eatLogRouter } from './eatLogs';
import { reportRouter } from './reportLogs';

const router = express.Router();

router.use(ingredientRouter);
router.use(foodRouter);
router.use(eatLogRouter);
router.use(reportRouter);

export default router;
