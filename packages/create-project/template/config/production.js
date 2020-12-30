const hostUtils = require('./utils/host');

module.exports = {
  database: {
    db: '<project_name>ProdServer',
    settings: {
      poolSize: 100,
      ssl: true,
    },
  },
  host: hostUtils.buildHost(),
  https: false,
  gateway: {
    host: hostUtils.buildGatewayHost(),
    https: true,
  },
  newrelic: {
    app_name: `PROD <project_name>${(process.env.AWS_REGION === 'ca-central-1') ? '' : ' EU'}`,
  },
  services: {
    contentful: {
      environment: 'master',
    },
    equifax: {
      environment: 'A01PACK',
      host: 'https://www.equifax.ca',
    },
    hipay: {
      callbackUrl: `https://${hostUtils.buildGatewayHost()}/html/bank-linking/auth-callback/v1/treezor-hipay/3DS`,
      corporateUserId: process.env.HIPAY_COPORATE_USER_ID,
      corporateWalletId: process.env.HIPAY_COPORATE_WALLET_ID,
    },
    treezor: {
      host: 'https://treezor.com/v1',
    },
    plaid: {
      host: 'https://production.plaid.com',
      env: 'https://production.plaid.com',
    },
  },
};
