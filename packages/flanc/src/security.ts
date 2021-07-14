/* istanbul ignore file */
import { ExpressNext, ExpressRequest, ExpressResponse } from 'flanc/express-types';

export default function security(req: ExpressRequest, res: ExpressResponse, next: ExpressNext) {
  res.removeHeader('X-Powered-By');

  if (decodeURIComponent(req.url).includes('<script>')) {
    return res.status(406).end('Illegal component in URI');
  }

  next();
}
