import { modules } from 'flanc/monitoring';
import { ExpressNext, ExpressRequest } from 'flanc/express-types';

export default function graphqlAPIMonitoringMiddleware(req: ExpressRequest, res: Express.Response, next: ExpressNext) {
  modules?.newrelic?.setControllerName(`${req.context.operationId.replace('graphql ', 'GRAPHQL [')}] `);
  next();
}
