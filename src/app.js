import express from 'express';
import config from './config/index';

import mongoConfig from './commons/dbController/index';
import DBController from './commons/dbController/dbController';
import path from 'path';

const app = express();

(async function () {
  // Express Configuration
  require('./config/expressConfig').expressConfig(app);

  // Mongo Configuration
  await mongoConfig.connect(config.dbConfig.uri);

  // db controller instance 
  global.dbController = new DBController();

  // Swagger
  require('./config/swaggerConfig/index').index(app);

  // Server 
  app.listen(config.server.port, config.server.ip, () => {
    console.log('Server running on port ', config.server.port);
  });

  const root = path.normalize(__dirname);
  app.use('/', express.static(root+'/public'));
  
  app.get('/', (req, res) => {
    res.send("Welcome, Read a book !");
  });
  
})();

module.exports = app;