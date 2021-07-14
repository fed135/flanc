/* istanbul ignore file */

import { register as commonRouterRegister } from 'flanc/router-commons';
import { render as renderDocumentation } from 'flanc/router-commons/documentation';
import { _JsonApiRoute } from '../types';

let router;

function formatter(data) {
  return (typeof data === 'string') ? data : JSON.stringify(data);
}

export default function Router(app, RouterConstructor: any) {
  router = RouterConstructor();
  router._spec = {};

  function printDocumentation(req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).json(renderDocumentation(router._spec));
  }

  if (process.env.NODE_ENV !== 'production') router.get('/docs', printDocumentation);

  router.start = function start() {}
  router.stop = function stop() {}

  return router;
}

export function register(route: _JsonApiRoute) {
  commonRouterRegister(route, router, {
    supportedMethods: ['get', 'post', 'patch', 'delete'],
    responseHeaders: { 'content-type': 'application/json' },
    formatError: (error) => formatter(error),
    formatResponse: (response) => formatter(response),
  });
}

Router.defaultMountPath = '/json';
