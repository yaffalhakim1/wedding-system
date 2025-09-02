'use strict';

import { Model, DataTypes, Sequelize, Optional, Association } from 'sequelize';

// Interface for Photo attributes
export interface PhotoAttributes {
  id: string;
  weddingId: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by?: string | null;
  caption?: string | null;
  is_approved: boolean;
  approved_at?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// Interface for Photo creation attributes (optional id, timestamps, and approval fields)
export interface PhotoCreationAttributes extends Optional<PhotoAttributes, 'id' | 'createdAt' | 'updatedAt' | 'uploaded_by' | 'caption' | 'is_approved' | 'approved_at'> {}

// Photo model class
export class Photo extends Model<PhotoAttributes, PhotoCreationAttributes> implements PhotoAttributes {
  public id!: string;
  public weddingId!: string;
  public filename!: string;
  public original_name!: string;
  public file_path!: string;
  public file_size!: number;
  public mime_type!: string;
  public uploaded_by!: string | null;
  public caption!: string | null;
  public is_approved!: boolean;
  public approved_at!: Date | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associations: {
    wedding: Association<Photo, any>;
  };

  static associate(models: any): void {
    Photo.belongsTo(models.Wedding, {
      foreignKey: 'weddingId',
      as: 'wedding'
    });
  }
}

export default (sequelize: Sequelize, DataTypes: typeof import('sequelize').DataTypes) => {
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
      paranoid: true,
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