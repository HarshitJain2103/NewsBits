import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import History from '../models/history.js';

const router = express.Router();

// Save article to history
router.post('/save', authMiddleware, async (req, res) => {
  const { article } = req.body;

  if (!article || !article.url) {
    return res.status(400).json({ error: 'Article with URL is required' });
  }

  try {
    // Avoid duplicates: same user + same article URL
    const existing = await History.findOne({ 'article.url': article.url, user: req.user.id });

    if (!existing) {
      await History.create({ user: req.user.id, article });
    }

    res.status(200).json({ message: 'History saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save history' });
  }
});

// Get viewing history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id })
      .sort({ viewedAt: -1 }) // Most recent first
      .limit(100); // Optional: limit results

    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Clear all history — place this first!
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    await History.deleteMany({ user: req.user.id });
    res.status(200).json({ message: 'All history cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ message: 'Failed to clear history' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await History.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // Ensure only the user's own history can be deleted
    });

    if (!deleted) {
      return res.status(404).json({ message: 'History item not found or unauthorized' });
    }

    res.status(200).json({ message: 'History item deleted' });
  } catch (error) {
    console.error('Error deleting history item:', error);
    res.status(500).json({ message: 'Failed to delete history item' });
  }
});

export default router;
