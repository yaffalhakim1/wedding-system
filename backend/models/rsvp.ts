'use strict';

import { Model, DataTypes, Sequelize, Optional, Association } from 'sequelize';

// Define the attendance status enum
export type AttendanceStatus = 'attending' | 'not_attending' | 'maybe';

// Interface for RSVP attributes
export interface RsvpAttributes {
  id: string;
  weddingId: string;
  guest_name: string;
  guest_email?: string | null;
  guest_phone?: string | null;
  attendance_status: AttendanceStatus;
  number_of_guests: number;
  dietary_restrictions?: string | null;
  special_requests?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// Interface for RSVP creation attributes (optional id and timestamps)
export interface RsvpCreationAttributes extends Optional<RsvpAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'guest_email' | 'guest_phone' | 'dietary_restrictions' | 'special_requests'> {}

// RSVP model class
export class Rsvp extends Model<RsvpAttributes, RsvpCreationAttributes> implements RsvpAttributes {
  public id!: string;
  public weddingId!: string;
  public guest_name!: string;
  public guest_email!: string | null;
  public guest_phone!: string | null;
  public attendance_status!: AttendanceStatus;
  public number_of_guests!: number;
  public dietary_restrictions!: string | null;
  public special_requests!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // Associations
  public static associations: {
    wedding: Association<Rsvp, any>;
  };

  static associate(models: any): void {
    Rsvp.belongsTo(models.Wedding, {
      foreignKey: 'weddingId',
      as: 'wedding'
    });
  }
}

export default (sequelize: Sequelize, DataTypes: typeof import('sequelize').DataTypes) => {
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
      paranoid: true,
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