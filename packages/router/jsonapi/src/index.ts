/* istanbul ignore file */

import { register as commonRouterRegister } from 'flanc/router-commons';
import { render as renderDocumentation } from 'flanc/router-commons/documentation';
import { _JsonApiRoute } from '../types';

let router;

export const path = '/jsonapi';

function printDocumentation(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).json(renderDocumentation(router._spec));
}

export function errorHandler(err, req, res, next) {
  if (!req.path.match(new RegExp(`^${path}`))) {
    next(err);
    return;
  }

  res.status(err.status || 500).send(err);
  next();
}

export function setupRouter(RouterConstructor) {
  router = new RouterConstructor();
  router._spec = {};
  if (process.env.NODE_ENV !== 'production') router.get('/docs', printDocumentation);
  return router;
}

function formatter(data) {
  return (typeof data === 'string') ? data : JSON.stringify(data);
}

export function register(route: _JsonApiRoute) {
  commonRouterRegister(route, router, {
    supportedMethods: ['get', 'post', 'patch', 'delete'],
    responseHeaders: { 'content-type': 'application/json' },
    formatError: (error) => formatter(error),
    formatResponse: (response) => formatter(response),
  });
}
