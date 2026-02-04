import "./Login.css";
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    const data = { username: username, password: password };
    axios
      .post("http://localhost:3001/auth/login", data)
      .then((response) => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            photo: response.data.photo,  // ← ADD THIS LINE
            status: true,
          });
          navigate("/");
        }
      })
      .catch((err) => {
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {error && <div className="error-alert">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="submit-button">
            Sign In
          </button>

          <div className="register-link">
            Don't have an account?{" "}
            <Link to="/registration" className="link">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;