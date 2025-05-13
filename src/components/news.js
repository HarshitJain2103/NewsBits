import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

  const apiKey = '1664c6c53b5b458091fa62d2b49fae41';

  // Fetching news articles
  const fetchNews = useCallback(async () => {
    const baseUrl = 'https://newsapi.org/v2/';
    const url = query
      ? `${baseUrl}everything?q=${query}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
      : `${baseUrl}top-headlines?country=us&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;

    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setArticles(data.articles || []);
      setTotalResults(data.totalResults || 0);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, [query, page, pageSize]);

  // Fetching saved articles when the user is logged in
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
    console.log("Saved articles response:", data); // Shows the array directly

    if (Array.isArray(data)) {
      setSavedArticles(data);
      console.log("Updated saved articles:", data);
    } else {
      console.log("Unexpected saved articles format:", data);
    }
  } catch (error) {
    console.error('Error fetching saved articles:', error);
  }
}, []);


  // Refetch news when query, country, or page changes
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Refetch saved articles when user is logged in or changes
  useEffect(() => {
    if (user) {
      fetchSavedArticles();
    } else {
      setSavedArticles([]); // clear saved articles on logout
    }
  }, [user, fetchSavedArticles]);

  // Update query and reset page on searchQuery prop change
  useEffect(() => {
    setQuery(searchQuery || '');
    setPage(1);
  }, [searchQuery]);

  // Saving article to the backend
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


  // Pagination functions
  const handlePrevClick = () => setPage((prevPage) => prevPage - 1);
  const handleNextClick = () => setPage((prevPage) => prevPage + 1);

  // Memoizing saved URLs for faster lookup in the render cycle
  const savedUrls = useMemo(() => new Set(savedArticles.map((a) => a.url)), [savedArticles]);

  return (
    <div className="container my-5" style={{ paddingTop: '30px' }}>
      <h1 className="mt-2 pt-2">
        Top Headlines
      </h1>

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