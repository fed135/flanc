import axios from 'axios';
import { fetch } from '../src/fetch';
import { generateRequestContext } from './express-utils';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({})),
  post: jest.fn(() => Promise.resolve({})),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const testService: Service = {
  host: 'http://0.0.0.0',
};
const testContext = generateRequestContext({ headers: { 'x-request-id': '123' } });

describe('[Packages | Core-util | fetch] interacting with fetch utils', () => {
  describe('when making an invalid call with base parameters', () => {
    test('then the method should return a rejected promise with a <project_name>API error', () => {
      axios.get.mockImplementationOnce(() => Promise.reject(new Error('Could not establish connection with host')));

      return expect(fetch.bind(null, testService, { path: '/' }, testContext)).rejects.toEqual(new Error('Could not establish connection with host'));
    });
  });

  describe('when making a valid call with base parameters', () => {
    test('then the http request library should be invoked with the expected options', () => {
      return fetch(testService, { path: '/' }, testContext)
        .then(() => {
          expect(axios.get).toHaveBeenCalledWith('http://0.0.0.0/', {
            timeout: 20000,
            params: {},
            headers: { 'x-request-id': '123' },
            responseType: 'json',
          });
        });
    });

    test('then the method should return a valid promise with the data', () => {
      axios.get.mockImplementationOnce(() => Promise.resolve({ status: 'ok' }));

      return expect(fetch(testService, { path: '/' }, testContext)).resolves.toEqual({ status: 'ok' });
    });
  });

  describe('when making a valid call with some options', () => {
    test('then the http request library should be invoked with default parameters and options mixed-in', () => {
      return fetch(testService, {
        path: '/foo',
        timeout: 10,
        headers: {
          'x-request-id': '456',
          'Accept-Language': 'fr-CA',
        },
        method: 'post',
        query: {
          id: 'abc',
        },
        body: {
          name: 'John Smith',
        },
        responseType: 'text',
      }, testContext)
        .then(() => {
          expect(axios.post).toHaveBeenCalledWith('http://0.0.0.0/foo', { name: 'John Smith' }, {
            timeout: 10,
            params: { id: 'abc' },
            headers: { 'x-request-id': '456', 'Accept-Language': 'fr-CA' },
            responseType: 'text',
          });
        });
    });
  });
});
