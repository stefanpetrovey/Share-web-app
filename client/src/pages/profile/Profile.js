import "./Profile.css";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";
import API_URL from "../../utils/api";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Profile() {
  let { id } = useParams();
  const { authState } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState([]); // Track liked post IDs
  const [activeTab, setActiveTab] = useState("posts");
  const [totalLikes, setTotalLikes] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      // Get user basic info
      axios
        .get(`${API_URL}/auth/basicinfo/${id}`)
        .then((response) => {
          setUsername(response.data.username);
          setUserInfo(response.data);
        });

      // Get user posts
      axios
        .get(`${API_URL}/posts/byUserId/${id}`)
        .then((response) => {
          setListOfPosts(response.data);

          // Calculate total likes
          const likes = response.data.reduce(
            (acc, post) => acc + post.Likes.length,
            0,
          );
          setTotalLikes(likes);
        });

      // Get liked posts
      axios
        .get(`${API_URL}/auth/byUserId/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setLikedPosts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching liked posts:", error);
        });

      // Get liked post IDs for the current user
      axios
        .get(`${API_URL}/posts`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setLikedPostIds(response.data.likedPosts.map((like) => like.PostId));
        })
        .catch((error) => {
          console.error("Error fetching liked post IDs:", error);
        });
    }
  }, [authState.status, id, navigate]);

  const likeAPost = (postId) => {
    axios
      .post(
        `${API_URL}/likes`,
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } },
      )
      .then((response) => {
        if (response.data.liked) {
          setLikedPostIds([...likedPostIds, postId]);
        } else {
          setLikedPostIds(likedPostIds.filter((id) => id !== postId));
        }
        
        // Update the post's like count in both listOfPosts and likedPosts
        const updatePosts = (posts) =>
          posts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = [...post.Likes];
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            }
            return post;
          });

        setListOfPosts(updatePosts(listOfPosts));
        setLikedPosts(updatePosts(likedPosts));
        
        // Recalculate total likes
        const updatedPosts = updatePosts(listOfPosts);
        const likes = updatedPosts.reduce(
          (acc, post) => acc + post.Likes.length,
          0,
        );
        setTotalLikes(likes);
      });
  };

  const renderPosts = (posts) => {
  if (posts.length === 0) {
    return (
      <div className="no-posts-message">
        <p>No posts yet.</p>
        {activeTab === "posts" && authState.username === username && (
          <button
            className="create-post-cta"
            onClick={() => navigate("/createpost")}
          >
            Create Your First Post
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="user-posts-list">
      {posts.map((value, key) => {
        return (
          <div key={key} className="post">
            {/* Post Header - matching Home page */}
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

            {/* Post Body - matching Home page */}
            <div
              className="postbody"
              onClick={() => navigate(`/post/${value.id}`)}
            >
              {value.postText}
            </div>

            {/* Post Photo */}
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

            {/* Post Footer - matching Home page */}
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
                    {value.User?.username
                      ? value.User.username.charAt(0).toUpperCase()
                      : username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="footerlink-text">
                  {value.User ? value.User.username : username}
                </span>
              </div>
              {likedPostIds.includes(value.id) ? (
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
                <b>{value.Likes.length}</b> {value.Likes.length === 1 ? "person" : "people"} liked this.
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
};

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            {userInfo.photo ? (
              <img
                src={`${API_URL}/uploads/${userInfo.photo}`}
                alt={username}
                className="profile-avatar-image"
              />
            ) : (
              <div className="profile-avatar">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-details">
            <div className="profile-top-row">
              <h2 className="profile-username">{username}</h2>

              {/* Action Buttons */}
              <div className="profile-actions">
                {authState.username === username ? (
                  <>
                    <button
                      className="edit-profile-button"
                      onClick={() => navigate("/editprofile")}
                    >
                      Edit Profile
                    </button>
                    <button
                      className="change-password-button"
                      onClick={() => navigate("/changepassword")}
                    >
                      Change Password
                    </button>
                  </>
                ) : (
                  <span className="no-actions"></span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="profile-stats">
              <span className="stat-item">
                <strong>{listOfPosts.length}</strong> Posts
              </span>
              <span className="stat-item">
                <strong>{totalLikes}</strong> Likes
              </span>
            </div>

            {/* Bio */}
            {userInfo.bio && (
              <div className="profile-bio">
                <p>{userInfo.bio}</p>
              </div>
            )}

            {/* Member Since */}
            {userInfo.createdAt && (
              <div className="profile-joined">
                <p>
                  Joined{" "}
                  {new Date(userInfo.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`tab-button ${activeTab === "liked" ? "active" : ""}`}
            onClick={() => setActiveTab("liked")}
          >
            Liked ({likedPosts.length})
          </button>
        </div>

        {/* User Posts Section */}
        <div className="profile-posts-section">
          {activeTab === "posts" && renderPosts(listOfPosts)}
          {activeTab === "liked" && renderPosts(likedPosts)}
        </div>
      </div>
    </div>
  );
}

export default Profile;