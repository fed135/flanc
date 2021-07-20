import { createServer } from 'flanc/server';
import JSONRouter from '@flanc/router-json';
import GraphQLRouter from '@flanc/router-graphql';

/**
 * First, prepare the main app router
 */

const server = createServer();

/**
 * Set app middleware
 */
// server.middleware()

/**
 * Set app monitoring
 */
// server.monitoring();

/**
 * Load subrouters
 */
server.router(JSONRouter);
server.router(GraphQLRouter);

/**
 * Declare the registry of domains to load
 */

server.registry('./packages/domain/registry');

/**
 * Start the server
 */
server.start();

export default server;
