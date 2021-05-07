# FLANC

- Use @flanc/create-project to build a new project
- Import routers, middleware, utils and tools to build your enterprise-grade API.
- Comes pre-loaded with server essentials, `router-json`, folder structure, api documentation, etc.
- compatible with all monitoring services


- Built using Typescript
- Kubernetes-ready (graceful shutdown, dumb-init)
- Modern domains-driven architecture
- Monorepo for easier delegation and isolation

## Install

Make sure that you have a modern version of `yarn` that supports workspaces (`>= 1.0`), then run:

```bash
yarn
```

## Start

To enable logs, use the standard `NODE_DEBUG` flag with the value `FLANC`

You'll also need to point to a Mongo server process with either a 'staging' or a 'prod' db.
These can also be loaded through `.env` files.

```bash
NODE_DEBUG=<project_name> DB_HOST=<my-mongo-host> yarn start
```

## Test

Make sure that you have a modern version of `yarn` that supports workspaces, then run:

```bash
yarn test
```

The command above will run the following test suites sequentially:

| Test suite | Run command | Description |
-------------|-------------|-------------|
| Unit | `yarn test:unit` | Simple unit tests. |
| Mid-level | `yarn test:mid-level` | Small integration tests that integration of small components together.  |
| Acceptances | `yarn test:acceptance` | Large integration tests, system tests, end-to-end tests. |


## Routes

### Graphql

This is an apollo server.

| Route | Description |
| --- | --- |
| `GET /graphql` | Will launch the graphql sandbox (disabled in prod) |
| `POST /graphql` | Will execute the graphql query. |

GraphQL sandbox links:

- [Local](http://localhost:9001/graphql)

### JSON API

This is a JSON-API server.

| Route | Description |
| --- | --- |
| `GET /jsonapi/docs` | Will display the Swagger documentation for the router (disabled in prod) |
| `* /jsonapi/*` | Will trigger the associated route on that router |

Environement-based doc links:

- [Local](https://petstore.swagger.io/?url=http://localhost:9001/jsonapi/docs)

### HTML

This is an HTML server.

| Route | Description |
| --- | --- |
| `GET /html/docs` | Will display the Swagger documentation for the router (disabled in prod) |
| `* /html/*` | Will trigger the associated route on that router |

Environement-based doc links:

- [Local](https://petstore.swagger.io/?url=http://localhost:9001/html/docs)

### SQS

This is an SQS ([Amazon Simple Queue Service](https://aws.amazon.com/sqs/)) server. 

Unfortunately since this router uses a custom "protocol" in order to interact with Amazon, it is not possible to view its documentation using Swagger right now.




