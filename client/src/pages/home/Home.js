import "./Home.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../../helpers/AuthContext";
import { useContext } from "react";
import API_URL from "../../utils/api";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPost] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get(`${API_URL}/posts`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPost(response.data.likedPosts.map((like) => like.PostId));

          // Get all unique users from posts
          const users = response.data.listOfPosts.map((post) => post.User);
          const uniqueUsers = Array.from(
            new Map(users.map((u) => [u.id, u])).values(),
          );
          // Filter out current user
          const otherUsers = uniqueUsers.filter(u => u.id !== authState.id);
          
          // Store all users for "View All"
          setAllUsers(otherUsers);
          
          // Show random 5 for suggestions
          const shuffled = [...otherUsers].sort(() => 0.5 - Math.random());
          setSuggestedUsers(shuffled.slice(0, 5));
        });
    }
  }, [authState.status, authState.id, navigate]);

  const likeAPost = (postId) => {
    axios
      .post(
        `${API_URL}/likes`,
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } },
      )
      .then((response) => {
        if (response.data.liked) {
          setLikedPost([...likedPosts, postId]);
        } else {
          setLikedPost(likedPosts.filter((id) => id !== postId));
        }
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          }),
        );
      });
  };

  return (
    <div className="home-container">
      {/* Posts Section */}
      <div className="posts-section">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="upperpost">
                <div className="title" onClick={() => navigate(`/post/${value.id}`)}>
                  {value.title}
                </div>
                <div className="post-timestamp">
                  {new Date(value.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>

              <div
                className="postbody"
                onClick={() => navigate(`/post/${value.id}`)}
              >
                {value.postText}
              </div>

              {value.photo && (
                <div className="post-image-container">
                  <img
                    src={`${API_URL}/uploads/${value.photo}`}
                    alt="Post"
                    className="post-image"
                    onClick={() => navigate(`/post/${value.id}`)}
                  />
                </div>
              )}

              <div className="lowerpost">
                <div className="footer">
                  {value.User?.photo ? (
                    <img
                      src={`${API_URL}/uploads/${value.User.photo}`}
                      alt={`${value.User.username}'s profile`}
                      className="user-photo"
                    />
                  ) : (
                    <div className="user-initial">
                      {value.User?.name
                        ? value.User.name.charAt(0).toUpperCase()
                        : value.User.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <Link className="footerlink" to={`/profile/${value.User.id}`}>
                    {value.User.username}
                  </Link>
                </div>
                {likedPosts.includes(value.id) ? (
                  <FavoriteIcon
                    className="likeButton"
                    onClick={() => likeAPost(value.id)}
                  />
                ) : (
                  <FavoriteBorderIcon
                    className="likeButton"
                    onClick={() => likeAPost(value.id)}
                  />
                )}
                <label>
                  <b> {value.Likes.length} </b>people liked this.
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggestions Section */}
      <div className="suggestions-section">
        <div className="suggestions-header">
          <h3>Suggested Users</h3>
          {allUsers.length > 5 && (
            <button 
              className="view-all-button"
              onClick={() => setShowAllSuggestions(true)}
            >
              View All
            </button>
          )}
        </div>
        
        {suggestedUsers.map((user) => (
          <div key={user.id} className="suggestion-item">
            <div className="suggestion-user">
              {user.photo ? (
                <img
                  src={`${API_URL}/uploads/${user.photo}`}
                  alt={user.username}
                  className="user-photo"
                />
              ) : (
                <div className="user-initial">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <Link to={`/profile/${user.id}`} className="suggestion-username">
                {user.username}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View All Suggestions Modal */}
      {showAllSuggestions && (
        <div className="suggestions-modal-overlay" onClick={() => setShowAllSuggestions(false)}>
          <div className="suggestions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>All Users</h2>
              <button 
                className="close-modal-button"
                onClick={() => setShowAllSuggestions(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              {allUsers.map((user) => (
                <div key={user.id} className="modal-suggestion-item">
                  <div className="modal-user-info">
                    {user.photo ? (
                      <img
                        src={`${API_URL}/uploads/${user.photo}`}
                        alt={user.username}
                        className="modal-user-photo"
                      />
                    ) : (
                      <div className="modal-user-initial">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <Link 
                      to={`/profile/${user.id}`} 
                      className="modal-username"
                      onClick={() => setShowAllSuggestions(false)}
                    >
                      {user.username}
                    </Link>
                  </div>
                  <button 
                    className="modal-view-profile-button"
                    onClick={() => {
                      navigate(`/profile/${user.id}`);
                      setShowAllSuggestions(false);
                    }}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;