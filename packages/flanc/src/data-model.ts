export function sanitize(model: _Model): any {
  const attributes = model.attributes;
  const type = model.type;

  if (!type) throw new Error('Missing "type" property on model');

  const dataTypes = ['string', 'number', 'integer', 'array', 'boolean', 'object'];

  for (const attribute in attributes) {
    if (attributes.hasOwnProperty(attribute)) {
      if (!dataTypes.includes(attributes[attribute].type)) {
        throw new Error(`Invalid type "${attributes[attribute].type}" property on attribute "${attribute}" for model "${type}"`);
      }
      if (typeof attributes[attribute].resolver !== 'function') {
        attributes[attribute].resolver = (entity: Serializable) => entity[attribute];
      }
      attributes[attribute].description = attributes[attribute].description || attribute;
    }
  }

  return attributes;
};

export function DataModel<M extends _Model>(model: M): M {
  return model;
}
