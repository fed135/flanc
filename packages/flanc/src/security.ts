/* istanbul ignore file */

import { ExpressNext, ExpressRequest, ExpressResponse } from './express-types';

export default function security(req: ExpressRequest, res: ExpressResponse, next: ExpressNext) {
  if (decodeURIComponent(req.url).includes('<script>')) {
    return res.status(406).end('Illegal component in URI');
  }

  next();
}
