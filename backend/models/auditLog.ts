'use strict';

import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
export type UserType = 'admin' | 'guest';

export interface AuditLogAttributes {
  id: string;
  table_name: string;
  record_id: string;
  action: AuditAction;
  old_values?: any;
  new_values?: any;
  user_id?: string;
  user_type?: UserType;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'createdAt' | 'updatedAt' | 'old_values' | 'new_values' | 'user_id' | 'user_type' | 'ip_address' | 'user_agent' | 'metadata'> {}

export default (sequelize: Sequelize, DataTypes: typeof import('sequelize').DataTypes) => {
  class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
    public id!: string;
    public table_name!: string;
    public record_id!: string;
    public action!: AuditAction;
    public old_values?: any;
    public new_values?: any;
    public user_id?: string;
    public user_type?: UserType;
    public ip_address?: string;
    public user_agent?: string;
    public metadata?: any;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Helper method to create audit entries
    static async createAuditEntry(data: AuditLogCreationAttributes): Promise<AuditLog> {
      return await AuditLog.create(data);
    }

    // Helper method to get audit trail for a specific record
    static async getAuditTrail(tableName: string, recordId: string): Promise<AuditLog[]> {
      return await AuditLog.findAll({
        where: {
          table_name: tableName,
          record_id: recordId,
        },
        order: [['createdAt', 'DESC']],
      });
    }

    // Helper method to get recent audit logs
    static async getRecentLogs(limit: number = 100): Promise<AuditLog[]> {
      return await AuditLog.findAll({
        order: [['createdAt', 'DESC']],
        limit,
      });
    }
  }

  AuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      table_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      record_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      action: {
        type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'RESTORE'),
        allowNull: false,
      },
      old_values: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      new_values: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      user_type: {
        type: DataTypes.ENUM('admin', 'guest'),
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING(45), // IPv6 max length
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'AuditLog',
      tableName: 'audit_logs',
      underscored: true,
      timestamps: true,
      indexes: [
        {
          fields: ['table_name', 'record_id'],
          name: 'audit_logs_table_record_idx',
        },
        {
          fields: ['action'],
          name: 'audit_logs_action_idx',
        },
        {
          fields: ['created_at'],
          name: 'audit_logs_created_at_idx',
        },
        {
          fields: ['user_id'],
          name: 'audit_logs_user_id_idx',
        },
      ],
    }
  );

  return AuditLog;
};