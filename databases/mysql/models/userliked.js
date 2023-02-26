'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserLiked extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserLiked.hasMany(models.Post, {foreignKey: 'id', sourceKey: 'postId'})
      UserLiked.hasMany(models.User, {foreignKey: 'id', sourceKey: 'userId'})
    }
  }
  UserLiked.init({
    postId: {
      allowNull: false,
      references: {
        model: 'Post',
        key: 'id'
      },
      type: DataTypes.BIGINT.UNSIGNED
    },
    userId: {
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      type: DataTypes.BIGINT.UNSIGNED
    }
  }, {
    sequelize,
    modelName: 'UserLiked',
    tableName: 'UserLiked',
    timestamps: false
  })
  return UserLiked
}