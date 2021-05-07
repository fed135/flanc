const { join } = require('path');

module.exports = {
  auth: { jwtSecret: 'abc' },
  debug: { stackSize: 10 },
  fetch: {
    requestTimeout: 20000,
    tieredCacheEnabled: true,
    tieredCacheMetricsEnabled: false,
  },
  gateway: {
    host: 'localhost:9001',
    https: false,
  },
  i18next: { translationFilePath: join(__dirname, 'locales/{{lng}}/translation.json') },
  routers: {
    common: { clientCacheTimeout: 1 },
    json: { maxRelationshipDepth: 8 },
  },
  server: {
    host: 'localhost:9001',
    https: false,
    port: 9001,
  },
  services: {},
  shutdown: {
    appKill: 10,
    serverClose: 20,
  },
};
