const openApiTypes = {
  string: () => 'String',
  number: () => 'Float',
  integer: () => 'Int',
  array: (attribute: AttributeParams|RelationshipParams<any>, name: string, model: Partial<_Model>) => {
    if (!attribute?.items?.type) throw new Error(`Missing type definition for ${name} in model ${model.type}`);
    return `[${openApiTypes[attribute.items.type](attribute.items, `${name}0`, model)}]`;
  },
  boolean: () => 'Boolean',
  object: (attribute: AttributeParams|RelationshipParams<any>, name: string) => {
    if (!attribute.graphqlEntity) return `${name[0].toUpperCase() + name.substr(1)}`;
    return attribute.graphqlEntity;
  },
};

const scalarTypeProperties = ['name', 'description', 'serialize', 'parseValue', 'parseLiteral'];

export function isValidGraphQLScalar(scalarType) {
  return scalarType.constructor.name === 'GraphQLScalarType' || scalarTypeProperties.every((prop) => prop in scalarType);
}

export function compile(model: Partial<_Model>): _Model {
  if (!model.type) throw new Error('Could not compile model, missing critical field "type". Give your model a name which will be used by supported routers');

  const tempSchema = [`type ${model.type[0].toUpperCase() + model.type.substr(1)} {\n`];

  if (model.attributes) {
    for (const attribute in model.attributes) {
      if (model.attributes.hasOwnProperty(attribute)) {
        if (!(model.attributes[attribute].type in openApiTypes)) {
          throw new Error(`Invalid type "${model.attributes[attribute].type}" property on attribute "${attribute}" for model "${model.type}"`);
        }
        if (typeof model.attributes[attribute].resolver !== 'function') {
          model.attributes[attribute].resolver = (entity: Serializable) => entity[attribute];
        }
        model.attributes[attribute].description = model.attributes[attribute].description || attribute;
        if (!model.schema) {
          if (model.attributes[attribute].scalarType) {
            if (!isValidGraphQLScalar(model.attributes[attribute].scalarType)) {
              throw new Error(`Scalar type is invalid for attribute ${attribute} on model ${model.type}`);
            }
            tempSchema.push(`${attribute}:${model.attributes[attribute].scalarType.name}`);
          } else tempSchema.push(`${attribute}:${openApiTypes[model.attributes[attribute].type](model.attributes[attribute], attribute, model)}`);

          tempSchema.push(model.attributes[attribute].required ? '!\n' : '\n');
        }
      }
    }
  }
  if (model.relationships) {
    for (const relationship in model.relationships) {
      if (model.relationships.hasOwnProperty(relationship)) {
        if (typeof model.relationships[relationship].type !== 'string') {
          throw new Error(`Missing type for relationship "${relationship}" for model "${model.type}"`);
        }
        if (typeof model.relationships[relationship].resolver !== 'function') {
          throw new Error(`Missing resolver for relationship "${relationship}" for model "${model.type}"`);
        }

        const typeName = model.relationships[relationship].graphqlEntity || model.relationships[relationship].type;
        tempSchema.push(`${relationship}:${openApiTypes[model.relationships[relationship].type](model.relationships[relationship], typeName, model)}`);
      }
    }
  }
  if (model.members) {
    for (const method in model.members) {
      if (model.members.hasOwnProperty(method)) {
        if (typeof model.members[method] !== 'function') {
          throw new Error(`Member "${method}" is not a function for model "${model.type}"`);
        }
      }
    }
  }
  if (!model.schema) {
    model.schema = tempSchema.join('') + '}\n\n';
  }

  return model as _Model;
}
