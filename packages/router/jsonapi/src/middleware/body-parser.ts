import crypto from 'crypto';
import { ExpressRequest } from 'flanc/express-types';
import fileUpload from 'express-fileupload';
import xml from 'express-xml-bodyparser';
import { BadRequest, InternalError } from 'flanc/errors';
import { json, NextFunction, raw, Response, text, urlencoded } from 'express';

interface VerifiedJsonParserOptions {
  prefix?: string
  algorithm?: string
}

export const rawJsonParser = raw({ type: 'application/json', limit: '10kb' });
export const jsonParser = json({ limit: '10kb' });
export const textParser = text({ limit: '10kb' });
export const xmlParser = xml();
export const largeJsonParser = json({ limit: '2mb' });
export const bankAggregationWebhookLargeJsonParser = json({ limit: '5mb' });
export const urlencodedParser = urlencoded({ extended: true });
export const fileUploadParser = fileUpload({ createParentPath: true, limits: { fileSize: 2 * 1024 * 1024 * 1024 } });

export function verifiedBasicAuthorizationTokenJsonParser(token: string) {
  function verify(req) {
    if (!req.headers.authorization) throw InternalError('Missing authorization header.');

    const incomingToken = req.headers.authorization.substring(6);

    if (token !== decodeBase64(incomingToken)) {
      throw BadRequest('Invalid authorization token.');
    }
  }

  function decodeBase64(data: string) {
    const buffer = Buffer.from(data, 'base64');
    return buffer.toString();
  }

  return json({ verify, type: 'application/json' });
}

export function verifiedJsonParser(headerKey: string, secretKey: string, options: VerifiedJsonParserOptions = {}) {
  const { prefix = '', algorithm = 'sha256' } = options;

  function verify(req, res, buf) {
    if (!req.headers[headerKey]) throw InternalError(`Missing header '${headerKey}'`);

    const computed = prefix + signature(buf);

    if (req.headers[headerKey] !== computed) {
      throw BadRequest(`Invalid signature, received ${req.headers[headerKey]} and computed ${computed}`);
    }
  }

  function signature(requestBody) {
    return crypto.createHmac(algorithm, secretKey)
      .update(requestBody)
      .digest('hex');
  }

  return json({ verify, type: 'application/json' });
}

export function textToJsonParser(req: ExpressRequest, res: Response, next: NextFunction) {
  try {
    req.body = JSON.parse(req.body);
    next();
  } catch (error) {
    throw new Error(`Could not parse body: ${error}`);
  }
}
