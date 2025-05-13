import React, { useEffect, useState } from 'react';
import { Trash2 , History } from 'lucide-react';

function ViewHistory({ user, isDarkMode }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null); // NEW

  useEffect(() => {
    if (!user) return;
    window.scrollTo(0, 0);
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/history/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history:', err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (!user) return <p className="text-center mt-4">Please log in to view your history.</p>;
  if (loading) return <p className="text-center mt-4">Loading history...</p>;
  if (history.length === 0)
  return (
    <div
      className="text-center d-flex flex-column align-items-center justify-content-center"
      style={{
        marginTop: '60px',  // Adjust the margin if needed
        backgroundColor: isDarkMode ? '#121212' : '#ffffff',
        minHeight: '100vh',  // Full height minus navbar
        padding: '40px',
        borderRadius: '10px',
      }}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
        alt="No history"
        style={{ width: '120px', marginBottom: '20px', opacity: 0.6 }}
      />
      <h4 style={{ color: isDarkMode ? '#ccc' : '#444' }}>No History Yet</h4>
      <p style={{ color: isDarkMode ? '#888' : '#666' }}>
        Looks like you haven’t viewed any articles yet.
      </p>
    </div>
  );


  return (
    <div className="container mt-4" style={{paddingTop:"10px"}}>
      <div className="mt-5 d-flex align-items-center justify-content-between">
  <div className="d-flex align-items-center gap-2">
    <History size={24} />
    <h4 className="m-0">History</h4>
  </div>

  {history.length > 0 && (
    <button
      onClick={async () => {
        const confirmed = window.confirm('Are you sure you want to clear all history?');
        if (!confirmed) return;

        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:8000/api/history/clear', {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error('Failed to clear history');

          setHistory([]);
        } catch (err) {
          console.error('Error clearing history:', err);
          alert('Failed to clear all history items');
        }
      }}
      className={`btn btn-sm ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
    >
      🧹 Clear All
    </button>
  )}
</div>


      <div className="d-flex flex-column gap-3 mt-3">
        {history.map((item, index) => (
          <div
            key={index}
            className="position-relative d-flex rounded shadow-sm p-3"
            style={{
              backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
              border: isDarkMode ? '1px solid #333' : '1px solid #ddd',
              alignItems: 'center',
              minHeight: '100px',
              gap: '20px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Delete Button */}
            {hoverIndex === index && (
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:8000/api/history/${item._id}`, {
                      method: 'DELETE',
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    if (!res.ok) throw new Error('Failed to delete');
                    setHistory((prev) => prev.filter((_, i) => i !== index));
                  } catch (err) {
                    console.error('Error deleting history item:', err);
                    alert('Failed to delete item');
                  }
                }}
                className="btn btn-link p-0 m-0"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: isDarkMode ? '#ccc' : '#444',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={24} />
              </button>
            )}

            {/* Image */}
            <img
              src={item.article.urlToImage || 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg'}
              alt="thumbnail"
              style={{
                width: '100px',
                height: '70px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />

            {/* Text Content */}
            <div className="flex-grow-1">
              <a
                href={item.article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#0d6efd',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '5px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: 'calc(100% - 120px)',
                }}
              >
                {item.article.title}
              </a>
              <p
                style={{
                  fontSize: '14px',
                  color: isDarkMode ? '#ccc' : '#555',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.article.description || 'No description available'}
              </p>
              <small style={{ color: isDarkMode ? '#888' : '#999' }}>
                {item.article.source?.name || 'Unknown Source'} •{' '}
                {new Date(item.viewedAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewHistory;
