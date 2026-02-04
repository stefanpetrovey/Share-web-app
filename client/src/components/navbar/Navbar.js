import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/Share.png";
import { AuthContext } from "../../helpers/AuthContext";
import axios from "axios";

function Navbar({ logout }) {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/auth/search?query=${query}`
      );
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleResultClick = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchTerm("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="navbar">
      {!authState.status ? (
        <div className="rightButtonsNav">
          <Link className="rightButtons" to="/login">
            Login
          </Link>
          <Link to="/registration">Register</Link>
        </div>
      ) : (
        <>
          <div className="leftButtonsNav">
            <img src={logo} alt="App Logo" className="logo-img" />
            <Link to="/">Home</Link>
            <Link to="/createpost">Create New Post</Link>
            <Link to="/aboutus">About us</Link>

            {/* Search Bar */}
            <div className="nav-search-container" ref={searchRef}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="nav-search-input"
              />

              {/* Dropdown results */}
              {showResults && results.length > 0 && (
                <div className="nav-search-results">
                  {results.map((user) => (
                    <div
                      key={user.id}
                      className="nav-search-result-item"
                      onClick={() => handleResultClick(user.id)}
                    >
                      <div className="search-result-content">
                        {user.photo ? (
                          <img
                            src={`http://localhost:3001/uploads/${user.photo}`}
                            alt={user.username}
                            className="search-result-photo"
                          />
                        ) : (
                          <div className="search-result-initial">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="search-result-username">
                          {user.username}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showResults && searchTerm && results.length === 0 && (
                <div className="nav-search-results">
                  <div className="nav-search-no-results">
                    No users found
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rightButtonsNav">
            <button className="logoutButton" onClick={logout}>
              Logout
            </button>

            {/* Profile Photo/Initial */}
            <Link to={`/profile/${authState.id}`} className="nav-profile-link">
              {authState.photo ? (
                <img
                  src={`http://localhost:3001/uploads/${authState.photo}`}
                  alt={`${authState.username}'s profile`}
                  className="nav-profile-photo"
                />
              ) : (
                <div className="nav-profile-initial">
                  {authState.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;