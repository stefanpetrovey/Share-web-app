module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.TEXT, // Store base64 or URL
      allowNull: true, // Optional
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
      onDelete: "CASCADE",
    });

    Posts.hasMany(models.Likes, {
      onDelete: "CASCADE",
    });

    Posts.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  };

  return Posts;
};