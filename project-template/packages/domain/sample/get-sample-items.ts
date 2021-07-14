import { register } from '@flanc/router-json';
import { Context } from 'flanc';

register({
  path: '/sample-route',
  method: 'get',
  description: 'This is a sample route',
  operationId: 'sampleRoute',
  resolver: (context: Context) => 'Hello world!',
  clientCache: 10000,
  middlewares: [],
  parameters: [],
  tags: ['sample'],
  model: null,
  responses: {
    default: { type: 'string' },
  },
});
