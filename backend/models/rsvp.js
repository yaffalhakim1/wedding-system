'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Rsvp extends Model {
    static associate(models) {
      Rsvp.belongsTo(models.Wedding, {
        foreignKey: 'weddingId',
        as: 'wedding'
      });
    }
  }

  Rsvp.init(
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
      guest_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      guest_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      guest_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      attendance_status: {
        type: DataTypes.ENUM('attending', 'not_attending', 'maybe'),
        allowNull: false,
        defaultValue: 'maybe',
      },
      number_of_guests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 0,
          max: 10,
        },
      },
      dietary_restrictions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      special_requests: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Rsvp',
      tableName: 'rsvps',
      underscored: true,
      timestamps: true,
      indexes: [
        {
          fields: ['weddingId'],
        },
        {
          fields: ['attendance_status'],
        },
      ],
    }
  );
  return Rsvp;
};