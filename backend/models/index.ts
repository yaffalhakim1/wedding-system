'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes, Model } from 'sequelize';
import process from 'process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

interface DbInterface {
  [key: string]: any;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

// Dynamic import for config
const configModule = await import(`../config/database.js`);
const config = configModule.default[env as keyof typeof configModule.default];
const db: DbInterface = {} as DbInterface;

let sequelize;
if ('use_env_variable' in config && (config as any).use_env_variable) {
  sequelize = new Sequelize(process.env[(config as any).use_env_variable]!, config);
} else {
  sequelize = new Sequelize(config.database!, config.username!, config.password!, config);
}

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.js' || file.slice(-3) === '.ts') &&
      file.indexOf('.test.js') === -1
    );
  });

for (const file of modelFiles) {
  const modelModule = await import(path.join(__dirname, file));
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;