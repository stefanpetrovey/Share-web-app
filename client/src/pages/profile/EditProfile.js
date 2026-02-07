import "./EditProfile.css";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";
import API_URL from "../../utils/api";

function EditProfile() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    surname: "",
    email: "",
    bio: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    // Fetch current user profile
    axios
      .get(`${API_URL}/auth/profile`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setProfileData({
          name: response.data.name || "",
          surname: response.data.surname || "",
          email: response.data.email || "",
          bio: response.data.bio || "",
          photo: response.data.photo || null,
        });
        if (response.data.photo) {
          setPhotoPreview(
            `${API_URL}/uploads/${response.data.photo}`,
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
        setLoading(false);
      });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setNewPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = async () => {
    if (window.confirm("Are you sure you want to remove your profile photo?")) {
      try {
        await axios.delete(`${API_URL}/auth/profile/photo`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        });
        setPhotoPreview(null);
        setNewPhotoFile(null);
        setProfileData({ ...profileData, photo: null });
        setSuccess("Profile photo removed successfully");
      } catch (error) {
        setError("Failed to remove photo");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("surname", profileData.surname);
      formData.append("email", profileData.email);
      formData.append("bio", profileData.bio);

      if (newPhotoFile) {
        formData.append("photo", newPhotoFile);
      }

      await axios.put(`${API_URL}/auth/profile`, formData, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        }
      });

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        navigate(`/profile/${authState.id}`);
      }, 1500);
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <h2 className="page-title">Edit Profile</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Profile Photo Section */}
          <div className="photo-section">
            <label className="section-label">Profile Photo</label>
            <div className="photo-upload-area">
              {photoPreview ? (
                <div className="photo-preview-container">
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="photo-preview"
                  />
                  <div className="photo-actions">
                    <label className="change-photo-button">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ display: "none" }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="remove-photo-button"
                    >
                      Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-photo-container">
                  <div className="default-avatar">
                    {authState.username?.charAt(0).toUpperCase()}
                  </div>
                  <label className="upload-photo-button">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">First Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="surname">Last Name</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={profileData.surname}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Tell us about yourself..."
              rows="4"
              maxLength="500"
            />
            <span className="character-count">
              {profileData.bio.length}/500 characters
            </span>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/profile/${authState.id}`)}
              className="cancel-button"
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
