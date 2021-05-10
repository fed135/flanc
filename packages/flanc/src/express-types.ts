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
  context?: Context
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
  (err: ApiError | Error, req?: ExpressRequest, res?: ExpressResponse, next?: ExpressNext): void
}

export interface AppServer extends Server {
  ready?: boolean
  stop?: () => AppServer
}
