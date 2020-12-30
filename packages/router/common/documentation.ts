import config from 'config';
import { errorObject } from './parameters';

const wrapModelResponse = (type: string) => {
  return { type: 'object', properties: { data: { $ref: `#/definitions/${type}` } } };
};

const wrapMetaResponse = () => {
  return { type: 'object', properties: { meta: { type: 'object' } } };
};

const defaultResponse = {
  description: 'Errors',
  type: 'object',
  required: ['errors'],
  properties: {
    errors: {
      type: 'array',
      items: errorObject,
    },
  },
};

function dataModelAsDefinition(model: DataModel) {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      type: { type: 'string', enum: [model.type] },
      attributes: {
        type: 'object',
        properties: model.attributes,
      },
      relationships: { type: 'object', description: Object.keys(model.relationships).join(',') },
    },
  };
}

function domainAsDefinition(domain: JsonApiRoute): JsonApiRoute {
  return {
    path: domain.path,
    method: domain.method,
    parameters: domain.parameters,
    description: domain.description,
    operationId: domain.operationId,
    tags: domain.tags,
    'x-client-cache': domain.clientCache,
    responses: {
      200: { schema: domain.model ? wrapModelResponse(domain.model.type) : wrapMetaResponse() },
      default: defaultResponse,
    },
  };
}

export const swaggerBase = {
  swagger: '2.0',
  info: {
    description: 'The <project_name> API',
    version: '0.0.0',
    title: '<project_name> API',
  },
  host: config.host,
  basePath: '/jsonapi',
  schemes: [
    'http',
    'https',
  ],
  consumes: ['application/json', 'application/x-www-form-urlencoded'],
  produces: ['application/json'],
};

type Spec = {
  [key: string]: JsonApiRoute
}

export function expressTokensToSwagger(path) {
  return path.replace(/(:[a-zA-Z0-9\-\_]+)/g, (key) => `{${key.substring(1)}}`);
}

export function render(spec: Spec) {
  const routes = Object.keys(spec);
  return {
    ...swaggerBase,
    paths: routes.reduce((acc, route) => {
      const pathName = expressTokensToSwagger(spec[route].path);
      if (!acc[pathName]) acc[pathName] = {};
      acc[pathName][spec[route].method] = domainAsDefinition(spec[route]);
      return acc;
    }, {}),
    definitions: routes.reduce((acc, route) => {
      if (spec[route].model) acc[spec[route].model.type] = dataModelAsDefinition(spec[route].model);
      return acc;
    }, {}),
  };
}
