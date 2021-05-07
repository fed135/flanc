import { ApiError } from '../errors';
import monitoring from './middleware/monitoring';
import { render } from './renderer';
import requestValidator from './middleware/request-validation';
import { to } from '../async';

function link(resolver, model, clientCache, specifications: RouterSpecifications) {
  return async (req) => {
    req.context.res.removeHeader('X-Powered-By');
    specifications.responseHeaders['x-request-id'] = req.context && req.context.id || 'null';

    let data;

    try {
      data = await resolver(req.context);
    } catch (error) {
      const formattedError = new ApiError(error, error.status || 500, error.stack, error.message, req.context);
      req.context.res.writeHead(formattedError.status, specifications.responseHeaders);
      return req.context.res.end(specifications.formatError(formattedError));
    }

    if (clientCache) specifications.responseHeaders['cache-control'] = clientCache;
    const [renderError, response] = await to(render({ context: req.context, data, model }));

    if (renderError) {
      req.context.res.writeHead(500, specifications.responseHeaders);
      return req.context.res.end(specifications.formatError(renderError));
    }

    if ([301, 302].includes(req.context.res.statusCode)) {
      return req.context.res.end(response);
    }

    req.context.res.writeHead(200, specifications.responseHeaders);
    req.context.res.end(specifications.formatResponse(response));
  };
}

function guardAgainstBadRouteIntegrity(route: Route, specifications: RouterSpecifications) {
  if (!(specifications.supportedMethods.includes(route.method))) throw new Error(`Invalid route verb ${route.method}`);
  if (route.method !== 'get') return;

  const pathParameterCount = route.path.match(/\/:/g)?.length || 0;
  const pathParameters = route.parameters.filter((p) => p.in === 'path');
  if (pathParameterCount !== pathParameters.length) {
    throw new Error(
      `Route path should contain ${pathParameters.length} parameters,` +
      ` only ${pathParameterCount} are declared (tags: ${route.tags.join('/')})`
    );
  }

  pathParameters.forEach((parameter) => {
    if (!route.path.match(new RegExp(`/:${parameter.name}`))) {
      throw new Error(`Route parameter '${parameter.name}' not found in route path (tags: ${route.tags.join('/')}).`);
    }
  });
}

function register(route: Route, router, specifications: RouterSpecifications) {
  if (!route.operationId) throw new Error(`Missing operation id for new route ${route.path}`);
  if (!route.resolver) throw new Error(`Missing resolver for new route ${route.path}`);

  const topics = (route.path || '/').split('/');

  route.path = route.path || '/';
  route.method = route.method || 'get';
  route.description = route.description || `${this.method} ${topics[topics.length - 1]}`;
  route.parameters = route.parameters || [];
  route.tags = route.tags || [topics[topics.length - 1]];

  guardAgainstBadRouteIntegrity(route, specifications);

  router._spec[`${route.method} ${route.path}`] = route;
  router[route.method](
    route.path, ...route.middlewares || [],
    requestValidator(router),
    monitoring,
    link(route.resolver, route.model, route.clientCache, specifications)
  );
}

export const router = {
  register,
};
