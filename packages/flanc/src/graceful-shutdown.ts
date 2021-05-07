import { AppServer, ExpressAppServer } from './express-types';
import config from 'config';
import stoppable from 'stoppable';
import { stopStatisticsPolling } from './store';

const shutdownRoutine = {
  active: false,
  ...config.shutdown,
};

function shutdown(server: AppServer, onShutdown?: (server: AppServer) => any) {
  if (!shutdownRoutine.active) {
    shutdownRoutine.active = true;
    stopStatisticsPolling();
    server.ready = false;
    if (onShutdown) onShutdown(server);
    setTimeout(server.stop, shutdownRoutine.serverClose);
  }
}

function shutdownRequest(signal: string, server: AppServer, onShutdown: (server: AppServer) => any) {
  return () => {
    process.stderr.write(signal);
    shutdown(server, onShutdown);
  };
}

export default function gracefulShutdown(app: ExpressAppServer, onShutdown: (server: AppServer) => any) {
  // Modern http compatibility layer
  
  app.server.close = app.server.close || app.server.stop;
  process.on('SIGTERM', shutdownRequest('SIGTERM', app.server, onShutdown));
  process.on('SIGINT', shutdownRequest('SIGINT', app.server, onShutdown));

  return stoppable(app.server, shutdownRoutine.appKill - shutdownRoutine.serverClose);
}
