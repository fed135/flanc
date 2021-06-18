import { Route } from 'flanc';

interface _SqsRoute extends Route {
    method: 'sqs'
}

interface _SqsOptions {
    forceDelete?: boolean
    pollerType?: 'parallel' | 'sequential'
    pollIntervalMs?: number
    maxNumberOfMessages?: number
    visibilityTimeout?: number
}

declare module '@flanc/router-sqs' {
    export interface SqsRoute extends _SqsRoute {}
    export interface SqsOptions extends _SqsOptions {}
}
