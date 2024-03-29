# FLANC

*A semi-opinionated API template*

## Key features

- Fully written in Typescript
- Core utils for async, http, caching, dates, encryption, etc.
- Easy integration with APM services
- Support for multiple protocols (JSON-API, GraphQL) and triggers (HTTP, Websocket, SQS)
- Best deployed on Kubernetes, with Istio in mind
- Built-in API documentation

## Getting started

### Installation

To get started, you need to execute the create-app script, which will pull the latest boilerplate version from github and set up you local environement.

To do that, you may either download and run the script manually, or use the following cURL or Wget command:

```sh
bash <(curl -o- https://raw.githubusercontent.com/fed135/flanc/v0.1.0/create-app.sh) your-project-name
```
```sh
bash <(wget -qO- https://raw.githubusercontent.com/fed135/flanc/v0.1.0/create-app.sh) your-project-name
```

The script will confirm the name and location where you wan to create the project and will install everything.

At the end of which you'll be able to launch your API by running:

```bash
yarn start
```

Your healthcheck route will be at [localhost:9001/healthcheck](http://localhost:9001/healthcheck), confirming that everything went well!

### Creating a new endpoint

FLANC does not have any routers out of the box, which means that you will have to install some extra packages, based on what protocols you want to support.

Here's a list of routers that you can pick from:

- [JSON-API](https://www.npmjs.com/package/@flanc/router-json)
- [HTML](https://www.npmjs.com/package/@flanc/router-html)
- [GraphQL](https://www.npmjs.com/package/@flanc/router-graphql)
- [SQS](https://www.npmjs.com/package/@flanc/router-sqs)
- [WebSocket](https://www.npmjs.com/package/@flanc/router-ws)

For example, if you want to create a new JSON endpoint, you would install the package at the root level of the project

```bash
yarn add @flanc/router-jsonapi
```

Then, in the `server.ts` file at the root of the project you will need to import and load your router

```typescript
import { createServer } from 'flanc/server';
import { setup as JSONRouter } from '@flanc/router-jsonapi';

const server = createServer();

/**
 * Load subrouters here
 */
server.router(JSONRouter);

server.registry('./packages/domain/registry');
server.start();

export default server;
```

Now next time that you launch the app, a new documentation route should be available: [localhost:9001/json/docs](http://localhost:9001/json/docs)

Now to make use of this new router, we will create a new domain file

```typescript
import { register } from '@flanc/router-jsonapi';

register({
  path: '/hello-world/:username',
  method: 'get',
  description: 'Test route',
  operationId: 'helloWorld',
  clientCache: 604800,
  parameters: [
    { 
      name: 'username',
      in: 'path',
      type: 'string',
    }
  ],
  middlewares: [],
  tags: ['test'],
  resolver: (context: Context) => {
    return `Hello ${context.params.username}!`;
  },
});
```

After restarting your server, your JSON-API documentation page should show your new route, which you will be able to call at [localhost:9001/json/hello-world/john](http://localhost:9001/json/hello-world/john)

### Custom responses

In addition to the built-in headers, like Cache-Control, Content-Type and x-request-id, you can return specific headers or status codes by leveraging the `res` property of contexts.

```typescript
function handleCustomResponse(context: Context) {
  context.res.status(203);
  context.res.headers['x-custom-header'] = 'Something unique';
  return 'Nothing changed';
}
```


### Error management

All routers should handle FLANC Errors thrown anywhere in the code.

```typescript
import { NotFound } from 'flanc/errors';

function handleRequestNotFound(context: Context) {
  throw NotFound('Could not find what you were looking for');
}
```


You may want to catch them to modify the error content or to gracefully degrade the experience for your user.


## Why is this important ?

This project aims to address a number of of pain-points that affect companies of all sizes though the use of [domain-driven design architecure]() and [monorepos]().

### Semi-opinionated ?

FLANC proposes a rigid domain-driven project structure, a guide for package morphology, batteries-included routing, documentation, contexts and tests.
Beyond that, you are free to structure your business logic to your liking, import the libraries that you are used to work with, your databases, ORMs, etc.

### How experimental is this ?

The concept has been thouroughly battle-tested over the past 5 years, from startups to Fortune 500 companies. What's new is the actual implementation, which had to be redone from scratch.

## Contributing

Please do! This project is all about facilitating collaboration on complex projects and we intend to set the example ourselves.
If you want to contribute, feel free to ping @fed135.

## Roadmap

** Version 0.1.0 **

- [ ] Finalize GraphQL router + model-less graphql routes
- [ ] Add examples for resource modules and relationships, full with DB + ha-store in the boilerplate app
- [ ] Create a scaffolding script to accelerate resource/domain creation in the boilerplate app
- [ ] Test GraphQL common scenarios and syntax (filter, sort, etc)
- [ ] Test Open-API spec, scenarios, syntax and swagger output in Apigee
- [ ] Global Test party

** Version 0.2.0 **

- [ ] More comprehensive error codes
- [ ] Finalize SQS router
- [ ] Finalize HTML router
- [ ] Finalize Websocket router (One context per socket connection)
- [ ] Define vision, objective, top selling points
- [ ] Docs Website

## License

Apache-2.0 - 2021
