import "./ChangePassword.css";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";
import API_URL from "../../utils/api";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, [authState.status, navigate]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    axios
      .put(
        `${API_URL}/auth/changepassword`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setSuccess("Password changed successfully!");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setTimeout(() => {
            navigate(`/profile/${authState.id}`);
          }, 2000);
        }
      })
      .catch((err) => {
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div className="change-password-page">
      <div className="change-password-container">
        <h2 className="change-password-title">Change Your Password</h2>
        <p className="change-password-subtitle">
          Enter your current password and choose a new one
        </p>

        {error && <div className="error-alert">{error}</div>}
        {success && <div className="success-alert">{success}</div>}

        <form className="password-form" onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="oldPassword" className="form-label">
              Current Password
            </label>
            <input
              type="password"
              id="oldPassword"
              className="form-input"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="form-input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="submit-button">
            Change Password
          </button>

          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(`/profile/${authState.id}`)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;