type Serializable = string | number | boolean | { [key: string]: Serializable } | Array<Serializable>;

type Service = {
  basePath?: string
  headers?: { [key: string]: Serializable }
  host: string
  query?: { [key: string]: Serializable }
  [key: string]: Serializable
};

type ConfigDefinition = {
  auth: {
    jwtSecret: string
    expiresAt: number
  }
  debug: {
    stackSize: number
  }
  fetch: {
    requestTimeout: number
    tieredCacheEnabled: boolean
    tieredCacheMetricsEnabled: boolean
  }
  gateway: {
    host: string
    https: boolean
  }
  i18next: {
    translationFilePath: string
  }
  routers: {
    common: {
      clientCacheTimeout: number
    },
    json: {
      maxRelationshipDepth: number
    }
  }
  server: {
    host: string
    https: boolean
    httpsCredentials: {
      cert: string
      key: string
    }
    port: number
  }
  services: {
    [K in null]: Service
  }
  shutdown: {
    appKill: number
    serverClose: number
  }
};

declare module 'config' {
  var config: ConfigDefinition; // eslint-disable-line vars-on-top
  export default config;
}
