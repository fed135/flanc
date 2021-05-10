import { modules } from './monitoring';
import { v4 as uuid } from 'uuid';
import { ExpressNext, ExpressRequest, ExpressResponse } from './express-types';

export function createContext(req: ExpressRequest): Context {
  return {
    id: req.headers['x-request-id'] && req.headers['x-request-id'].toString() || uuid(),
    ip: req.headers['x-real-ip'] || (req.headers['x-forwarded-for'] || '').split(',').pop() || req.ip,
    method: req.method,
    url: req.path,
    path: req.baseUrl + req.path,
    params: {},
    query: req.query,
    body: req.body,
    getFiles: () => req.files,
    headers: req.headers,
    errors: [],
  };
}

export default function context(req: ExpressRequest, res: ExpressResponse, next: ExpressNext) {
  req.context = createContext(req);
  res.setHeader('x-request-id', req.context.id);

  // Private res
  Object.defineProperty(req.context, 'res', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: res,
  });

  modules?.newrelic.addCustomAttribute('x-request-id', req.context.id);

  next();
}
