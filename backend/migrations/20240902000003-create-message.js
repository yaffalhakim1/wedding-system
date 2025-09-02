'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      wedding_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'weddings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sender_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      sender_email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      message_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('messages', ['wedding_id']);
    await queryInterface.addIndex('messages', ['is_approved']);
    await queryInterface.addIndex('messages', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
  }
};