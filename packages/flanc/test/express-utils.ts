import { createContext } from '../src/context';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

export function generateExpressRequest(parameters: Serializable): ExpressRequest {
  const request = Object.assign(new IncomingMessage(new Socket()), {
    baseUrl: '/',
    method: 'get',
    path: '/',
    headers: { 'content-type': 'application/json' },
    query: {},
  }, parameters);

  request.context = Object.assign(generateRequestContext(request), request.context || {});

  return request;
}

export function generateExpressResponse({ status, json }): Express.Response {
  return {
    status,
    json,
  };
}

export function generateRequestContext(req?: any, user?: Partial<UserToken>): Context {
  req = req || { headers: {} };
  const context = createContext(req);
  if (user) context.user = user;
  return context;
}
