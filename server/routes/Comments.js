const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const CommentsController = require("../controllers/CommentsController");

// Routes
router.get("/:postId", CommentsController.getCommentsByPostId);
router.post("/", validateToken, CommentsController.createComment);
router.delete("/:commentId", validateToken, CommentsController.deleteComment);

module.exports = router;
