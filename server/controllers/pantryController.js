import Pantry from '../models/Pantry.js';

// helper — find or create pantry for user
const getOrCreatePantry = async (userId) => {
  let pantry = await Pantry.findOne({ user: userId }).populate(
    'user',
    'name email'
  );
  if (!pantry) {
    pantry = await Pantry.create({ user: userId, items: [] });
    pantry = await pantry.populate('user', 'name email');
  }
  return pantry;
};

// @desc  Add item(s) to pantry
// @route POST /api/pantry
// @access Private
export const addItems = async (req, res) => {
  try {
    const { items } = req.body;
    // items should be an array: [{name, quantity, unit, category}, ...]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: 'Please provide an array of items' });
    }

    const pantry = await getOrCreatePantry(req.user._id);

    pantry.items.push(...items);
    await pantry.save();

    res.status(201).json({
      message: 'Items added successfully',
      pantry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get user's pantry
// @route GET /api/pantry
// @access Private
export const getPantry = async (req, res) => {
  try {
    const pantry = await getOrCreatePantry(req.user._id);
    res.status(200).json(pantry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a single pantry item
// @route PUT /api/pantry/:itemId
// @access Private
export const updateItem = async (req, res) => {
  try {
    const pantry = await Pantry.findOne({ user: req.user._id }).populate(
      'user',
      'name email'
    );

    if (!pantry) {
      return res.status(404).json({ message: 'Pantry not found' });
    }

    const item = pantry.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // update only the fields provided
    const { name, quantity, unit, category } = req.body;
    if (name) item.name = name;
    if (quantity) item.quantity = quantity;
    if (unit) item.unit = unit;
    if (category) item.category = category;

    await pantry.save();

    res.status(200).json({
      message: 'Item updated successfully',
      pantry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a single pantry item
// @route DELETE /api/pantry/:itemId
// @access Private
export const deleteItem = async (req, res) => {
  try {
    const pantry = await Pantry.findOne({ user: req.user._id }).populate(
      'user',
      'name email'
    );

    if (!pantry) {
      return res.status(404).json({ message: 'Pantry not found' });
    }

    const item = pantry.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.deleteOne();
    await pantry.save();

    res.status(200).json({
      message: 'Item deleted successfully',
      pantry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
