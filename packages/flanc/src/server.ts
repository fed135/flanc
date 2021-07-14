import config from 'config';
import context from './context';
import express from 'express';
import gracefulShutdown from './graceful-shutdown';
import healthcheck from './healthcheck';
import { createServer as createHTTPServer, Server } from 'http';
import { createServer as createHTTPSServer, Server as SecureServer } from 'https';
import Logger from './logging';
import { NotFound } from './errors';
import security from './security';
import { setMonitoringModule } from './monitoring';
import { ExpressAppServer, ExpressMiddleware, ExpressRequest } from 'flanc/express-types';

const logger = Logger('core/server');

function applyPlugins(app: ExpressAppServer): ExpressAppServer {
  gracefulShutdown(app);
  app.use(security as ExpressMiddleware);
  app.use(context as ExpressMiddleware);
  return app;
}

function loadErrorHandlers(app: ExpressAppServer): ExpressAppServer {
  // @ts-ignore
  app.use(function routeNotFoundHandler(req: ExpressRequest) {
    throw NotFound('The requested content was not found.', req.context);
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

  // @ts-ignore
  const app: ExpressAppServer = express();
  const server: Server | SecureServer = (config.server.https === true) ? createHTTPSServer(config.server.httpsCredentials, app as any) : createHTTPServer(app as any);
  app.server = server;
  app._routers = [];
  app._registryLocation;
  app._extraMiddleware = [];

  return {
    app: () => app,
    registry: (path: string) => app._registryLocation = path,
    router: (router, { mountPath }: { mountPath?: string} = {}) => {
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
          import(app._registryLocation);
          app._extraMiddleware.forEach((module) => app.use(module));
          healthcheck(app);
        })
        .then(() => Promise.all(app._routers.map((router) => router.start())))
        .then(() => {
          loadErrorHandlers(app);
          return listen(app, config);
        });
    },
    stop: () => {

    },
  };
}
