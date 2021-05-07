import { generateRequestContext } from './express-utils';
import { ApiError } from '../errors';

describe('[Packages | Core-util | Errors] generating api errors', () => {
  describe('given we are throwing an api error associated with a request', () => {
    describe('when the request headers contain a valid authorization token ', () => {
      test('then the error data should contain an obfuscated authorization token', () => {
        const ctx = generateRequestContext();
        ctx.headers.authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOiI1YWQ2MTBmY2U4MTVlODQ2NGNjNjU2MzMiLCJpYXQiOjE1OTIzMzMxNDQsImV4cCI6MTU5MjQxOTU0NCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIiwianRpIjoiNjQwMzhkMTEtMTY2NC00ODFlLWJmNTEtN2FlN2RiZWM0NWY3In0.6PShd2T4eqx9GjSjRk0wFM7XRR0ocDVynfOLTPHNQQ8';

        expect(new ApiError(new Error('Test'), 500, 'this is a test', 'foo', ctx).source.request.headers).toEqual({
          authorization: 'Bearer eyJh...NQQ8',
        });
      });
    });

    describe('when the request headers contain an invalid authorization token ', () => {
      test('then the error data should contain an obfuscated authorization token', () => {
        const ctx = generateRequestContext();
        ctx.id = 'def';
        ctx.url = '/';
        ctx.headers.authorization = 'Some invalid token';

        expect(new ApiError(new Error('Test'), 500, 'this is a test', 'bar', ctx).source.request.headers).toEqual({
          authorization: 'invalid token',
        });
      });
    });
  });
});
