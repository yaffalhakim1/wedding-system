'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rsvps', {
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
      guest_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      guest_email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      guest_phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      attendance_status: {
        type: Sequelize.ENUM('attending', 'not_attending', 'maybe'),
        allowNull: false,
        defaultValue: 'maybe'
      },
      number_of_guests: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      dietary_restrictions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      special_requests: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('rsvps', ['wedding_id']);
    await queryInterface.addIndex('rsvps', ['attendance_status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rsvps');
  }
};