import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from 'express';
import authRoute from './routes/authRoute.js';
import savedArticlesRoutes from './routes/savedArticles.js';
import cors from 'cors';
import historyRoutes from './routes/historyRoute.js';
import reactionRoutes from './routes/reactionRoute.js'
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const startServer = async () => {
  await connectDB();
};

startServer();

app.use('/api/auth', authRoute);
app.use('/api/saved', savedArticlesRoutes);
app.use('/api/articles', savedArticlesRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/reactions', reactionRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
