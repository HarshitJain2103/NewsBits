import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Alert from "./alert";
import axios from 'axios';
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
  isBookmarked // ✅ Accept prop
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    setIsSaved(isBookmarked || false);
  }, [isBookmarked]);

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
            Authorization: `Bearer ${token}`
          }
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
            <button
              className="btn"
              onClick={handleBookmarkClick}
              style={{
                background: 'transparent',
                border: 'none',
                color: isSaved ? 'gold' : (isDarkMode ? '#ffffff' : '#000000'),
                fontSize: '1.4rem',
                paddingLeft: '0',
              }}
              title={isSaved ? "Remove Bookmark" : "Save Bookmark"}
            >
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
            </button>

            <a
              href={NewsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-dark rounded-pill"
              style={{
                color: !isDarkMode ? '#ffffff' : '#000000',
                backgroundColor: isDarkMode ? '#ffffff' : '#000000',
              }}
              onClick={() => handleReadMoreClick(article)} // Pass article data
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsItems;

