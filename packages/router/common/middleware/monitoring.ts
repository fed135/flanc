import { setControllerName } from 'newrelic';
import { ExpressNext, ExpressRequest } from '@<project_name>/core-util/express-types';

export default function monitor(req: ExpressRequest, res: Express.Response, next: ExpressNext) {
  if (!req.context.operationId) return next();

  const [requestMethod, requestPath] = req.context.operationId.split(' ');
  const includedEntities = (req.context.params.include || [])
    .map((included) => included.substring(included.lastIndexOf('.') + 1));

  setControllerName(`${requestMethod.toLocaleUpperCase()} ${requestPath}${includedEntities.length > 0 ? ` [${includedEntities}]` : ''}`);
  next();
}
