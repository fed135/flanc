export const identifier = {
  name: 'id',
  in: 'path',
  description: 'Resource identifier',
  type: 'string',
  required: true,
};

export const optionalAuthorization = {
  name: 'authorization',
  in: 'headers',
  description: 'The authentication token',
  type: 'string',
  pattern: '^Bearer [A-Za-z0-9+./_=-]*$',
};

export const requiredAuthorization = {
  name: 'authorization',
  in: 'headers',
  description: 'The authentication token',
  type: 'string',
  required: true,
  pattern: '^Bearer [A-Za-z0-9+./_=-]*$',
};

export const country = {
  name: 'country',
  in: 'query',
  description: 'The country of origin for the request',
  type: 'string',
  pattern: '^[A-Z]{2}$',
};

export const language = {
  name: 'language',
  in: 'query',
  description: 'Target language',
  type: 'string',
  enum: [
    'en',
    'fr',
  ],
};

type IncludeParams = {
  maxDepth?: number
  whitelist?: string[]
  blacklist?: string[]
}

export function include(model: DataModel, { maxDepth, whitelist, blacklist }: IncludeParams = {}) {
  const relationships = Object.keys(model.relationships);

  return {
    name: 'include',
    in: 'query',
    description: `Relationships to include in the response [${Object.keys(model.relationships).toString()}]`,
    type: 'array',
    'x-direct-relations': relationships,
    'x-include-rules': { 'max-depth': maxDepth, whitelist, blacklist },
    items: {
      type: 'string',
    },
  };
}

export function fields(type: string, model?: DataModel | { attributes: string[] }) {
  const base = {
    name: `fields[${type}]`,
    in: 'query',
    description: `${type} fields to show`,
    type: 'array',
    items: { type: 'string', enum: [''] },
  };
  if (model) {
    base.items.enum = base.items.enum.concat(Array.isArray(model.attributes) ? model.attributes : Object.keys(model.attributes));
  }
  return base;
}

export function pageNumber(defaultPage: number) {
  return {
    name: 'page[number]',
    in: 'query',
    description: 'Page number',
    type: 'integer',
    format: 'int32',
    minimum: 1,
    default: defaultPage || 1,
  };
}

export function nestedPageNumber(type: string) {
  return {
    name: `page[${type}][number]`,
    in: 'query',
    description: `Page number for type '${type}'`,
    type: 'integer',
    format: 'int32',
    minimum: 1,
    default: 1,
  };
}

export function pageSize(defaultSize: number) {
  const definition: Serializable = {
    name: 'page[size]',
    in: 'query',
    description: 'Items per page',
    type: 'integer',
    format: 'int32',
    minimum: 0,
    maximum: 200,
  };
  if (defaultSize) {
    definition.default = defaultSize;
  }
  return definition;
}

export function nestedPageSize(type: string, options: Serializable) {
  const definition: Serializable = {
    name: `page[${type}][size]`,
    in: 'query',
    description: `Items per page for type '${type}'`,
    type: 'integer',
    format: 'int32',
    minimum: 0,
    maximum: 20,
  };
  if (options.defaultSize) {
    definition.default = options.defaultSize;
  }
  return definition;
}

export function pageOffset(defaultValue: number) {
  return {
    name: 'page[offset]',
    in: 'query',
    description: 'Items to shift in the results.',
    type: 'integer',
    format: 'int32',
    default: defaultValue || 0,
  };
}

export const errorObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'int64',
      example: '235711131719',
    },
    status: {
      type: 'string',
    },
    code: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    detail: {
      type: 'string',
    },
    source: {
      type: 'object',
      properties: {
        pointer: {
          type: 'string',
        },
        parameter: {
          type: 'string',
        },
      },
    },
    meta: {
      type: 'object',
      additionalProperties: true,
    },
  },
};
