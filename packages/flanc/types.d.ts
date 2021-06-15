type Serializable = string | number | boolean | { [key: string]: Serializable } | Array<Serializable>;

type Service = {
  basePath?: string
  headers?: { [key: string]: Serializable }
  host: string
  query?: { [key: string]: Serializable }
  [key: string]: Serializable
};

type AttributeParams = {
    type: 'string' | 'number' | 'integer' | 'object' | 'array' | 'boolean'
    required?: boolean
    resolver?: (rawData: any) => any
    items?: AttributeParams
    description?: string
  };

  type SerializableParams = { [key: string]: Serializable };

  interface JsonApiRoute extends _Route {
    method: HttpMethods
  }

  interface SqsRoute extends _Route {
    method: 'sqs'
  }

  type HttpMethods = 'get' | 'post' | 'patch' | 'delete' | 'put';

  type RequestOptions = {
    headers?: { [key: string]: string }
    method?: HttpMethods
    query?: SerializableParams
    path: string
    timeout?: number
    body?: Serializable
    responseType?: | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
  };

  type ModelArguments<TParams = any> = {
    context: _Context
    params: TParams
    [key: string]: any
  };

  type RelationshipParams<T> = {
    resolver: (
      src: Serializable,
      { context, params }: ModelArguments
    ) => T
    model: _Model
  };

  interface _Context {
    id: string
    ip: string
    method: string
    path: string
    url: string
    params: { [key: string]: any }
    query: { [key: string]: any }
    body: any
    getFiles: () => any
    headers: { [key: string]: string }
    user?: UserToken
    errors: any[]
    operationId?: string
  }

  type UserToken = {
    id: string | null
    token: string
    expires: number
    roles?: string[]
  };

  interface _Model {
    type: string
    attributes: { [key: string]: AttributeParams }
    relationships?: { [relationship: string]: RelationshipParams<any> }
  }

  type OpenApiEntityIdentifier = {
    id: string
    type: string
  };

  interface OpenApiEntity extends OpenApiEntityIdentifier {
    attributes: {
      [attribute: string]: Serializable
    }
    relationships: {
      [relationship: string]: {
        data: OpenApiEntityIdentifier | OpenApiEntityIdentifier[]
      }
    }
    meta?: Serializable
  }

  interface JsonApiResponse<T = {}> {
    data?: T | OpenApiEntity | OpenApiEntity[]
    included?: OpenApiEntity[]
    meta?: {
      errors: Serializable
      paging: Serializable
      [key: string]: Serializable
    }
  }

  interface GenericMiddleware {
    (req: any, res: any, next: () => any): void
  }

  type SqsOptions = {
    forceDelete?: boolean
    pollerType?: 'parallel' | 'sequential'
    pollIntervalMs?: number
    maxNumberOfMessages?: number
    visibilityTimeout?: number
  }

  interface _Route {
    path: string
    method: string
    description: string
    operationId: string
    resolver?: (context: _Context) => any
    clientCache?: number
    middlewares?: GenericMiddleware[]
    parameters: { [key: string]: any }[]
    tags: string[]
    model?: _Model
    'x-client-cache'?: number
    responses?: {
      [statusCode: number]: Serializable
      default: Serializable
    }
  }

  interface RouterSpecifications {
    formatError: (error: any) => any
    formatResponse: (error: any) => any
    responseHeaders: Serializable
    supportedMethods: string[]
  }

  interface _ApiError {
    code: string
    details?: Serializable
    message: string
    source: {
      error: any
      request: {
        headers: Serializable[]
        id: string
        url: string
      }
    }
    stack: any
    status: number
    title: string
  }

  type ApiResponse = {
    status: string
    contextId: string
    [key: string]: any
  };
  
  interface ConfigDefinition {
    auth: {
      jwtSecret: string
      expiresAt: number
    }
    debug: {
      stackSize: number
    }
    fetch: {
      requestTimeout: number
      tieredCacheEnabled: boolean
      tieredCacheMetricsEnabled: boolean
    }
    gateway: {
      host: string
      https: boolean
    }
    i18next: {
      translationFilePath: string
      defaultLocale: string
      allowedLocales: string[]
    }
    routers: {
      common: {
        clientCacheTimeout: number
      }
      json: {
        maxRelationshipDepth: number
      }
    }
    server: {
      host: string
      https: boolean
      httpsCredentials: {
        cert: string
        key: string
      }
      port: number
    }
    services: {
      [K in null]: Service
    }
    shutdown: {
      appKill: number
      serverClose: number
    }
  }
  
declare module 'config' {
  var config: ConfigDefinition; // eslint-disable-line vars-on-top
  export default config;
}
  

declare module 'flanc' {
  export interface Context extends _Context {}
  export interface Model extends _Model {}
  export interface Route extends _Route {}
}

declare module 'flanc/error' {
  interface Context extends _Context {}
  interface ApiError extends _ApiError {}

  export function ApiError(error: ApiError | Error | undefined, statusCode?: string | number, message?: string, title?: string, ctx?: Context): void
  export function NotFound(message: string, context?: Context, parentError?: ApiError | object): ApiError
  export function BadRequest(message: string, context?: Context, parentError?: ApiError | Error): ApiError
  export function Unauthorized(message: string, context?: Context, parentError?: ApiError | Error): ApiError
  export function Forbidden(message: string, context?: Context, parentError?: ApiError | Error): ApiError
  export function Conflict(message: string, context?: Context, parentError?: ApiError | Error): ApiError
  export function InternalError(message: string, context?: Context, parentError?: ApiError | Error): ApiError
}

declare module 'flanc/async' {
  export function deferred<T>(): any
  export function to<T = any>(promise: Promise<T>): Promise<[null, T] | [any, null?]>
  export function safe<T = any>(fn: (args?: any) => T, params: Serializable[]): Promise<T>
  export function sequence<T, K>(array: Array<K>, operation: (item: K, index: number) => Promise<T>): Promise<Array<T>>
}

declare module 'flanc/monitoring' {
  export function setMonitoringModule(moduleName: string, module: any): void
  export const modules: any
}

declare module 'flanc/express-types' {
  import {IncomingMessage, ServerResponse, Server} from 'http';

  // @ts-ignore
  export interface ExpressAppServer extends Express {
    server?: AppServer
    _routers?: any[]
    _registryLocation?: string
    _extraMiddleware?: ExpressMiddleware[]
    use: useMiddleware
  }

  interface useMiddleware {
    (mountPath: string, handler: ExpressMiddleware): void
    (handler: ExpressMiddleware): void
  }

export interface ExpressRequest extends Express.Request, IncomingMessage {
  context?: _Context
  baseUrl?: string
  path?: string
  headers: { [header: string]: string }
  params?: { [key: string]: Serializable }
  query?: { [key: string]: Serializable }
  ip: string
  body?: any
  files?: any
  route?: any
}

export interface ExpressResponse extends Express.Response, ServerResponse {
  status: any
}

export type ExpressNext = (err?: any) => any

export interface ExpressMiddleware {
  (req?: ExpressRequest, res?: ExpressResponse, next?: ExpressNext): void
  (err: _ApiError | Error, req?: ExpressRequest, res?: ExpressResponse, next?: ExpressNext): void
}

export interface AppServer extends Server {
  ready?: boolean
  stop?: () => AppServer
}

}

declare module 'flanc/data-model' {
  export function sanitize(model: _Model): any
  export function DataModel<M extends _Model>(model: M): M
}

declare module 'flanc/router-commons' {
  export function register(route: _Route, router, specifications: RouterSpecifications): void
}

declare module 'flanc/router-commons/documentation' {
  export function render(spec: SerializableParams): Serializable
}