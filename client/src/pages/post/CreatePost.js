import "./CreatePost.css"
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  let navigate = useNavigate();

  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, [authState.status, navigate]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is a required field!"),
    postText: Yup.string().required("Post content is required!"),
  });

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

      setPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("postText", data.postText);

    if (photoFile) {
      formData.append("photo", photoFile); // multer expects "photo"
    }

    axios
      .post("http://localhost:3001/posts", formData, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => navigate("/"))
      .catch((error) => {
        console.error("Error creating post:", error.response?.data || error.message);
        alert(error.response?.data?.error || "Failed to create post");
      });
  };

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <h2 className="create-post-title">Create New Post</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="post-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <ErrorMessage name="title" component="span" className="error-message" />
              <Field
                className="form-input"
                autoComplete="off"
                id="title"
                name="title"
                placeholder="Enter your post title..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="postText" className="form-label">Post Content</label>
              <ErrorMessage name="postText" component="span" className="error-message" />
              <Field
                as="textarea"
                className="form-textarea"
                autoComplete="off"
                id="postText"
                name="postText"
                placeholder="What's on your mind..."
                rows="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo" className="form-label">Photo (Optional)</label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="photo-input"
              />
              {photoPreview && (
                <div className="photo-preview-container">
                  <img src={photoPreview} alt="Preview" className="photo-preview" />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="remove-photo-button"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className="submit-button">
              Create Post
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default CreatePost;
