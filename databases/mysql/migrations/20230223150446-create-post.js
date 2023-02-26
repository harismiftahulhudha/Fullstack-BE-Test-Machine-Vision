'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Post',  {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      userId: {
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        type: Sequelize.BIGINT.UNSIGNED
      },
      caption: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      tags: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      likes: {
        defaultValue: 0,
        type: Sequelize.BIGINT.UNSIGNED
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Post')
  }
}