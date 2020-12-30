import { to } from '@<project_name>/core-util/async';

const asJsonApiObject = (data, model, context) => {
  const fieldList = context.params[`fields[${model.type}]`] ? context.params[`fields[${model.type}]`].split(',') : Object.keys(model.attributes);
  return fieldList.reduce((acc: any, key: string) => {
    if (model.attributes[key] && key !== 'id') acc.attributes[key] = data[key];
    return acc;
  }, { id: model.attributes.id.resolver(data), type: model.type, attributes: {} });
};

function insertError(response, error) {
  if (!response.meta) response.meta = {};
  if (!response.meta.errors) response.meta.errors = [];
  response.meta.errors.push(error);
}

function walkIncludeTree(cursor: string, node: string) {
  const filter = new RegExp(`${node}[.,]?`, 'g');
  return cursor.replace(filter, '');
}

function getIncludeTreeBase(cursor: string): string[] {
  return cursor.split(',')
    .map((statement) => {
      const subBranches = statement.indexOf('.');
      return statement.substring(0, subBranches > 0 ? subBranches : statement.length);
    })
    .filter((branch, index, branches) => branches.indexOf(branch) === index);
}

function parseRelationshipEntity(response, { data, context, model, parent, branch }, cursor) {
  const newNode = model.marshal(data);
  response.included.push(asJsonApiObject(newNode, model, context));
  if (data.meta) response.meta = Object.assign(response.meta || {}, data.meta);
  parent.relationships = parent.relationships || {};
  if (parent.relationships[branch]) {
    if (!Array.isArray(parent.relationships[branch].data)) {
      parent.relationships[branch].data = [parent.relationships[branch].data];
    }
    parent.relationships[branch].data.push({ id: `${data.id}`, type: model.model ? model.model.type : model.type });
  } else {
    parent.relationships[branch] = { data: { id: `${data.id}`, type: model.model ? model.model.type : model.type } };
  }

  const nextNode = walkIncludeTree(cursor, branch);
  if (nextNode !== '') return fetchIncludedRelationships(response, { data, context, model, parent: newNode }, nextNode);
  return true;
}

function fetchIncludedRelationships(response: any, { data, context, model, parent }, cursor: string) {
  const includeTree = getIncludeTreeBase(cursor);
  return Promise.all(includeTree.map(async (branch) => {
    const handle: RelationshipParams = model.relationships[branch];
    const targetModel = handle.model;
    if (targetModel) {
      const [errors, entities] = await to(handle.resolver(data, { context, params: context.params, relationship: branch, model: targetModel }));

      if (errors) {
        insertError(response, errors);
        return null;
      }
      return Promise.all(
        (Array.isArray(entities) ? entities : [entities])
          .map((entity) => parseRelationshipEntity(response, { data: entity, context, model: targetModel, parent, branch }, cursor))
      );
    }
    return null;
  }));
}

export async function render({ context, data, model }) {
  const response: JsonApiResponse<OpenApiEntity> = {};
  if (!model) return data;
  if (data && model) {
    if (Array.isArray(data)) {
      response.data = data.map((d) => asJsonApiObject(model.marshal(d), model, context));
      if (context.params.include) {
        response.included = [];
        await Promise.all(data.map((d, i) => {
          return fetchIncludedRelationships(response, { data: d, context, model, parent: response.data[i] }, context.params.include.join(','));
        }));
      }
    } else {
      response.data = model.marshal(data);
      if (context.params.include) {
        response.included = [];
        await fetchIncludedRelationships(response, { data, context, model, parent: response.data }, context.params.include.join(','));
      }
    }
  }
  if (response.included && response.included.length === 0) delete response.included;
  return response;
}
