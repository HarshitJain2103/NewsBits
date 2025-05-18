import { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaSignOutAlt, FaBars } from 'react-icons/fa';

export class Navbar extends Component {
  render() {
    const { user, handleLogout, currentRoute, toggleDarkMode, isDarkMode, toggleSidebar } = this.props;
    return (
      <nav
        className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} fixed-top`}
        style={{ borderBottom: '1px solid #ddd' }}
      >
        <div className="container-fluid">
          <FaBars
            className="me-2"
            style={{ cursor: 'pointer' }}
            onClick={toggleSidebar}
          />
          <Link className="navbar-brand fs-4" to="/">
            NewsBits
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* Left-aligned nav items */}
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link fs-5 active" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fs-5" to="/about">
                  About
                </Link>
              </li>
            </ul>

            {/* Search bar */}
            {currentRoute === '/' && (
              <form className="d-flex ms-auto me-3" onSubmit={this.props.onSearchSubmit}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search news"
                  aria-label="Search"
                  value={this.props.searchQuery}
                  onChange={this.props.onSearchChange}
                  style={{ minWidth: '600px' }}
                />
                <button
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  type="submit"
                >
                  Search
                </button>
              </form>
            )}

            {/* Right-aligned nav item */}
            <ul className="navbar-nav ms-auto">
              {user ? (
                <li className="nav-item dropdown">
                  <button
                    className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'} rounded-pill px-4 py-2 dropdown-toggle`}
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.username}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <button
                        className="dropdown-item text-danger fw-bold"
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                      >
                        Logout
                        <FaSignOutAlt className="ms-2" />
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item me-2">
                    <Link className="nav-link" to="/signup">
                      <button className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'} rounded-pill px-4 py-2`}>
                        Signup
                      </button>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      <button className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'} rounded-pill px-4 py-2`}>
                        Login
                      </button>
                    </Link>
                  </li>
                </>
              )}
              <button
                className="btn"
                onClick={toggleDarkMode}
                style={{ color: isDarkMode ? 'yellow' : 'black' }}
              >
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
