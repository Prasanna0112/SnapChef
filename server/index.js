import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

//Connect to mongoDB
connectDB();

//Middleware
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

//Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🍳 SnapChef API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
