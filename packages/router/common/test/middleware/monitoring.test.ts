import { generateExpressRequest } from '@<project_name>/core-util/test/express-utils';
import monitoring from '../../middleware/monitoring';
import newrelic from 'newrelic';

let setControllerNameMock;

describe('[Packages | Router | JSON-API] interacting with the json api monitoring tools', () => {
  beforeEach(() => {
    setControllerNameMock = jest.spyOn(newrelic, 'setControllerName').mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('given a route not registered in the API', () => {
    const request = generateExpressRequest({ path: '/foo/123' });

    describe('when monitoring a request', () => {
      const nextMock = jest.fn(() => {});
      monitoring(request, {}, nextMock);

      test('then controller name is not monitored and next middleware is triggered', () => {
        expect.assertions(2);
        expect(setControllerNameMock).toBeCalledTimes(0);
        return expect(nextMock).toHaveBeenCalled();
      });
    });
  });

  describe('given a route registered in the API ', () => {
    describe('when monitoring a request with operation id in context', () => {
      const request = generateExpressRequest({ path: '/foo/123', context: { operationId: 'get /foo/:bar' } });
      const nextMock = jest.fn(() => {});

      test('then controller name is monitored as expected and next middleware is triggered', () => {
        monitoring(request, {}, nextMock);
        expect.assertions(2);
        expect(setControllerNameMock).toHaveBeenCalledWith('GET /foo/:bar');
        return expect(nextMock).toHaveBeenCalled();
      });
    });

    describe('when monitoring a request with both operation id and include params in context', () => {
      const request = generateExpressRequest({
        path: '/foo/123',
        context: { operationId: 'get /foo/:bar', params: { include: ['user', 'user.account', 'assets'] } },
      });
      const nextMock = jest.fn(() => {});

      test('then controller name is monitored as expected and next middleware is triggered', () => {
        monitoring(request, {}, nextMock);
        expect.assertions(2);
        expect(setControllerNameMock).toHaveBeenCalledWith('GET /foo/:bar [user,account,assets]');
        return expect(nextMock).toHaveBeenCalled();
      });
    });
  });
});
