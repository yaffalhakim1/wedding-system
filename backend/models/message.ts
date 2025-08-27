'use strict';

import { Model, DataTypes, Sequelize, Optional, Association } from 'sequelize';

// Interface for Message attributes
export interface MessageAttributes {
  id: string;
  weddingId: string;
  sender_name: string;
  sender_email?: string | null;
  message_content: string;
  is_approved: boolean;
  approved_at?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Message creation attributes (optional id, timestamps, and approval fields)
export interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'createdAt' | 'updatedAt' | 'sender_email' | 'is_approved' | 'approved_at'> {}

// Message model class
export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: string;
  public weddingId!: string;
  public sender_name!: string;
  public sender_email!: string | null;
  public message_content!: string;
  public is_approved!: boolean;
  public approved_at!: Date | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associations: {
    wedding: Association<Message, any>;
  };

  static associate(models: any): void {
    Message.belongsTo(models.Wedding, {
      foreignKey: 'weddingId',
      as: 'wedding'
    });
  }
}

export default (sequelize: Sequelize, DataTypes: typeof import('sequelize').DataTypes) => {
  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      weddingId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'weddings',
          key: 'id',
        },
      },
      sender_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      sender_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      message_content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 1000],
        },
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages',
      underscored: true,
      timestamps: true,
      indexes: [
        {
          fields: ['weddingId'],
        },
        {
          fields: ['is_approved'],
        },
      ],
    }
  );
  return Message;
};