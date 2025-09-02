'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      table_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      record_id: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      action: {
        type: Sequelize.ENUM('CREATE', 'UPDATE', 'DELETE', 'RESTORE'),
        allowNull: false
      },
      old_values: {
        type: Sequelize.JSON,
        allowNull: true
      },
      new_values: {
        type: Sequelize.JSON,
        allowNull: true
      },
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      user_type: {
        type: Sequelize.ENUM('admin', 'guest'),
        allowNull: true
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
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

    // Add indexes for better query performance
    await queryInterface.addIndex('audit_logs', ['table_name', 'record_id'], {
      name: 'audit_logs_table_record_idx'
    });
    
    await queryInterface.addIndex('audit_logs', ['action'], {
      name: 'audit_logs_action_idx'
    });
    
    await queryInterface.addIndex('audit_logs', ['created_at'], {
      name: 'audit_logs_created_at_idx'
    });
    
    await queryInterface.addIndex('audit_logs', ['user_id'], {
      name: 'audit_logs_user_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
  }
};