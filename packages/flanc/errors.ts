import config from 'config';
import Logger from './logging';

const logger = Logger('errors');

const isPrintableEnv = (): boolean => {
  if (!process.env.NODE_ENV) return true;
  return process.env.TEST_MODE !== 'test';
};

const trimAuthorization = (headers) => {
  if (headers.authorization) {
    if (headers.authorization.indexOf('Bearer ') > -1) return { ...headers, authorization: `${headers.authorization.slice(0, 11)}...${headers.authorization.slice(-4)}` };
    return { ...headers, authorization: 'invalid token' };
  }
  return headers;
};

export function ApiError(error: ApiError | object, statusCode?: string | number, message?: string, title?: string, ctx?: Context): void {
  if (error && error.source) return error;

  const printStack = config.debug.stackSize > 0;
  if (printStack && error?.stack) this.stack = error.stack;

  this.source = {
    request: {
      id: ctx && ctx.id,
      url: ctx && ctx.url,
      headers: ctx && ctx.headers && trimAuthorization(ctx.headers),
    },
    error: printStack ? error?.stack : undefined,
  };

  this.status = Number(statusCode || error.status) || 500;
  this.message = message || error.message || error.toString();
  this.title = title || error.title || error.name;
  this.code = error?.code || 'MA-000000';
  this.details = error?.details;

  if (isPrintableEnv()) logger.error(JSON.stringify(this), ctx);
}

ApiError.prototype = Error.prototype;

export function BadRequest(message: string, context?: Context, parentError: ApiError | object = {}): ApiError {
  return new ApiError(parentError, 400, message, 'Bad Request', context);
}

export function Unauthorized(message: string, context?: Context, parentError: ApiError | object = {}): ApiError {
  return new ApiError(parentError, 401, message, 'Unauthorized', context);
}

export function Forbidden(message: string, context?: Context, parentError: ApiError | object = {}): ApiError {
  return new ApiError(parentError, 403, message, 'Forbidden', context);
}

export function NotFound(message: string, context?: Context, parentError: ApiError | object = {}): ApiError {
  return new ApiError(parentError, 404, message, 'Not Found', context);
}

export function Conflict(message: string, context?: Context, parentError: ApiError | object = {}): ApiError {
  return new ApiError(parentError, 409, message, 'Conflict', context);
}

export function InternalError(message: string, context?: Context, parentError: ApiError | object = {}): ApiError {
  return new ApiError(parentError, 500, message, 'Internal Server Error', context);
}
