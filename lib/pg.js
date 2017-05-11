'use strict';

const assert = require('assert');
const pgp = require('pg-promise')();

let count = 0;

module.exports = app => {
  app.addSingleton('pg', createOneClient);
};

function createOneClient(config, app) {
  assert(config.host && config.port && config.user && config.database,
    `[egg-pg] 'host: ${config.host}', 'port: ${config.port}', 'user: ${config.user}', 'database: ${config.database}' are required on config`);

  app.coreLogger.info('[egg-pg] connecting %s@%s:%s/%s',
    config.user, config.host, config.port, config.database);

  let pg = pgp(config);
  pg = Object.unfreeze(pg);
  app.beforeStart(function* () {
    const rows = yield pg.any('select now() as currentTime;');
    const index = count++;
    app.coreLogger.info(`[egg-pg] instance[${index}] status OK, pg currentTime: ${rows[0].currenttime}`);
  });
  return pg;
}

Object.unfreeze = function (o) {
  var oo = undefined;
  if (o instanceof Array) {
    oo = []; var clone = function (v) { oo.push(v) };
    o.forEach(clone);
  } else if (o instanceof String) {
    oo = new String(o).toString();
  } else if (typeof o == 'object') {

    oo = {};
    for (var property in o) { oo[property] = o[property]; }


  }
  return oo;
}