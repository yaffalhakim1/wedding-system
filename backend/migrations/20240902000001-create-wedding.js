'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('weddings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      bride_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      groom_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      wedding_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      wedding_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      venue_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      venue_address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      ceremony_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      ceremony_location: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      reception_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      reception_location: {
        type: Sequelize.STRING(200),
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

    await queryInterface.addIndex('weddings', ['wedding_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('weddings');
  }
};