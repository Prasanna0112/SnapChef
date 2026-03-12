import groq from '../config/groq.js';
import Pantry from '../models/Pantry.js';

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
    console.log('ingredients: ', ingredientList);

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
