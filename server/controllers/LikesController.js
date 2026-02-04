const { Likes } = require("../models");

// Toggle like/unlike
const toggleLike = async (req, res) => {
  try {
    const { PostId } = req.body;
    const UserId = req.user.id;

    const found = await Likes.findOne({
      where: { PostId, UserId },
    });

    if (!found) {
      await Likes.create({ PostId, UserId });
      return res.json({ liked: true });
    } else {
      await Likes.destroy({ where: { PostId, UserId } });
      return res.json({ liked: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  toggleLike,
};
