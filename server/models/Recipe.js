import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
      },
    ],
    instructions: [
      {
        type: String,
      },
    ],
    cookingTime: {
      type: String,
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
