import express from 'express';
import { ingredientRouter } from './ingredient';

const router = express.Router();

router.use(ingredientRouter);

export default router;
