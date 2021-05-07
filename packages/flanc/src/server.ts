import context from './context';
import express from 'express';
import gracefulShutdown from './graceful-shutdown';
import healthcheck from './healthcheck';
import http from 'http';
import https from 'https';
import Logger from './logging';
import { NotFound } from './errors';
import security from './security';
import { setMonitoringModule } from './monitoring';
import { ExpressAppServer, ExpressMiddleware, ExpressRequest } from './express-types';

const logger = Logger('core/server');

function applyPlugins(app: ExpressAppServer): ExpressAppServer {
  gracefulShutdown(app);
  app.use(security as ExpressMiddleware);
  app.use(context as ExpressMiddleware);
  return app;
}

function loadErrorHandlers(app: ExpressAppServer): ExpressAppServer {
  app.use(function routeNotFoundHandler(req: ExpressRequest) {
    throw NotFound('The requested content was not found.', req.context);
  });

  app.use(function errorWrapper(err, req, res, next) {
    res.status(err.status || 500).send(err);
    next();
  });

  return app;
}

function listen(app: ExpressAppServer, config): Promise<ExpressAppServer> {
  return new Promise((resolve) => {
    app.server.listen(config.server.port, () => {
      app.server.ready = true;
      logger.log(`Listening on port ${config.server.port}`);
      resolve(app);
    });
  });
}

export function createServer() {
  process.on('unhandledRejection', (err: Error) => logger.error(`unhandledRejection: ${err.stack}`));

  const app: ExpressAppServer = express();
  const server: http.Server | https.Server = (config.server.https === true) ? https.createServer(config.server.httpsCredentials, app) : http.createServer(app);
  app.server = server;
  app._routers = [];
  app._registryLocation;
  app._extraMiddleware = [];
  
  return {
    app: () => app,
    registry: (path: string) => app._registryLocation = path,
    router: (router, { mountPath }: { mountPath?: string}) => {
      const routerInstance = router(app, express.Router);
      app._routers.push(routerInstance);
      app.use(mountPath || router.defaultMountPath, routerInstance);
    },
    middleware: (module) => app._extraMiddleware.push(module),
    monitoring: (moduleName: string, module) => setMonitoringModule(moduleName, module),
    start: () => {
      return Promise.resolve()
        .then(() => {
          applyPlugins(app);
          require(app._registryLocation);
          app._extraMiddleware.forEach((module) => app.use(module))
          healthcheck(app);
        })
        .then(() => Promise.all(app._routers.map(router => router.start())))
        .then(() => {
          loadErrorHandlers(app)
          return listen(app, config);
        })
    },
    stop: () => {

    },
  };
}
