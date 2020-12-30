const hostUtils = require('./utils/host');

module.exports = {
  host: hostUtils.buildHost('dev'),
  https: false,
  gateway: {
    host: hostUtils.buildGatewayHost('dev'),
    https: true,
  },
  newrelic: {
    app_name: `QA <project_name>${(process.env.AWS_REGION === 'ca-central-1') ? '' : ' EU'}`,
  },
  services: {
    hipay: {
      callbackUrl: `https://${hostUtils.buildGatewayHost('dev')}/html/bank-linking/auth-callback/v1/treezor-hipay/3DS`,
      corporateUserId: process.env.HIPAY_CORPORATE_USER_ID || '686061',
      corporateWalletId: process.env.HIPAY_CORPORATE_WALLET_ID || '1273462',
    },
    plaid: {
      host: 'https://development.plaid.com',
      env: 'https://development.plaid.com',
    },
  },
};
