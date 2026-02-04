module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Comments.associate = (models) => {
    Comments.belongsTo(models.Posts, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
    
    // ADD THIS - Associate Comments with Users
    Comments.belongsTo(models.Users, {
      foreignKey: "UserId",
      onDelete: "CASCADE",
    });
  };

  return Comments;
};