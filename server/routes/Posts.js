const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const PostController = require("../controllers/PostsController");
const upload = require("../middlewares/upload"); // ← Use shared upload

// Routes
router.get("/", validateToken, PostController.getAllPosts);
router.get("/byId/:id", PostController.getPostById);
router.get("/byUserId/:id", PostController.getPostsByUserId);
router.post("/", validateToken, upload.single("photo"), PostController.createPost);
router.put("/title", validateToken, PostController.updateTitle);
router.put("/postText", validateToken, PostController.updatePostText);
router.put("/photo", validateToken, upload.single("photo"), PostController.updatePostPhoto);
router.delete("/:postId", validateToken, PostController.deletePost);

module.exports = router;