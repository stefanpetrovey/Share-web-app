const { Comments, Users } = require("../models");

// Get comments for a post
const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    const comments = await Comments.findAll({
      where: { PostId: postId },
      include: [
        {
          model: Users,
          attributes: ["id", "username", "photo"]
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(comments);
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a comment
// Create a comment
const createComment = async (req, res) => {
  try {
    const comment = req.body;
    comment.username = req.user.username;
    comment.UserId = req.user.id;  // ← ADD THIS LINE

    const newComment = await Comments.create(comment);
    
    // Fetch the comment with User data included
    const commentWithUser = await Comments.findByPk(newComment.id, {
      include: [
        {
          model: Users,
          attributes: ["id", "username", "photo"]
        }
      ]
    });
    
    res.json(commentWithUser);  // Return comment with User data
  } catch (err) {
    console.error("Create comment error:", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comments.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Only allow the user who wrote the comment to delete it
    if (comment.username !== req.user.username) {
      return res.status(403).json({ error: "You cannot delete this comment" });
    }

    await Comments.destroy({ where: { id: commentId } });
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Something went wrong while deleting the comment" });
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  deleteComment,
};
