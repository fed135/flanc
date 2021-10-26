import { Context, Model } from 'flanc';

type Schema = {
  model?: Model
  related?: Schema[]
  scalar?: Serializable
  definition?: { [attribute: string]: string }
}

export function append(
  master: { [key: string]: Serializable },
  resolvers: {},
  scalars: string[],
  model: Partial<_Model> = {}
) {
  if (model.schema) {
    if (!master[model.type]) master[model.type] = model.schema;
  }

  if (model.relationships) {
    for (const related in model.relationships) {
      if (model.relationships.hasOwnProperty(related) && model.relationships[related].model) {
        append(master, resolvers, scalars, model.relationships[related].model);
      }
    }
  }

  if (model.attributes) {
    Object.assign(resolvers, mapAttributesResolver(model, scalars));
  }
}

export function compile(master: { [key: string]: Serializable }, scalar: string[], queries: string[], mutations: string[]) {
  const bundledModels = Object.values(master).reduce((acc, curr) => {
    return `${acc}\n${curr}`;
  }, '');

  const queryString = queries.length > 0 ? `type Query {\n${queries.join('\n')}\n}` : '';
  const mutationString = mutations.length > 0 ? `type Mutation {\n${mutations.join('\n')}\n}` : '';
  const scalarString = scalar.map((scalarType) => `scalar ${scalarType}`).join('\n');
  return `${scalarString}\n${bundledModels}\n${queryString}\n${mutationString}`;
}

export function mapAttributesResolver(model: Partial<_Model>, scalars) {
  const modelName = `${model.type[0].toUpperCase()}${model.type.slice(1)}`;
  const modelResolvers: {[attribute: string]: (obj: any, params?: any, context?: Context) => any} = {};
  const scalarResolvers = {};

  for (const attribute in model.attributes) {
    if (model.attributes.hasOwnProperty(attribute)) {
      modelResolvers[attribute.replace('-', '_')] = model.attributes[attribute].resolver;
      if (model.attributes[attribute].scalarType && !(scalars.includes(model.attributes[attribute].scalarType.name))) {
        scalars.push(model.attributes[attribute].scalarType.name);
        scalarResolvers[model.attributes[attribute].scalarType.name] = model.attributes[attribute].scalarType;
      }
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
    ...scalarResolvers,
  };
}
