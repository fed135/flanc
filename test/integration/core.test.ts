import { mokaApi, mokaApiDirect, mokaApiEU } from '../utils/api';

describe('Given that we have a healthy service', () => {
  describe('Healtcheck', () => {
    test('Canada Healthcheck route should return positively', (done) => {
      mokaApi.get('/healthcheck')
        .expect(200, done);
    });

    test('Canada Readiness route should return positively', (done) => {
      mokaApi.get('/readycheck')
        .expect(200, done);
    });

    test('Europe Healthcheck route should return positively', (done) => {
      mokaApiEU.get('/healthcheck')
        .expect(200, done);
    });

    test('Europe Readiness route should return positively', (done) => {
      mokaApiEU.get('/readycheck')
        .expect(200, done);
    });
  });

  describe('Security', () => {
    test('Should intercept reflected xss attacks', (done) => {
      mokaApiDirect.get('/html/bank-linking/generate-form/v1/flinks/connect/TD?legacyUserId=5f71591cbfd15b0007481261n8lsr%3cscript%3ealert(1)%3c%2fscript%3emvfsn')
        .expect(406, done);
    });
  });

  describe('Context', () => {
    test('Should return a unique request id in the headers', () => {
      return mokaApi.get('/jsonapi/')
        .expect(404)
        .then((res) => {
          return expect(res.headers['x-request-id']).not.toBeNull();
        });
    });

    test('Should forward inbound request ids in the headers', () => {
      return mokaApi.get('/jsonapi/')
        .set('x-request-id', 'abc')
        .expect(404)
        .then((res) => {
          return expect(res.headers['x-request-id']).toEqual('abc');
        });
    });
  });
});
