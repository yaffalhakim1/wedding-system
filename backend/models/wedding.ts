'use strict';

import { Model, DataTypes as SequelizeDataTypes, Sequelize, Association } from 'sequelize';

interface WeddingAttributes {
  id?: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_time?: string;
  venue_name: string;
  venue_address: string;
  ceremony_time?: string;
  ceremony_location?: string;
  reception_time?: string;
  reception_location?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface WeddingCreationAttributes extends Omit<WeddingAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class Wedding extends Model<WeddingAttributes, WeddingCreationAttributes> implements WeddingAttributes {
    public id!: string;
    public bride_name!: string;
    public groom_name!: string;
    public wedding_date!: string;
    public wedding_time?: string;
    public venue_name!: string;
    public venue_address!: string;
    public ceremony_time?: string;
    public ceremony_location?: string;
    public reception_time?: string;
    public reception_location?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;

    public static associations: {
      rsvps: Association<Wedding, any>;
      messages: Association<Wedding, any>;
      photos: Association<Wedding, any>;
    };

    static associate(models: any) {
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
      paranoid: true,
      indexes: [
        {
          fields: ['wedding_date'],
        },
      ],
    }
  );
  return Wedding;
};
