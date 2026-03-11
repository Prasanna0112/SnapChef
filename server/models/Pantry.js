import mongoose from 'mongoose';

const pantryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'other',
    },
  },
  {
    timestamps: true,
  }
);

const pantrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [pantryItemSchema],
  },
  {
    timestamps: true,
  }
);

const Pantry = mongoose.model('Pantry', pantrySchema);

export default Pantry;
