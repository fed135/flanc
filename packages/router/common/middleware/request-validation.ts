import { path } from '../utils';
import validate from 'swagger-route-validator';
import { BadRequest, NotFound } from '@<project_name>/core-util/errors';
import { ExpressNext, ExpressRequest } from '@<project_name>/core-util/express-types';

export default (app) => function validateRequest(req: ExpressRequest, res: any, next: ExpressNext) {
  const operationId = `${req.method.toLowerCase()} ${req.route.path}`;
  const matchingSpec: Route = app._spec[operationId];
  req.context.operationId = operationId;

  if (!matchingSpec) throw NotFound(`Route not found ${operationId}`, req.context);

  req.context.params = { ...req.params, ...req.query, body: req.body };

  const errors = validate(matchingSpec, req.context);
  if (errors.length > 0) throw BadRequest(JSON.stringify(errors), req.context);

  const includeVal = req.context.params.include;
  const includeParam = matchingSpec.parameters.find((param) => param.name === 'include');
  path.guardAgainstForbiddenIncludePattern(includeVal, includeParam, req.context);

  next();
};
