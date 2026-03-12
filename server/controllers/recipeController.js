import groq from '../config/groq.js';
import Pantry from '../models/Pantry.js';
import Recipe from '../models/Recipe.js';

// @desc  Suggest recipes based on pantry ingredients
// @route POST /api/recipes/suggest
// @access Private
export const suggestRecipes = async (req, res) => {
  try {
    //get user's pantry
    const pantry = await Pantry.findOne({ user: req.user._id });

    if (!pantry || pantry.items.length === 0) {
      return res.status(400).json({
        message: 'Your pantry is empty. Please add some ingredients first.',
      });
    }

    //build ingredient list for prompt
    const ingredientList = pantry.items
      .map((item) => `${item.name} (${item.quantity} ${item.unit})`)
      .join(', ');

    //send to groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a helpful chef assistant. When given a list of ingredients, 
                    suggest 3 recipes. For each recipe provide:
                    - Recipe name
                    - List of required ingredients
                    - Step by step cooking instructions
                    - Estimated cooking time
                    Respond in JSON format only.`,
        },
        {
          role: 'user',
          content: `I have these ingredients in my pantry: ${ingredientList}. 
                    What recipes can I make?`,
        },
      ],
      response_format: {
        type: 'json_object',
      },
    });

    const recipes = JSON.parse(completion.choices[0].message.content);
    res.status(200).json({
      message: 'Recipes suggested successfully',
      recipes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Save a recipe
// @route POST /api/recipes/save
// @access Private
export const saveRecipe = async (req, res) => {
  try {
    const { name, ingredients, instructions, cookingTime } = req.body;

    if (!name || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Please provide recipe details' });
    }

    const recipe = await Recipe.create({
      user: req.user._id,
      name,
      ingredients,
      instructions,
      cookingTime,
    });

    res.status(201).json({
      message: 'Recipe saved successfully',
      recipe,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all saved recipes
// @route GET /api/recipes/saved
// @access Private
export const getSavedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a saved recipe
// @route DELETE /api/recipes/saved/:id
// @access Private
export const deleteSavedRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await recipe.deleteOne();

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
