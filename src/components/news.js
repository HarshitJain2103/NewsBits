import { useState, useEffect, useCallback, useMemo } from 'react';
import NewsItems from './NewsItems';
import Spinner from './spinner';
import PaginationBullets from './paginationBullets';

const News = ({ isDarkMode, user, searchQuery, pageSize }) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchQuery || '');
  const [totalResults, setTotalResults] = useState(0);
  const [savedArticles, setSavedArticles] = useState([]);
  const [reactionStats, setReactionStats] = useState({});
  const [shouldFetchReactions, setShouldFetchReactions] = useState(false);



  // Fetch news articles
  const fetchNews = useCallback(async () => {
  const baseUrl = '/.netlify/functions/getNews';
  const url = query
    ? `${baseUrl}?q=${query}&page=${page}&pageSize=${pageSize}`
    : `${baseUrl}?page=${page}&pageSize=${pageSize}`;

  setLoading(true);
  try {
    const response = await fetch(url);
    const data = await response.json();
    setArticles(data.articles || []);
    setTotalResults(data.totalResults || 0);
    setShouldFetchReactions(true);
  } catch (error) {
    console.error('Error fetching news:', error);
  } finally {
    setLoading(false);
  }
}, [query, page, pageSize]);


  // Fetch saved articles
  const fetchSavedArticles = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/saved/saved', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setSavedArticles(data);
      } else {
        console.log("Unexpected saved articles format:", data);
      }
    } catch (error) {
      console.error('Error fetching saved articles:', error);
    }
  }, []);

  // Fetch reactions for all articles
  const fetchReactionsForArticles = useCallback(async (articles) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newStats = {};

    await Promise.all(
      articles.map(async (article) => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/reactions/${encodeURIComponent(article.url)}/stats`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          newStats[article.url] = data;
        } catch (err) {
          console.error('Error fetching reaction stats:', err);
        }
      })
    );

    setReactionStats(newStats);
  }, []);

  const updateReactionStatsForUrl = (url, updatedData) => {
    setReactionStats(prevStats => ({
      ...prevStats,
      [url]: updatedData,
    }));
  };

  // Fetch news when query/page changes
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Fetch saved articles on user login
  useEffect(() => {
    if (user) {
      fetchSavedArticles();
    } else {
      setSavedArticles([]);
      setReactionStats({});
    }
  }, [user, fetchSavedArticles]);

  // NEW useEffect to fetch reaction stats only when articles change AND shouldFetchReactions is true
  useEffect(() => {
    if (user && articles.length > 0 && shouldFetchReactions) {
      fetchReactionsForArticles(articles);
      setShouldFetchReactions(false); 
    }
  }, [user, articles, shouldFetchReactions, fetchReactionsForArticles]);

  // Update query and reset page on searchQuery prop change
  useEffect(() => {
    setQuery(searchQuery || '');
    setPage(1);
  }, [searchQuery]);

  // Save article
  const saveArticleToBackend = async (article) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save articles.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/saved/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        await response.json();
        fetchSavedArticles();
      } else {
        const errorData = await response.json();
        console.error('Backend responded with:', errorData);
        alert('Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('An error occurred while saving.');
    }
  };

  const handlePrevClick = () => setPage((prevPage) => prevPage - 1);
  const handleNextClick = () => setPage((prevPage) => prevPage + 1);

  const savedUrls = useMemo(() => new Set(savedArticles.map((a) => a.url)), [savedArticles]);

  return (
    <div className="container my-5" style={{ paddingTop: '30px' }}>
      <h1 className="mt-2 pt-2">Top Headlines</h1>
      {loading && <Spinner />}
      <div className="row">
        {!loading &&
          articles.map((element) => (
            <div className="col-md-4" key={element.url}>
              <NewsItems
                title={element.title}
                description={element.description}
                imageUrl={element.urlToImage}
                NewsUrl={element.url}
                isDarkMode={isDarkMode}
                user={user}
                onSaveArticle={saveArticleToBackend}
                source={element.source}
                publishedAt={element.publishedAt}
                isBookmarked={savedUrls.has(element.url)}
                reactions={reactionStats[element.url] || { likes: 0, dislikes: 0, userReaction: null }}
                onReactionUpdate={updateReactionStatsForUrl}
              />
            </div>
          ))}
      </div>

      <div className="container d-flex justify-content-between my-5">
        <button
          disabled={page <= 1}
          onClick={handlePrevClick}
          className="btn btn-dark rounded-pill"
          style={{
            backgroundColor: isDarkMode ? '#ffffff' : '#000000',
            color: !isDarkMode ? '#ffffff' : '#000000',
            boxShadow: isDarkMode
              ? '0 4px 12px rgba(232, 229, 229, 0.4)'
              : '0 4px 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          &larr; Previous
        </button>

        {totalResults > 0 && pageSize > 0 && !loading && (
          <PaginationBullets
            currentPage={page}
            totalPages={Math.ceil(totalResults / pageSize)}
            onPageChange={(p) => setPage(p)}
            isDarkMode={isDarkMode}
          />
        )}

        <button
          disabled={page + 1 > Math.ceil(totalResults / pageSize)}
          onClick={handleNextClick}
          className="btn btn-dark rounded-pill"
          style={{
            backgroundColor: isDarkMode ? '#ffffff' : '#000000',
            color: !isDarkMode ? '#ffffff' : '#000000',
            boxShadow: isDarkMode
              ? '0 4px 12px rgba(232, 229, 229, 0.4)'
              : '0 4px 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export default News;
