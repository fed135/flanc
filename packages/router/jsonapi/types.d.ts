import { Route } from 'flanc';

interface _JsonApiRoute extends Route {
    method: HttpMethods
}

type HttpMethods = 'get' | 'post' | 'patch' | 'delete' | 'put';

declare module '@flanc/router-json' {
    export interface JsonApiRoute extends _JsonApiRoute {}
}
