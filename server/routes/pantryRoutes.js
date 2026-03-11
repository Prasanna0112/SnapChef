import express from 'express';
import {
  addItems,
  getPantry,
  updateItem,
  deleteItem,
} from '../controllers/pantryController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addItems).get(protect, getPantry);
router.route('/:itemId').put(protect, updateItem).delete(protect, deleteItem);

export default router;
