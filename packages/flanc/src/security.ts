/* istanbul ignore file */

import { ExpressNext, ExpressRequest } from './express-types';

export default function security(req: ExpressRequest, res: Express.Response, next: ExpressNext) {
  if (decodeURIComponent(req.url).includes('<script>')) {
    return res.status(406).end('Illegal component in URI');
  }

  next();
}
