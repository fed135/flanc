import { <project_name>Api, <project_name>ApiDirect, <project_name>ApiEU } from '../utils/api';

describe('Given that we have a healthy service', () => {
  describe('Healtcheck', () => {
    test('Canada Healthcheck route should return positively', (done) => {
      <project_name>Api.get('/healthcheck')
        .expect(200, done);
    });

    test('Canada Readiness route should return positively', (done) => {
      <project_name>Api.get('/readycheck')
        .expect(200, done);
    });

    test('Europe Healthcheck route should return positively', (done) => {
      <project_name>ApiEU.get('/healthcheck')
        .expect(200, done);
    });

    test('Europe Readiness route should return positively', (done) => {
      <project_name>ApiEU.get('/readycheck')
        .expect(200, done);
    });
  });

  describe('Security', () => {
    test('Should intercept reflected xss attacks', (done) => {
      <project_name>ApiDirect.get('/html/bank-linking/generate-form/v1/flinks/connect/TD?legacyUserId=5f71591cbfd15b0007481261n8lsr%3cscript%3ealert(1)%3c%2fscript%3emvfsn')
        .expect(406, done);
    });
  });

  describe('Context', () => {
    test('Should return a unique request id in the headers', () => {
      return <project_name>Api.get('/jsonapi/')
        .expect(404)
        .then((res) => {
          return expect(res.headers['x-request-id']).not.toBeNull();
        });
    });

    test('Should forward inbound request ids in the headers', () => {
      return <project_name>Api.get('/jsonapi/')
        .set('x-request-id', 'abc')
        .expect(404)
        .then((res) => {
          return expect(res.headers['x-request-id']).toEqual('abc');
        });
    });
  });
});
