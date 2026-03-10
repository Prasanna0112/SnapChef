import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    preference: {
      dietType: {
        type: String,
        enum: ['veg', 'non-veg', 'vegan'],
        default: 'non-veg',
      },
      allergies: [String],
      cuisines: [String],
      calorieGoal: {
        type: Number,
        default: 2000,
      },
      proteinGoal: {
        type: Number,
        default: 50,
      },
    },
  },
  {
    timestamps: true,
  }
);

//Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
