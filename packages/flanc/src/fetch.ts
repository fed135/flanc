import axios from 'axios';
import config from 'config';
import { ApiError } from './errors';
import { to } from './async';

export async function fetch(service: Service, options: RequestOptions, contexts: Context | Context[]): Promise<any> {
  options.headers = options.headers || {};
  options.headers['x-request-id'] = options.headers?.['x-request-id'] || getRequestContexts(contexts);

  const method = options.method || 'get';
  const args: any = [`${service.host}${service.basePath || ''}${options.path}`, {
    params: { ...service.query, ...options.query },
    timeout: options.timeout || config.fetch.requestTimeout,
    headers: { ...service.headers, ...options.headers },
    responseType: options.responseType || 'json',
  }];

  if (['post', 'put', 'patch'].includes(method)) args.splice(1, 0, options.body);

  // @ts-ignore
  const [err, response] = await to(axios[method](...args));

  return responseInterceptor(err, response, service, options, Array.isArray(contexts) ? contexts : [contexts]);
}

function getRequestContexts(contexts: Context | Context[]): string {
  if (Array.isArray(contexts)) {
    return contexts.map((c) => c.id)
      .filter((id, index, arr) => arr.indexOf(id) === index)
      .join(',');
  }
  return contexts.id;
}

function responseInterceptor(
  err: Error | any,
  response: any,
  service: Service,
  options: RequestOptions,
  contexts: Context[]
): any {
  if (err) {
    if (err.response) {
      throw new ApiError(undefined, err.response.status, err.response.data, err.response.statusText, contexts[0]);
    }
    throw new ApiError(err, 500, null, null, contexts[0]);
  }

  return response;
}
