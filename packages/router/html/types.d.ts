import { Route } from 'flanc';

interface _HtmlRoute extends Route {
  method: 'get' | 'post'
}

declare module '@flanc/router-html' {
    export interface HtmlRoute extends _HtmlRoute {}
}
