/* istanbul ignore file */

import config from 'config';
import { deferred } from 'flanc/async';
import { InternalError } from 'flanc/errors';
import Logger from 'flanc/logging';
import { SQS } from 'aws-sdk';
import { modules } from 'flanc/monitoring';
import { v4 as uuid } from 'uuid';

const logger = Logger('<project_name>/router-sqs');
const pollers = {};
const instance = new SQS({ apiVersion: '2012-11-05' });

const PARALLEL_POLL_INTERVAL = 5000;
const SEQUENTIAL_POLL_INTERVAL = 100;

function createQueuePoller(route: SqsRoute) {
  const { sqsOptions, uri } = config.aws.sqs.queues[route.path];

  const params = {
    AttributeNames: ['SentTimestamp'],
    MaxNumberOfMessages: sqsOptions?.maxNumberOfMessages ?? 10,
    MessageAttributeNames: ['All'],
    QueueUrl: uri,
    VisibilityTimeout: sqsOptions?.visibilityTimeout ?? 300,
  };

  const pollerTypes = {
    parallel: () => setInterval(() => poller(uri, sqsOptions), sqsOptions?.pollIntervalMs ?? PARALLEL_POLL_INTERVAL),
    sequential: () => setTimeout(() => pollSequential(uri, sqsOptions), 0),
  };

  pollers[uri] = {
    active: true,
    params,
    events: [],
    timer: pollerTypes[sqsOptions?.pollerType ?? 'parallel'](),
  };
}

function poller(queue: string, sqsOptions: SqsOptions) {
  const { params } = pollers[queue];

  return poll(queue)
    .then((handles) => Promise.allSettled(handles))
    .then((results) => {
      const messagesToDelete = results.filter((result) => sqsOptions?.forceDelete === true || result.status === 'fulfilled');

      if (messagesToDelete.length === 0) return;

      return instance.deleteMessageBatch({
        QueueUrl: params.QueueUrl,
        Entries: messagesToDelete.map((result, i) => ({
          Id: `${i}`,
          ReceiptHandle: result[result.status === 'fulfilled' ? 'value' : 'reason'].context.params.receiptHandle,
        })),
      })
        .promise();
    });
}

function pollSequential(queue: string, sqsOptions: SqsOptions): void {
  const { active } = pollers[queue];

  if (active !== true) return;

  poller(queue, sqsOptions)
    .then(() => setTimeout(() => pollSequential(queue, sqsOptions), sqsOptions?.pollIntervalMs ?? SEQUENTIAL_POLL_INTERVAL));
}

function poll(queue: string): Promise<any> {
  const promises = [];

  return instance.receiveMessage(pollers[queue].params)
    .promise()
    .then((response) => {
      (response?.Messages || []).forEach((message) => {
        let messageBody;
        try {
          messageBody = JSON.parse(message.Body);
        } catch (error) {
          return Promise.reject(InternalError(`SQS Event Error on ${queue} ${error.stack}`, createContext(null, message.ReceiptHandle)));
        }

        (messageBody.Records || [messageBody]).forEach((body) => {
          pollers[queue].events.forEach((event: Route) => {
            let messageOperationId = body.operationId;

            // Note: Add other service configurations here
            if (body.s3) messageOperationId = `S3::${body.s3.bucket.name}`;

            if (messageOperationId === event.operationId) {
              const context = createContext(body, message.ReceiptHandle);
              const { promise, resolve, reject } = deferred();
              promises.push(promise);

              const operationPromise = Promise.resolve(event.resolver(context))
                .then((data) => resolve({ data, context }))
                .catch((error) => reject({ message: `Error during SQS ${messageOperationId}: ${error} ${error.stack}`, context }));

              modules?.newrelic?.startWebTransaction(`SQS ${messageOperationId}`, () => operationPromise);
            }
          });
        });
      });

      return promises;
    });
}

function createContext(body: Serializable, receiptHandle: string) {
  return {
    id: uuid(),
    ip: '0.0.0.0',
    method: 'sqs',
    url: '',
    path: '',
    params: { receiptHandle },
    query: {},
    body,
    getFiles: () => null,
    headers: {},
    errors: [],
  };
}

export function register(route: Route) {
  const { uri } = config.aws.sqs.queues?.[route.path] ?? {};
  if (!uri) return logger.error(`Cannot register queue "${route.path}" for route ${uri}. It should be a valid url. Route disabled.`);
  if (!(uri in pollers)) createQueuePoller(route);

  pollers[uri].events.push(route);
}

export function closeRouter() {
  for (const queue in pollers) {
    if (pollers.hasOwnProperty(queue)) {
      clearInterval(pollers[queue].timer);
      pollers[queue].active = false;
    }
  }
}
