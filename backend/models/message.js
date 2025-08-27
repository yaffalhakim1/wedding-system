'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Wedding, {
        foreignKey: 'weddingId',
        as: 'wedding'
      });
    }
  }

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