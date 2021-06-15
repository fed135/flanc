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

export function ApiError(error: _ApiError | Error | undefined, statusCode?: string | number, message?: string, title?: string, ctx?: _Context): void {
  // @ts-ignore
  if ((error as ApiError)?.source) return error as ApiError;

  const printStack = config.debug.stackSize > 0;
  if (printStack && error?.stack) this.stack = error.stack;

  this.source = {
    request: {
      id: ctx?.id,
      url: ctx?.url,
      headers: ctx?.headers && trimAuthorization(ctx.headers),
    },
    error: printStack ? error?.stack : undefined,
  };

  this.status = Number(statusCode || (error as _ApiError).status) || 500;
  this.message = message || error.message || error.toString();
  this.title = title || (error as _ApiError)?.title || (error as Error)?.name;
  this.code = (error as _ApiError)?.code || 'API-000000';
  this.details = (error as _ApiError)?.details || '';

  if (isPrintableEnv()) logger.error(JSON.stringify(this), ctx);
}

ApiError.prototype = Error.prototype;

export function BadRequest(message: string, context?: _Context, parentError?: _ApiError | Error): _ApiError {
  return new ApiError(parentError, 400, message, 'Bad Request', context);
}

export function Unauthorized(message: string, context?: _Context, parentError?: _ApiError | Error): _ApiError {
  return new ApiError(parentError, 401, message, 'Unauthorized', context);
}

export function Forbidden(message: string, context?: _Context, parentError?: _ApiError | Error): _ApiError {
  return new ApiError(parentError, 403, message, 'Forbidden', context);
}

export function NotFound(message: string, context?: _Context, parentError?: _ApiError | Error): _ApiError {
  return new ApiError(parentError, 404, message, 'Not Found', context);
}

export function Conflict(message: string, context?: _Context, parentError?: _ApiError | Error): _ApiError {
  return new ApiError(parentError, 409, message, 'Conflict', context);
}

export function InternalError(message: string, context?: _Context, parentError?: _ApiError | Error): _ApiError {
  return new ApiError(parentError, 500, message, 'Internal Server Error', context);
}
