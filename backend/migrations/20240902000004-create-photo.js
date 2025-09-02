'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('photos', {
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
      filename: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      original_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      uploader_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      uploader_email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      caption: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      mime_type: {
        type: Sequelize.STRING(100),
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

    await queryInterface.addIndex('photos', ['wedding_id']);
    await queryInterface.addIndex('photos', ['is_approved']);
    await queryInterface.addIndex('photos', ['filename']);
    await queryInterface.addIndex('photos', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('photos');
  }
};