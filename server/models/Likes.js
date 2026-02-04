module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes", {
    // your fields
  });

  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      foreignKey: "UserId",
    });
    Likes.belongsTo(models.Posts, {
      foreignKey: "PostId",
    });
  };

  return Likes;
};