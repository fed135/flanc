import { createServer } from 'flanc/server';
import JSONRouter from '@flanc/router-json';

/**
 * First, prepare the main app router
 */

const server = createServer();

/**
 * Set app monitoring
 */
// server.monitoring();

/**
 * Load subrouters
 */
server.router(JSONRouter);

/**
 * Declare the registry of domains to load
 */

server.registry('./packages/domain/registry');

/**
 * Set app middleware
 */
// server.middleware()

/**
 * Start the server
 */
server.start();

export default server;
