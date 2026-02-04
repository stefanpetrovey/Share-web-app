import "./Post.css";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
      setEditedTitle(response.data.title);
      setEditedBody(response.data.postText);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  const addComment = () => {
    if (!newComment.trim()) return;

    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        },
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          setComments([...comments, response.data]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (commentId) => {
    axios
      .delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(comments.filter((val) => val.id !== commentId));
      });
  };

  const deletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios
        .delete(`http://localhost:3001/posts/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then(() => {
          navigate("/");
        });
    }
  };

  const saveTitle = () => {
    if (!editedTitle.trim()) return;

    axios
      .put(
        "http://localhost:3001/posts/title",
        {
          newTitle: editedTitle,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        },
      )
      .then(() => {
        setPostObject({ ...postObject, title: editedTitle });
        setIsEditingTitle(false);
      });
  };

  const saveBody = () => {
    if (!editedBody.trim()) return;

    axios
      .put(
        "http://localhost:3001/posts/postText",
        {
          newText: editedBody,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        },
      )
      .then(() => {
        setPostObject({ ...postObject, postText: editedBody });
        setIsEditingBody(false);
      });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Store the actual file
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const savePhoto = () => {
    if (!selectedFile) {
      alert("Please select a photo");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("id", id);

    axios
      .put("http://localhost:3001/posts/photo", formData, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Update with the new filename from server
        setPostObject({ ...postObject, photo: response.data.photo });
        setIsEditingPhoto(false);
        setPhotoPreview(null);
        setSelectedFile(null);
      })
      .catch((error) => {
        console.error("Photo upload error:", error);
        alert(error.response?.data?.error || "Failed to update photo");
      });
  };

  const removePhoto = () => {
    if (window.confirm("Are you sure you want to remove this photo?")) {
      axios
        .put(
          "http://localhost:3001/posts/photo",
          {
            photo: null,
            id: id,
          },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          },
        )
        .then(() => {
          setPostObject({ ...postObject, photo: null });
        });
    }
  };

  const handleKeyPress = (e, saveFunction) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveFunction();
    }
  };

  return (
    <div className="post-detail-page">
      <div className="post-content-section">
        <div className="post-card">
          {/* Post Header */}
          {/* Post Header */}
          <div className="post-header-section">
            {isEditingTitle ? (
              <div className="edit-title-container">
                <input
                  type="text"
                  className="edit-title-input"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, saveTitle)}
                  autoFocus
                />
                <div className="edit-actions">
                  <button className="save-button" onClick={saveTitle}>
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setEditedTitle(postObject.title);
                      setIsEditingTitle(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="post-title-row">
                <h1
                  className={`post-title ${
                    authState.username === postObject.username ? "editable" : ""
                  }`}
                  onClick={() => {
                    if (authState.username === postObject.username) {
                      setIsEditingTitle(true);
                    }
                  }}
                >
                  {postObject.title}
                </h1>
                <div className="post-date">
                  {postObject.createdAt &&
                    new Date(postObject.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
              </div>
            )}

            <div className="post-meta">
              <div className="post-author-info">
                {postObject.User?.photo ? (
                  <img
                    src={`http://localhost:3001/uploads/${postObject.User.photo}`}
                    alt={`${postObject.username}'s profile`}
                    className="post-author-photo"
                  />
                ) : (
                  <div className="post-author-initial">
                    {postObject.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <Link
                  to={`/profile/${postObject.UserId}`}
                  className="post-author"
                >
                  {postObject.username}
                </Link>
              </div>
              {authState.username === postObject.username && (
                <button className="delete-post-button" onClick={deletePost}>
                  Delete Post
                </button>
              )}
            </div>
          </div>

          {/* Post Body - NOW BEFORE PHOTO */}
          <div className="post-body-section">
            {isEditingBody ? (
              <div className="edit-body-container">
                <textarea
                  className="edit-body-textarea"
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  autoFocus
                  rows="6"
                />
                <div className="edit-actions">
                  <button className="save-button" onClick={saveBody}>
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setEditedBody(postObject.postText);
                      setIsEditingBody(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p
                className={`post-body ${
                  authState.username === postObject.username ? "editable" : ""
                }`}
                onClick={() => {
                  if (authState.username === postObject.username) {
                    setIsEditingBody(true);
                  }
                }}
              >
                {postObject.postText}
              </p>
            )}
          </div>

          {/* Post Photo - NOW AFTER TEXT */}
          {(postObject.photo || isEditingPhoto) && (
            <div className="post-photo-section">
              {isEditingPhoto ? (
                <div className="edit-photo-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="photo-input"
                  />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="post-photo-preview"
                    />
                  )}
                  <div className="edit-actions">
                    <button
                      className="save-button"
                      onClick={savePhoto}
                      disabled={!photoPreview}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => {
                        setIsEditingPhoto(false);
                        setPhotoPreview(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                postObject.photo && (
                  <div className="post-photo-container">
                    <img
                      src={`http://localhost:3001/uploads/${postObject.photo}`}
                      alt="Post"
                      className="post-photo"
                    />
                    {authState.username === postObject.username && (
                      <div className="photo-actions">
                        <button
                          className="edit-photo-button"
                          onClick={() => setIsEditingPhoto(true)}
                        >
                          Change Photo
                        </button>
                        <button
                          className="remove-photo-button"
                          onClick={removePhoto}
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* Add Photo Button (if no photo exists) */}
          {!postObject.photo &&
            !isEditingPhoto &&
            authState.username === postObject.username && (
              <div className="add-photo-section">
                <button
                  className="add-photo-button"
                  onClick={() => setIsEditingPhoto(true)}
                >
                  + Add Photo
                </button>
              </div>
            )}

          {/* Post Likes */}
          <div className="post-likes-section">
            <span className="likes-count">
              <strong>{postObject.Likes?.length || 0}</strong>{" "}
              {postObject.Likes?.length === 1 ? "like" : "likes"}
            </span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3 className="comments-title">Comments ({comments.length})</h3>

        <div className="add-comment-form">
          <input
            type="text"
            className="comment-input"
            placeholder="Write a comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addComment)}
          />
          <button className="add-comment-button" onClick={addComment}>
            Post
          </button>
        </div>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment, key) => {
              return (
                <div key={key} className="comment-item">
                  <div className="comment-content">
                    <div className="comment-author-info">
                      {comment.User?.photo ? (
                        <img
                          src={`http://localhost:3001/uploads/${comment.User.photo}`}
                          alt={`${comment.username}'s profile`}
                          className="comment-author-photo"
                        />
                      ) : (
                        <div className="comment-author-initial">
                          {comment.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <Link
                        to={`/profile/${comment.UserId}`}
                        className="comment-author"
                      >
                        {comment.username}
                      </Link>
                    </div>
                    <p className="comment-text">{comment.commentBody}</p>
                  </div>
                  {authState.username === comment.username && (
                    <button
                      className="delete-comment-button"
                      onClick={() => deleteComment(comment.id)}
                      title="Delete comment"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
