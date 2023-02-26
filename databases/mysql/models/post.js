'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
        onDelete: 'CASCADE'
      })
      Post.belongsToMany(models.User, {through: models.UserLiked, foreignKey: 'postId'})
    }
  }
  Post.init({
    userId: {
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      type: DataTypes.BIGINT.UNSIGNED
    },
    caption: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    tags: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    likes: {
      defaultValue: 0,
      type: DataTypes.BIGINT.UNSIGNED
    },
    image: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'Post'
  })
  return Post
}