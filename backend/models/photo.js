'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Photo extends Model {
    static associate(models) {
      Photo.belongsTo(models.Wedding, {
        foreignKey: 'weddingId',
        as: 'wedding'
      });
    }
  }

  Photo.init(
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
      filename: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      original_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      mime_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      uploaded_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      caption: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      modelName: 'Photo',
      tableName: 'photos',
      underscored: true,
      timestamps: true,
      indexes: [
        {
          fields: ['weddingId'],
        },
        {
          fields: ['is_approved'],
        },
        {
          fields: ['mime_type'],
        },
      ],
    }
  );
  return Photo;
};