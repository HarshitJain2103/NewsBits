import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Reaction from '../models/reaction.js';

const router = express.Router();

router.post('/like', authMiddleware, async (req, res) => {
  const { newsUrl, action } = req.body; 

  if (!newsUrl || !action) {
    return res.status(400).json({ error: 'News URL and reaction action are required' });
  }

  try {
    let reaction = await Reaction.findOne({ newsUrl });

    if (!reaction) {
      reaction = await Reaction.create({
        newsUrl,
        likedBy: action === 'like' ? [req.user.id] : [],
        dislikedBy: [],
      });
    } else {
      const alreadyLiked = reaction.likedBy.includes(req.user.id);
      const alreadyDisliked = reaction.dislikedBy.includes(req.user.id);

      if (action === 'like') {
        if (!alreadyLiked) {
          reaction.likedBy.addToSet(req.user.id); 
          if (alreadyDisliked) reaction.dislikedBy.pull(req.user.id);
        }
      } else if (action === 'unlike') {
        if (alreadyLiked) {
          reaction.likedBy.pull(req.user.id); 
        }
      }

      await reaction.save();
    }

    res.status(200).json({
      success: true,
      message: action === 'like' ? 'Like added' : 'Like removed',
      reaction,
    });
  } catch (error) {
    console.error('Error processing like:', error);
    res.status(500).json({ error: 'Failed to save like reaction' });
  }
});

router.post('/dislike', authMiddleware, async (req, res) => {
  const { newsUrl, action } = req.body; 

  if (!newsUrl || !action) {
    return res.status(400).json({ error: 'News URL and reaction action are required' });
  }

  try {
    let reaction = await Reaction.findOne({ newsUrl });

    if (!reaction) {
      reaction = await Reaction.create({
        newsUrl,
        likedBy: [],
        dislikedBy: action === 'dislike' ? [req.user.id] : [],
      });
    } else {
      const alreadyLiked = reaction.likedBy.includes(req.user.id);
      const alreadyDisliked = reaction.dislikedBy.includes(req.user.id);

      if (action === 'dislike') {
        if (!alreadyDisliked) {
          reaction.dislikedBy.addToSet(req.user.id); 
          if (alreadyLiked) reaction.likedBy.pull(req.user.id); 
        }
      } else if (action === 'undislike') {
        if (alreadyDisliked) {
          reaction.dislikedBy.pull(req.user.id); 
        }
      }

      await reaction.save();
    }

    res.status(200).json({
      success: true,
      message: action === 'dislike' ? 'Dislike added' : 'Dislike removed',
      reaction,
    });
  } catch (error) {
    console.error('Error processing dislike:', error);
    res.status(500).json({ error: 'Failed to save dislike reaction' });
  }
});

router.get('/:newsUrl/stats', authMiddleware, async (req, res) => {
  const { newsUrl } = req.params;

  try {
    const reaction = await Reaction.findOne({ newsUrl });

    if (!reaction) {
      return res.status(200).json({
        likes: 0,
        dislikes: 0,
        userReaction: null,
      });
    }

    const userId = req.user.id;
    const liked = reaction.likedBy.includes(userId);
    const disliked = reaction.dislikedBy.includes(userId);

    res.status(200).json({
      likes: reaction.likedBy.length,
      dislikes: reaction.dislikedBy.length,
      userReaction: liked ? 'like' : disliked ? 'dislike' : null,
    });
  } catch (error) {
    console.error('Error fetching reaction stats:', error);
    res.status(500).json({ error: 'Failed to fetch reaction stats' });
  }
});


export default router;
