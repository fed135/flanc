import http from 'http';

export type ExpressAppServer = Express & { server?: AppServer };

export interface ExpressRequest extends Express.Request, http.IncomingMessage {
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

export type ExpressNext = (err?: any) => any

export type ExpressMiddleware = (req: http.IncomingMessage, res: http.ServerResponse, next: ExpressNext) => void

export interface AppServer extends http.Server {
  ready?: boolean
  stop?: () => AppServer
}
