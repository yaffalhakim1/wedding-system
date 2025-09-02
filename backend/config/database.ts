import dotenv from 'dotenv';
import { Options } from 'sequelize';

dotenv.config();

interface DatabasePoolOptions {
  max: number;
  min: number;
  acquire: number;
  idle: number;
}

interface DatabaseConfig extends Options {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'mariadb';
  logging: boolean | ((sql: string, timing?: number) => void);
  pool: DatabasePoolOptions;
  dialectOptions?: {
    timezone: string;
    charset: string;
    collate: string;
  };
}

interface DatabaseConfigs {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

const config: DatabaseConfigs = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'wedding_db',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mariadb',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      timezone: '+00:00',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'wedding_invitation_test',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mariadb',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      timezone: '+00:00',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  },
  production: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mariadb',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      timezone: '+00:00',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  },
};

export default config;