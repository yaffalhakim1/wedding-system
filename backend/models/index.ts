'use strict';

import { Sequelize, DataTypes, Model } from 'sequelize';
import process from 'process';
import dbConfig from '../config/database.js';

// Import all models directly
import weddingModel from './wedding.js';
import rsvpModel from './rsvp.js';
import messageModel from './message.js';
import photoModel from './photo.js';
import auditLogModel from './auditLog.js';

const env = process.env.NODE_ENV || 'development';

interface DbInterface {
  [key: string]: any;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

// Use imported config
const config = dbConfig[env as keyof typeof dbConfig];
const db: DbInterface = {} as DbInterface;

let sequelize;
if ('use_env_variable' in config && (config as any).use_env_variable) {
  sequelize = new Sequelize(process.env[(config as any).use_env_variable]!, config);
} else {
  sequelize = new Sequelize(config.database!, config.username!, config.password!, config);
}

// Initialize models manually
const Wedding = weddingModel(sequelize, DataTypes);
const Rsvp = rsvpModel(sequelize, DataTypes);
const Message = messageModel(sequelize, DataTypes);
const Photo = photoModel(sequelize, DataTypes);
const AuditLog = auditLogModel(sequelize, DataTypes);

// Add models to db object
db.Wedding = Wedding;
db.Rsvp = Rsvp;
db.Message = Message;
db.Photo = Photo;
db.AuditLog = AuditLog;

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;