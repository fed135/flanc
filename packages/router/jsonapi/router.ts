/* istanbul ignore file */

import { router as commonRouter } from '@<project_name>/router-common/router';
import { render as renderDocumentation } from '@<project_name>/router-common/documentation';

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

export function register(route: JsonApiRoute) {
  commonRouter.register(route, router, {
    supportedMethods: ['get', 'post', 'patch', 'delete'],
    responseHeaders: { 'content-type': 'application/json' },
    formatError: (error) => formatter(error),
    formatResponse: (response) => formatter(response),
  });
}
