import express from 'express';
import { suggestRecipes } from '../controllers/recipeController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/suggest', protect, suggestRecipes);

export default router;
