function mapClientId() {
  const canadaMap = {
    dev: 55676549,
  };
  const europeMap = {
    dev: 41012287,
    production: 3567794,
    qa: 41012287,
  };
  const regionMap = {
    'ca-central-1': canadaMap,
    'eu-west-1': europeMap,
  };

  if (!process.env.NODE_ENV) return 54894695;
  if (!process.env.AWS_REGION) return;
  return regionMap[process.env.AWS_REGION][process.env.NODE_ENV];
}

function mapHost() {
  const canadaMap = {
    dev: 'https://<project_name>-sandbox.biapi.pro/2.0',
  };
  const europeMap = {
    dev: 'https://<project_name>-eu-sandbox.biapi.pro/2.0',
    production: 'https://<project_name>-eu.biapi.pro/2.0',
    qa: 'https://<project_name>-eu-sandbox.biapi.pro/2.0',
  };
  const regionMap = {
    'ca-central-1': canadaMap,
    'eu-west-1': europeMap,
  };

  if (!process.env.NODE_ENV) return 'https://<project_name>-localhost-sandbox.biapi.pro/2.0';
  if (!process.env.AWS_REGION) return;
  return regionMap[process.env.AWS_REGION][process.env.NODE_ENV];
}

module.exports = {
  mapClientId,
  mapHost,
};
