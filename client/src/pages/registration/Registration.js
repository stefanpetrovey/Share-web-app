import "./Registration.css";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);

  const initialValues = {
    username: "",
    email: "",
    name: "",
    surname: "",
    dateOfBirth: "",
    photo: null,
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must be at most 15 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    surname: Yup.string()
      .min(2, "Surname must be at least 2 characters")
      .required("Surname is required"),
    dateOfBirth: Yup.date()
      .max(new Date(), "Date of birth cannot be in the future")
      .nullable(),
    photo: Yup.mixed()
      .nullable()
      .test("fileSize", "File is too large (max 5MB)", (value) => {
        if (!value) return true;
        return value.size <= 5000000; // 5MB
      })
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          value.type
        );
      }),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .max(20, "Password must be at most 20 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const onSubmit = async (data) => {
    setServerError("");

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("dateOfBirth", data.dateOfBirth || "");
    formData.append("password", data.password);
    
    if (data.photo) {
      formData.append("photo", data.photo);
    }

    try {
      await axios.post("http://localhost:3001/auth", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setServerError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("photo", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h2 className="registration-title">Create Account</h2>
        <p className="registration-subtitle">Join us today</p>

        {serverError && <div className="error-alert">{serverError}</div>}

        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ setFieldValue }) => (
            <Form className="registration-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username *
                </label>
                <ErrorMessage
                  name="username"
                  component="span"
                  className="error-message"
                />
                <Field
                  type="text"
                  id="username"
                  className="form-input"
                  autoComplete="username"
                  name="username"
                  placeholder="Choose a username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <ErrorMessage
                  name="email"
                  component="span"
                  className="error-message"
                />
                <Field
                  type="email"
                  id="email"
                  className="form-input"
                  autoComplete="email"
                  name="email"
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name *
                </label>
                <ErrorMessage
                  name="name"
                  component="span"
                  className="error-message"
                />
                <Field
                  type="text"
                  id="name"
                  className="form-input"
                  autoComplete="given-name"
                  name="name"
                  placeholder="Enter your first name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="surname" className="form-label">
                  Surname *
                </label>
                <ErrorMessage
                  name="surname"
                  component="span"
                  className="error-message"
                />
                <Field
                  type="text"
                  id="surname"
                  className="form-input"
                  autoComplete="family-name"
                  name="surname"
                  placeholder="Enter your last name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth" className="form-label">
                  Date of Birth (Optional)
                </label>
                <ErrorMessage
                  name="dateOfBirth"
                  component="span"
                  className="error-message"
                />
                <Field
                  type="date"
                  id="dateOfBirth"
                  className="form-input"
                  autoComplete="bday"
                  name="dateOfBirth"
                />
              </div>

              <div className="form-group">
                <label htmlFor="photo" className="form-label">
                  Profile Photo (Optional)
                </label>
                <ErrorMessage
                  name="photo"
                  component="span"
                  className="error-message"
                />
                <input
                  type="file"
                  id="photo"
                  className="form-input file-input"
                  name="photo"
                  accept="image/*"
                  onChange={(event) => handleFileChange(event, setFieldValue)}
                />
                {photoPreview && (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <ErrorMessage
                  name="password"
                  component="span"
                  className="error-message"
                />
                <Field
                  type="password"
                  id="password"
                  className="form-input"
                  autoComplete="new-password"
                  name="password"
                  placeholder="Create a password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password *
                </label>
                <ErrorMessage
                  name="confirmPassword"
                  component="span"
                  className="error-message"
                />
                <Field
                  type="password"
                  id="confirmPassword"
                  className="form-input"
                  autoComplete="new-password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                />
              </div>

              <button type="submit" className="submit-button">
                Create Account
              </button>

              <div className="login-link">
                Already have an account?{" "}
                <Link to="/login" className="link">
                  Sign in here
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Registration;