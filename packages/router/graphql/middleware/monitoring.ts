import { setControllerName } from 'newrelic';
import { ExpressNext, ExpressRequest } from '@<project_name>/core-util/express-types';

export default function graphqlAPIMonitoringMiddleware(req: ExpressRequest, res: Express.Response, next: ExpressNext) {
  setControllerName(`${req.context.operationId.replace('graphql ', 'GRAPHQL [')}] `);
  next();
}
