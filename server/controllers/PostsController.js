const { Posts, Likes, Users } = require("../models");

// Get all posts and liked posts
const getAllPosts = async (req, res) => {
  try {
    const listOfPosts = await Posts.findAll({
      include: [
        {
          model: Users,
          attributes: ["id", "username", "photo"],
        },
        {
          model: Likes,
        },
      ],
    });

    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });

    res.json({ listOfPosts, likedPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findByPk(id, {
      include: [
        { model: Users, attributes: ["id", "username", "photo"] },
        { model: Likes },
      ],
    });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get posts by user ID
const getPostsByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const listOfPosts = await Posts.findAll({
      where: { UserId: id },
      include: [
        { model: Users, attributes: ["id", "username", "photo"] },
        { model: Likes },
      ],
    });

    res.json(listOfPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a post
const createPost = async (req, res) => {
  try {
    const newPost = {
      title: req.body.title,
      postText: req.body.postText,
      username: req.user.username,
      UserId: req.user.id,
      photo: req.file ? req.file.filename : null,
    };

    await Posts.create(newPost);
    res.json(newPost);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// Update post title
const updateTitle = async (req, res) => {
  try {
    const { newTitle, id } = req.body;
    await Posts.update({ title: newTitle }, { where: { id } });
    res.json(newTitle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update post text
const updatePostText = async (req, res) => {
  try {
    const { newText, id } = req.body;
    await Posts.update({ postText: newText }, { where: { id } });
    res.json(newText);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update post photo
const updatePostPhoto = async (req, res) => {
  try {
    const { id } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No photo uploaded" });
    }

    await Posts.update({ photo: req.file.filename }, { where: { id } });
    res.json({ photo: req.file.filename });
  } catch (err) {
    console.error("Update post photo error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// Delete a post
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    await Posts.destroy({ where: { id: postId } });
    res.json("Delete successful");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  updateTitle,
  updatePostText,
  updatePostPhoto,
  deletePost,
};