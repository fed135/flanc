require('dotenv').config();
const path = require('path');

module.exports = {
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    expiresAt: 60 * 60 * 24,
  },
  aws: {
    region: process.env.AWS_REGION,
    sqs: {
      batchMessageLimit: 10,
      queues: {}
    }
  },
  debug: {
    stackSize: 4,
  },
  fetch: {
    requestTimeout: 20000,
    tieredCacheEnabled: true,
  },
  gateway: {
    host: 'localhost:9001',
    https: false,
  },
  i18next: {
    translationFilePath: path.resolve(__dirname, '..', 'locales/{{lng}}/{{ns}}.json'),
  },
  routers: {
    common: {
      clientCacheTimeout: 3600, // 1 hour
    },
    json: {
      maxRelationshipDepth: 4,
    }
  },
  server: {
    host: 'localhost:9001',
    https: false,
    port: 9001,
  },
  services: {},
  shutdown: {
    appKill: 1000,
    serverClose: 100,
  }
};
