'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserLiked', {
      postId: {
        allowNull: false,
        references: {
          model: 'Post',
          key: 'id'
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      userId: {
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        type: Sequelize.BIGINT.UNSIGNED
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserLiked')
  }
}