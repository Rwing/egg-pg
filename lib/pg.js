'use strict';

const assert = require('assert');
const pg = require('pg');

let count = 0;

module.exports = app => {
  app.addSingleton('pg', createOneClient);
};

function createOneClient(config, app) {
  assert(config.host && config.port && config.user && config.database,
    `[egg-pg] 'host: ${config.host}', 'port: ${config.port}', 'user: ${config.user}', 'database: ${config.database}' are required on config`);

  app.coreLogger.info('[egg-pg] connecting %s@%s:%s/%s',
    config.user, config.host, config.port, config.database);
  
  const pool = new pg.Pool(config);

  app.beforeStart(function* () {
    const rows = yield pool.query('select now() as currentTime;');
    const index = count++;
    app.coreLogger.info(`[egg-pg] instance[${index}] status OK, pg currentTime: ${rows.rows[0].currenttime}`);
  });
  return pool;
}