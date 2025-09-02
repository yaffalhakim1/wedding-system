'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add deletedAt column to all tables for soft deletes
    await queryInterface.addColumn('weddings', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('rsvps', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('messages', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('photos', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Add indexes for soft delete queries
    await queryInterface.addIndex('weddings', ['deleted_at']);
    await queryInterface.addIndex('rsvps', ['deleted_at']);
    await queryInterface.addIndex('messages', ['deleted_at']);
    await queryInterface.addIndex('photos', ['deleted_at']);
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex('weddings', ['deleted_at']);
    await queryInterface.removeIndex('rsvps', ['deleted_at']);
    await queryInterface.removeIndex('messages', ['deleted_at']);
    await queryInterface.removeIndex('photos', ['deleted_at']);

    // Remove columns
    await queryInterface.removeColumn('weddings', 'deleted_at');
    await queryInterface.removeColumn('rsvps', 'deleted_at');
    await queryInterface.removeColumn('messages', 'deleted_at');
    await queryInterface.removeColumn('photos', 'deleted_at');
  }
};