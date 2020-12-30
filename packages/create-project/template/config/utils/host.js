const currentRegion = !process.env.AWS_REGION || process.env.AWS_REGION === 'ca-central-1' ? 'ca' : 'eu';

function buildHost(env) {
  return `<project_name>.${env || process.env.NODE_ENV}${currentRegion === 'ca' ? '' : '.eu'}.<project_name>.ai`;
}

function buildGatewayHost(env) {
  return `gateway.${currentRegion === 'ca' ? 'ca' : 'eu'}.<project_name>.ai/${env || process.env.NODE_ENV}/v2`;
}

module.exports = {
  buildGatewayHost,
  buildHost,
};
