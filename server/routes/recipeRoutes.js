import express from 'express';
import {
  suggestRecipes,
  saveRecipe,
  getSavedRecipes,
  deleteSavedRecipe,
} from '../controllers/recipeController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/suggest', protect, suggestRecipes);
router.post('/save', protect, saveRecipe);
router.get('/saved', protect, getSavedRecipes);
router.delete('/saved/:id', protect, deleteSavedRecipe);

export default router;
