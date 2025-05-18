import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/user.js';
import Reaction from '../models/reaction.js';
const router = express.Router();

router.post('/save', authMiddleware, async (req, res) => {
  const { title, description, url, urlToImage, source, publishedAt } = req.body;

  try {
    const user = await User.findById(req.user.id);
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
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userId = req.user.id;
    const bookmarks = user.bookmarks;

    const bookmarksWithReactions = await Promise.all(
      bookmarks.map(async (article) => {
        const reaction = await Reaction.findOne({ newsUrl: article.url });

        const likes = reaction ? reaction.likedBy.length : 0;
        const dislikes = reaction ? reaction.dislikedBy.length : 0;
        const liked = reaction?.likedBy.includes(userId);
        const disliked = reaction?.dislikedBy.includes(userId);

        return {
          ...article.toObject(),
          reactions: {
            likes,
            dislikes,
            userReaction: liked ? 'like' : disliked ? 'dislike' : null,
          }
        };
      })
    );

    res.status(200).json(bookmarksWithReactions);
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