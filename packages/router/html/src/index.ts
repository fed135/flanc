/* istanbul ignore file */

import { router as commonRouter } from 'flanc/router-commons';
import { render as renderDocumentation } from 'flanc/router-commons/documentation';

export const path = '/html';
let router;

function printDocumentation(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).json(renderDocumentation(router._spec));
}

const formatError = (error) => {
  const status = error.status || 500;
  const message = error.message || 'An unknown error occured.';
  const title = error.title || 'Internal Server Error';
  return `<!DOCTYPE html><html><title>Error</title><h1>${title} (${status})</h1><p>${message}</p></html>`;
};

export function errorHandler(err, req, res, next) {
  if (!req.path.match(new RegExp(`^${path}`))) {
    next(err);
    return;
  }

  res.status(err.status || 500).send(formatError(err));
  next();
}

export function setupRouter(RouterConstructor) {
  router = new RouterConstructor();
  router._spec = {};
  if (process.env.NODE_ENV !== 'production') router.get('/docs', printDocumentation);
  return router;
}

export function register(route: HtmlRoute) {
  commonRouter.register(route, router, {
    supportedMethods: ['get', 'post'],
    responseHeaders: { 'content-type': 'text/html; charset=UTF-8' },
    formatError,
    formatResponse: (response) => response,
  });
}
