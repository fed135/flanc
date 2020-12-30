const hostUtils = require('./utils/host');

module.exports = {
  host: hostUtils.buildHost(),
  https: false,
  gateway: {
    host: hostUtils.buildGatewayHost(),
    https: true,
  },
  newrelic: {
    app_name: `DEV <project_name>${(process.env.AWS_REGION === 'ca-central-1') ? '' : ' EU'}`,
  },
  services: {
    hipay: {
      callbackUrl: `https://${hostUtils.buildGatewayHost()}/html/bank-linking/auth-callback/v1/treezor-hipay/3DS`,
      corporateUserId: process.env.HIPAY_CORPORATE_USER_ID || '686061',
      corporateWalletId: process.env.HIPAY_CORPORATE_WALLET_ID || '1273462',
    },
    plaid: {
      host: 'https://development.plaid.com',
      env: 'https://development.plaid.com',
    },
  },
};
