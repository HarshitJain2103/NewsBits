import { useEffect, useState } from 'react';
import NewsItems from './NewsItems';
import { FaRegBookmark, FaArrowRight, FaArrowLeft } from 'react-icons/fa'; // Importing arrow icons

function SavedArticlesPage({ user, isDarkMode }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    if (!user) return;
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]); 

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

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = bookmarks.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const isNextDisabled = indexOfLastArticle >= bookmarks.length;
  const isPrevDisabled = currentPage === 1;

  return (
    <div className="container mt-4">
      <h2 className="mt-5" style={{paddingTop:"20px"}}>Saved Articles</h2>
      <div className="row">
        {currentArticles.map((article, index) => (
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
              reactions={article.reactions}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className={`btn ${!isDarkMode ? 'btn-dark' : 'btn-light'} ${isPrevDisabled ? 'disabled' : ''}`}
          onClick={() => paginate(currentPage - 1)}
          disabled={isPrevDisabled}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid transparent',
            background: !isDarkMode ? '#343a40' : '#f8f9fa',
            color: !isDarkMode ? '#ffffff' : '#212529',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Previous
        </button>
        <button
          className={`btn ${!isDarkMode ? 'btn-dark' : 'btn-light'} ${isNextDisabled ? 'disabled' : ''}`}
          onClick={() => paginate(currentPage + 1)}
          disabled={isNextDisabled}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid transparent',
            background: !isDarkMode ? '#343a40' : '#f8f9fa',
            color: !isDarkMode ? '#ffffff' : '#212529',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          Next
          <FaArrowRight style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </div>
  );
}

export default SavedArticlesPage;
