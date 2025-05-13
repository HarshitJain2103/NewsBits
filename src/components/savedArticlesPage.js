import React, { useEffect, useState } from 'react';
import NewsItems from './NewsItems';
import { FaRegBookmark } from 'react-icons/fa'; // Adding an icon for better appeal

function SavedArticlesPage({ user, isDarkMode }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    window.scrollTo(0, 0);
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/articles/saved', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch bookmarks');
        const data = await res.json();
        setBookmarks(data);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  if (!user) return <p className="text-center mt-4">Please log in to view your saved articles.</p>;
  if (loading) return <p className="text-center mt-4">Loading saved articles...</p>;
  if (bookmarks.length === 0) return (
    <div className="text-center mt-5">
      <div
        className="card mx-auto"
        style={{
          maxWidth: '500px',
          borderRadius: '24px',
          background: isDarkMode ? '#1e1e1e' : 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          padding: '40px 30px',
          boxShadow: isDarkMode ? '0 4px 12px rgba(232, 229, 229, 0.94)' : '0 4px 12px rgba(0, 0, 0, 0.25)',
          animation: 'fadeIn 0.8s ease-in-out',
          color: isDarkMode ? '#f1f1f1' : '#212529',
        }}
      >
        <div className="card-body">
          <div className="mb-4">
            <FaRegBookmark size={60} color={isDarkMode ? '#0d6efd' : '#0d6efd'} />
          </div>
          <h4
            className="card-title"
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: isDarkMode ? '#ffffff' : '#212529',
            }}
          >
            No Bookmarks Yet
          </h4>
          <p
            className="card-text mt-3"
            style={{ color: isDarkMode ? '#cccccc' : '#495057', fontSize: '16px' }}
          >
            You haven’t saved any articles yet. Explore the latest news and click the&nbsp;
            <FaRegBookmark size={16} color={isDarkMode ? '#0d6efd' : '#0d6efd'} />
            &nbsp;icon to bookmark your favorites.
          </p>
          <p
            className="card-text mt-2"
            style={{ color: isDarkMode ? '#888888' : '#6c757d', fontSize: '14px' }}
          >
            Bookmarked articles will appear here for quick access later.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Saved Articles</h2>
      <div className="row">
        {bookmarks.map((article, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <NewsItems
              title={article.title}
              description={article.description}
              imageUrl={article.urlToImage}
              NewsUrl={article.url}
              source={article.source}
              publishedAt={article.publishedAt}
              isDarkMode={isDarkMode}
              user={user}
              isBookmarked={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedArticlesPage;
