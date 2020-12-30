import { <project_name>ApiError } from '@<project_name>/core-util/errors';

interface Expected<project_name>ApiError {
  message: string
  status: number
  title: string
}

const executeTriggeringFunction = (triggeringFunction) => {
  try {
    triggeringFunction();
    return null;
  } catch (e) {
    return e;
  }
};

const assert<project_name>ApiError = (error: <project_name>ApiError, expected: Expected<project_name>ApiError): jest.CustomMatcherResult => {
  if (typeof error === 'function') {
    error = executeTriggeringFunction(error);
  }

  const isExpectedErrorType: boolean = (error instanceof <project_name>ApiError)
  && error.status === expected.status
  && error.title === expected.title;

  if (!isExpectedErrorType) {
    return {
      pass: false,
      message: () => `expected <project_name>ApiError<${expected.title}> with message "${expected.message}", received ${JSON.stringify(error)}.`,
    };
  }

  if (error.message !== expected.message) {
    return {
      pass: false,
      message: () => `expected <project_name>ApiError<${expected.title}> with message "${expected.message}", received unexpected error message: \`${error.message}\`.`,
    };
  }

  return {
    pass: true,
    message: () => '',
  };
};

expect.extend({
  toThrowUnauthorized<T extends <project_name>ApiError>(receivedError: T, expectedMessage: string) {
    return assert<project_name>ApiError(
      receivedError,
      { message: expectedMessage, status: 401, title: 'Unauthorized' }
    );
  },
  toThrowBadRequest<T extends <project_name>ApiError>(receivedError: T, expectedMessage: string) {
    return assert<project_name>ApiError(
      receivedError,
      { message: expectedMessage, status: 400, title: 'Bad Request' }
    );
  },
  toThrowNotFound<T extends <project_name>ApiError>(receivedError: T, expectedMessage: string) {
    return assert<project_name>ApiError(
      receivedError,
      { message: expectedMessage, status: 404, title: 'Not Found' }
    );
  },
  toThrowConflict<T extends <project_name>ApiError>(receivedError: T, expectedMessage: string) {
    return assert<project_name>ApiError(
      receivedError,
      { message: expectedMessage, status: 409, title: 'Conflict' }
    );
  },
  toThrowInternalError<T extends <project_name>ApiError>(receivedError: T, expectedMessage: string) {
    return assert<project_name>ApiError(
      receivedError,
      { message: expectedMessage, status: 500, title: 'Internal Server Error' }
    );
  },
});
