import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

// Save (bookmark) article
router.post('/save', authMiddleware, async (req, res) => {
  const { title, description, url, urlToImage, source, publishedAt } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Check if article is already bookmarked
    const alreadyBookmarked = user.bookmarks.some(article => article.url === url);
    if (alreadyBookmarked) {
      return res.status(400).json({ error: 'Article already bookmarked' });
    }

    user.bookmarks.push({ title, description, url, urlToImage, source, publishedAt });
    await user.save();

    res.status(201).json({ message: 'Article bookmarked successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to bookmark article' });
  }
});

// Get all saved bookmarks
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve bookmarks' });
  }
});

// Remove bookmarked article
router.delete('/remove', authMiddleware, async (req, res) => {
  const { url } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Filter out the article by URL
    const updatedBookmarks = user.bookmarks.filter(article => article.url !== url);
    user.bookmarks = updatedBookmarks;
    await user.save();

    res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

export default router;