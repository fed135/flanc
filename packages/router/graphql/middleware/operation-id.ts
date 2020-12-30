import { ExpressNext, ExpressRequest } from '@<project_name>/core-util/express-types';

function getGraphQLTransactionName(body) {
  if (body.operationName && body.operationName.length > 1) return `graphql ${body.operationName}`;

  let parsed;
  const models = [];
  let rawQuery = (body.query || '').replace(/\s|\r|\n|\t/g, '');
  // Looks for model tokens
  while (null !== (parsed = (new RegExp(/([a-zA-Z0-9]*)\(/gmi)).exec(rawQuery))) {
    rawQuery = rawQuery.replace(parsed[0], '');
    models.push(parsed[1]);
  }
  return `graphql ${models.join(',')}`;
}

export default function operationId(req: ExpressRequest, res: Express.Response, next: ExpressNext) {
  req.context.operationId = getGraphQLTransactionName(req.body);
  next();
}
