import { sanitize } from 'flanc/data-model';

export function append(
  master: { [key: string]: Serializable },
  resolvers: {},
  scalars: {},
  schema: { model?: DataModel, related?: Serializable, scalar?: Serializable, definition?: { [attribute: string]: string } } = {}
) {
  if (schema.definition) {
    Object.keys(schema.definition).forEach((key) => {
      if (!master[key]) master[key] = schema.definition[key];
    });
  }

  if (schema.related) {
    schema.related.forEach((related: Serializable) => append(master, resolvers, scalars, related));
  }

  if (schema.model) {
    sanitize(schema.model);
    Object.assign(resolvers, mapAttributesResolver(schema.model));
  }

  if (schema.scalar) Object.assign(scalars, schema.scalar);
}

export function compile(master: { [key: string]: Serializable }, scalar: string, queries: string[], mutations: string[]) {
  const bundledModels = Object.values(master).reduce((acc, curr) => {
    return `${acc}\n${curr}`;
  }, '');

  const queryString = queries.length > 0 ? `type Query {\n${queries.join('\n')}\n}` : '';
  const mutationString = mutations.length > 0 ? `type Mutation {\n${mutations.join('\n')}\n}` : '';
  return `${scalar}\n${bundledModels}\n${queryString}\n${mutationString}`;
}

export function mapAttributesResolver(model: DataModel) {
  const modelName = `${model.type[0].toUpperCase()}${model.type.slice(1)}`;
  const modelResolvers: {[attribute: string]: (obj: any, params?: any, context?: Context) => any} = {};

  for (const attribute in model.attributes) {
    if (model.attributes.hasOwnProperty(attribute)) {
      modelResolvers[attribute.replace('-', '_')] = model.attributes[attribute].resolver;
    }
  }

  for (const relationship in model.relationships) {
    if (model.relationships.hasOwnProperty(relationship)) {
      modelResolvers[relationship.replace('-', '_')] = (obj, args, context) => {
        return model.relationships[relationship].resolver(obj, {
          context,
          params: { ...args, ...context.params, relationship },
        });
      };
    }
  }

  return {
    [modelName]: modelResolvers,
  };
}
