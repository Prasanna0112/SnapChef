import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

// Load env variables
dotenv.config();

//Connect to mongoDB
connectDB();

//Middleware
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: '🍳 SnapChef API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
