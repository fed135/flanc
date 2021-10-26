/* istanbul ignore file */

import config from 'config';
import { Context } from 'flanc';
import { deferred } from 'flanc/async';
import { ExpressRequest } from 'flanc/express-types';
import { GraphQLError } from 'graphql';
import { json } from 'express';
import monitoring from './middleware/monitoring';
import operationId from './middleware/operation-id';
import { ApolloServer, gql } from 'apollo-server-express';
import { append, compile } from './schema-compiler';

type SchemaResolvers = {
  Query?: {
    [key: string]: {
      resolver: (obj: object, args: { [key: string]: Serializable }, context: Context) => any
      middlewares: ((req, res, next) => any)[]
    }
  }
  Mutation?: {
    [key: string]: {
      resolver: (obj: object, args: { [key: string]: Serializable }, context: Context) => any
      middlewares: ((req, res, next) => any)[]
    }
  }
  Scalar?: {
    [key: string]: () => any
  }
}

type SchemaAccumulator = {
  master: { [key: string]: Serializable }
  queries: string[]
  mutations: string[]
  scalar: string[]
  resolvers: SchemaResolvers
}

const schemas: SchemaAccumulator = {
  master: {},
  queries: [],
  mutations: [],
  scalar: [],
  resolvers: {},
};

export interface ScalarType {
  name: string
  description?: string
  serialize: (value: any) => any
  parseValue: (value: any) => any
  parseLiteral: (value: any) => any
}

const pathMap = {};

let router;

export default function Router(app, RouterConstructor: any) {
  router = RouterConstructor();
  router.use(json());
  router.use(operationId);
  router.use(monitoring);

  router.start = function start() {
    const apolloServer = new ApolloServer({
      typeDefs: gql(compile(schemas.master, schemas.scalar, schemas.queries, schemas.mutations)),
      resolvers: schemas.resolvers,
      context: (inbound: { req: ExpressRequest, res: Express.Response }) => {
        function executeMiddleware(method) {
          const { resolve, promise } = deferred();
          method(inbound.req, inbound.res, resolve);
          return promise;
        }

        const parsedOperationId = inbound.req.context.operationId.substring(8);

        if (!pathMap[parsedOperationId]) return inbound.req.context;

        return Promise.all(pathMap[parsedOperationId].map(executeMiddleware)).then((result) => {
          const errorCheck = (result || []).filter((x) => x !== undefined);
          if (errorCheck.length > 0) throw errorCheck[0];
          return inbound.req.context;
        });
      },
      formatError: (error: GraphQLError) => {
        const printStack = config.debug.stackSize > 0;
        const { code, message, stack, source, status, title } = error.originalError as any;
        const formattedStack = printStack ? stack : undefined;
        return { code, message, source, stack: formattedStack, status, title };
      },
      playground: process.env.NODE_ENV !== 'production',
    });
    apolloServer.applyMiddleware({ app: router, path: '/' });
  };

  router.stop = function stop() {};

  return router;
}

export function register(schema: Partial<_Model>, queries: { Query?: string, Mutation?: string, Scalar?: ScalarType}, resolver: SchemaResolvers) {
  append(schemas.master, schemas.resolvers, schemas.scalar, schema);

  if (queries.Query) schemas.queries.push(queries.Query);
  if (queries.Mutation) schemas.mutations.push(queries.Mutation);

  function buildResolverParams(resolver) {
    return (_, params, context: Context) => resolver(Object.assign(context, { params }));
  }

  function addResolversAndMiddlewares(schemaDefinition: { Query?: SchemaResolvers['Query'], Mutation?: SchemaResolvers['Mutation'] }, resolverDefinition) {
    if (!schemaDefinition) return;

    for (const type in schemaDefinition) {
      if (schemaDefinition.hasOwnProperty(type)) {
        if (typeof schemaDefinition[type].resolver !== 'function') throw new Error(`${type} resolver needs to be a function.`);
        resolverDefinition = Object.assign(resolverDefinition || {}, { [type]: buildResolverParams(schemaDefinition[type].resolver) });
        if (schemaDefinition[type].middlewares) pathMap[type] = schemaDefinition[type].middlewares;
      }
    }

    return resolverDefinition;
  }

  if (resolver.Mutation) schemas.resolvers.Mutation = addResolversAndMiddlewares(resolver.Mutation, schemas.resolvers.Mutation);
  if (resolver.Query) schemas.resolvers.Query = addResolversAndMiddlewares(resolver.Query, schemas.resolvers.Query);
  if (resolver.Scalar) {
    for (const scalar in resolver.Scalar) {
      if (resolver.Scalar.hasOwnProperty(scalar) && !(schemas.scalar.includes(scalar))) {
        schemas.scalar.push(scalar);
        schemas.resolvers[scalar] = resolver.Scalar[scalar];
      }
    }
  }
}

Router.defaultMountPath = '/graphql';
