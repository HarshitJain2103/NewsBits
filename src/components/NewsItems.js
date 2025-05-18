import { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import Alert from "./alert";
import axios from 'axios';
import confetti from 'canvas-confetti';
import './newsItems.css';
const NewsItems = ({
  title,
  description,
  imageUrl,
  NewsUrl,
  isDarkMode,
  user,
  onSaveArticle,
  source,
  publishedAt,
  isBookmarked,
  reactions,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(reactions.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(reactions.dislikes || 0);
  const [userReaction, setUserReaction] = useState(reactions.userReaction || null);

  useEffect(() => {
  setLikesCount(reactions.likes || 0);
  setDislikesCount(reactions.dislikes || 0);
  setUserReaction(reactions.userReaction || null);

  if (reactions.userReaction === 'like') {
    setLiked(true);
    setDisliked(false);
  } else if (reactions.userReaction === 'dislike') {
    setLiked(false);
    setDisliked(true);
  } else {
    setLiked(false);
    setDisliked(false);
  }

  setIsSaved(isBookmarked || false);
}, [reactions, isBookmarked]);


  const handleReadMoreClick = async (article) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('User not logged in — cannot save history.');
      return;
    }

    const articleData = {
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source,
    };

    try {
      console.log("Article being sent:", article);
      const response = await axios.post(
        'http://localhost:8000/api/history/save',
        { article: articleData },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('History saved response:', response.data);
    } catch (err) {
      console.error('Failed to save history!', err.response?.data || err.message);
    }
  };

  const handleBookmarkClick = async () => {
    if (!user) {
      setAlertMessage('Login/Signup to save articles!');
      return;
    }

    const articleData = {
      title,
      description,
      url: NewsUrl,
      urlToImage: imageUrl,
      source: source && source.id && source.name ? source : { id: 'Unknown', name: 'Unknown' },
      publishedAt: publishedAt || new Date().toISOString(),
    };

    setIsSaved(prev => !prev);

    const token = localStorage.getItem('token');

    if (!isSaved) {
      if (onSaveArticle) {
        onSaveArticle(articleData);
      }
    } else {
      try {
        const response = await fetch(`http://localhost:8000/api/saved/remove`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ url: NewsUrl }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error('Failed to delete:', result);
          alert('Failed to remove bookmark');
        }
      } catch (error) {
        console.error('Error removing bookmark:', error);
      }
    }
  };

  const article = {
    title,
    description,
    url: NewsUrl,
    urlToImage: imageUrl,
    source,
    publishedAt
  };

  const sendReaction = async (newsUrl, action, reactionType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAlertMessage('Login/Signup to react & see number of reactions!');
      return;
    }

    try {
      const endpoint = reactionType === 'like' 
        ? 'http://localhost:8000/api/reactions/like'
        : 'http://localhost:8000/api/reactions/dislike';

      const response = await axios.post(
        endpoint,
        { newsUrl, action },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`${reactionType.charAt(0).toUpperCase() + reactionType.slice(1)} reaction saved:`, response.data.message);
      return response.data.reaction; 
    } catch (error) {
      console.error(`Failed to save ${reactionType} reaction:`, error.response?.data || error.message);
      return null; 
    }
  };


const handleLike = async (newsUrl) => {
  const isLiking = !liked;
  if (isLiking && user) {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.5 },
    });
  }
  if(user){
    setLiked(isLiking);
    setDisliked(false);
    setUserReaction(isLiking ? 'like' : null);
    setLikesCount((count) => count + (isLiking ? 1 : -1));
  }
  
  if (disliked && isLiking) {
    setDislikesCount((count) => Math.max(count - 1, 0));
  }

  try {
    await sendReaction(newsUrl, isLiking ? 'like' : 'unlike', 'like');
  } catch (error) {
    // Revert UI on failure
    setLiked(!isLiking);
    if (isLiking) {
      setLikesCount((count) => Math.max(count - 1, 0));
      if (disliked) setDislikesCount((count) => count + 1);
      setDisliked(disliked);
    } else {
      setLikesCount((count) => count + 1);
    }
    setUserReaction(userReaction); // revert to previous state
    console.error('Failed to send like:', error);
  }
};

const handleDislike = async (newsUrl) => {
  const isDisliking = !disliked;

  if(user){
    setDisliked(isDisliking);
    setLiked(false);
    setDislikesCount((count) => count + (isDisliking ? 1 : -1));
    setUserReaction(isDisliking ? 'dislike' : null);
  }
  if (liked && isDisliking) {
    setLikesCount((count) => Math.max(count - 1, 0));
  }

  try {
    await sendReaction(newsUrl, isDisliking ? 'dislike' : 'undislike', 'dislike');
  } catch (error) {
    // Revert UI on failure
    setDisliked(!isDisliking);
    if (isDisliking) {
      setDislikesCount((count) => Math.max(count - 1, 0));
      if (liked) setLikesCount((count) => count + 1);
      setLiked(liked);
    } else {
      setDislikesCount((count) => count + 1);
    }
    setUserReaction(userReaction); // revert to previous state
    console.error('Failed to send dislike:', error);
  }
};

  return (
    <div className="my-3">
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage('')} />
      )}
      <div
        className="card d-flex flex-column animate__animated animate__fadeIn"
        style={{
          width: "18rem",
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
          height: "26rem",
          overflow: "hidden",
          boxShadow: isDarkMode ? '0 4px 12px rgba(232, 229, 229, 0.94)' : '0 4px 12px rgba(0, 0, 0, 0.25)',
          borderRadius: "10px",
          border: `1px solid ${isDarkMode ? '#ffffff' : '#000000'}`,
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          cursor: "pointer",
          position: "relative"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = isDarkMode ? '0 6px 18px rgba(232, 229, 229, 0.94)' : '0 6px 18px rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = isDarkMode ? '0 4px 12px rgba(232, 229, 229, 0.94)' : '0 4px 12px rgba(0, 0, 0, 0.25)';
        }}
      >
        {likesCount > 1 && (
          <div className="trending-badge">
            <span className="badge-icon">👑</span>
            Trending
          </div>
        )}
        <img
          src={imageUrl || "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"}
          className="card-img-top"
          alt="..."
          style={{ height: "180px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column">
          <h5
            className="card-title"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "3.6em",
              color: isDarkMode ? '#ffffff' : '#000000',
            }}
          >
            {title}
          </h5>
          <p
            className="card-text"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "3.6em",
              color: isDarkMode ? '#ffffff' : '#000000',
            }}
          >
            {description ? description : "Description not available!"}
          </p>

          <div className="d-flex justify-content-between align-items-center mt-auto">
            {/* Like and Dislike buttons */}
            <div className="d-flex">
              <button
                className={`btn ${userReaction === 'like' ? 'text-primary' : ''}`}
                onClick={() => { handleLike(NewsUrl); }}
                style={{
                  background: 'transparent',
                  color: isDarkMode ? '#ffffff' : '#000000',
                  border: 'none',
                  fontSize: '1.4rem',
                  padding: '0 5px',              
                  zIndex: 2,
                  marginRight: '5px',            
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Like"
              >
                <FaThumbsUp />
                <span style={{ marginLeft: '5px', fontSize: '1rem' }}>{likesCount}</span>
              </button>

              <button
                className={`btn ${userReaction === 'dislike' ? 'text-danger' : ''}`}
                onClick={() => { handleDislike(NewsUrl); }}
                style={{
                  background: 'transparent',
                  color: isDarkMode ? '#ffffff' : '#000000',
                  border: 'none',
                  fontSize: '1.4rem',
                  padding: '0 5px',             
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Dislike"
              >
                <FaThumbsDown />
                <span style={{ marginLeft: '5px', fontSize: '1rem' }}>{dislikesCount}</span>
              </button>
            </div>
            <a
              href={NewsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-dark rounded-pill"
              style={{
                color: !isDarkMode ? '#ffffff' : '#000000',
                backgroundColor: isDarkMode ? '#ffffff' : '#000000',
              }}
              onClick={() => handleReadMoreClick(article)}
            >
              Read More
            </a>
            <button
              className="btn"
              onClick={handleBookmarkClick}
              style={{
                background: 'transparent',
                border: 'none',
                color: isSaved ? 'gold' : (isDarkMode ? '#ffffff' : '#000000'),
                fontSize: '1.4rem',
                paddingLeft: 0,
                position: 'relative',
                top: '-3px',      
              }}
              title={isSaved ? "Remove Bookmark" : "Save Bookmark"}
            >
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsItems;