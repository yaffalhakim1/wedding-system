'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Wedding extends Model {
    static associate(models) {
      // wedding can have many rspvs, messages, photos
      Wedding.hasMany(models.Rsvp, {
        foreignKey: 'weddingId',
        as: 'rsvps',
      });
      Wedding.hasMany(models.Message, {
        foreignKey: 'weddingId',
        as: 'messages',
      });
      Wedding.hasMany(models.Photo, {
        foreignKey: 'weddingId',
        as: 'photos',
      });
    }
  }

  Wedding.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      bride_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      groom_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      wedding_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter: new Date().toISOString().split('T')[0],
        },
      },
      wedding_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      venue_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 200],
        },
      },
      venue_address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      ceremony_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      ceremony_location: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      reception_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      reception_location: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Wedding',
      tableName: 'weddings',
      underscored: true,
      timestamps: true,
      indexes: [
        {
          fields: ['wedding_date'],
        },
      ],
    }
  );
  return Wedding;
};
