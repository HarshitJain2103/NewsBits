import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import News from './components/news';
import Signup from './components/signup';
import Login from './components/login';
import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import SavedArticlesPage from './components/savedArticlesPage';
import { jwtDecode } from 'jwt-decode';
import Alert from './components/alert';
import ViewHistory from './components/viewHistory';
import About from './components/about';

function App() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded); 
        setUser({ username: decoded.username, userId: decoded.userId });
      } catch (err) {
        console.log('Invalid token:', err.message);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setTriggerSearch(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#121212' : '#fff',
        color: isDarkMode ? 'white' : 'black',
        minHeight: '160vh',
      }}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        isDarkMode={isDarkMode}
        user={user}
      />

      <Navbar
        user={user}
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        currentRoute={location.pathname}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        toggleSidebar={toggleSidebar}
      />

      {/* GLOBAL ALERT RENDERING */}
      {alertMessage && (
        <Alert
          message={alertMessage}
          onClose={() => setAlertMessage('')}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <News
              pageSize={6}
              searchQuery={searchQuery}
              triggerSearch={triggerSearch}
              onSearchComplete={() => setTriggerSearch(false)}
              isDarkMode={isDarkMode}
              user={user}
            />
          }
        />
        <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
        <Route
          path="/signup"
          element={
            <Signup
              setUser={setUser}
              isDarkMode={isDarkMode}
              setAlertMessage={setAlertMessage}
            />
          }
        />
        <Route
          path="/saved"
          element={
            <SavedArticlesPage
              user={user}
              isDarkMode={isDarkMode}
            />
          }
        />
        <Route
          path="/history"
          element={
            <ViewHistory
              user={user}
              isDarkMode={isDarkMode}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setUser={setUser}
              isDarkMode={isDarkMode}
              setAlertMessage={setAlertMessage}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;