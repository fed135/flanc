import { path } from '../../src/router-commons/utils';

describe('[Packages | Router | JSON-API] interacting with the json api utils', () => {
  describe('given include params config with a set depth limit of 1', () => {
    describe('when validating include values with a deeper depth than config', () => {
      const includeParams = {
        'x-direct-relations': ['user', 'banks'],
        'x-include-rules': { 'max-depth': 1 },
      };
      const validIncludeStatement = ['user', 'user.accounts', 'user.accounts.bank', 'banks'];
      test('then a bad request error is thrown', () => {
        expect(path.guardAgainstForbiddenIncludePattern.bind(null, validIncludeStatement, includeParams))
          .toThrowBadRequest('Invalid include value user.accounts: Too much nesting');
      });
    });
  });

  describe('given include params config with blacklisted items', () => {
    describe('when validating include values containing blacklisted items', () => {
      const includeParams = {
        'x-direct-relations': ['user', 'banks'],
        'x-include-rules': { blacklist: ['user.accounts.bank'] },
      };
      const validIncludeStatement = ['user', 'user.accounts', 'user.accounts.bank', 'banks'];
      test('then a bad request error is thrown', () => {
        expect(path.guardAgainstForbiddenIncludePattern.bind(null, validIncludeStatement, includeParams))
          .toThrowBadRequest('Invalid include value user.accounts.bank: Relationship forbidden');
      });
    });
  });

  describe('given include params config with set relations', () => {
    describe('when validating include values containing unknown relations', () => {
      const includeParams = {
        'x-direct-relations': ['user'],
      };
      const validIncludeStatement = ['user', 'user.accounts', 'user.accounts.bank', 'banks'];
      test('then a bad request error is thrown', () => {
        expect(path.guardAgainstForbiddenIncludePattern.bind(null, validIncludeStatement, includeParams))
          .toThrowBadRequest('Invalid include value banks: Not a relationship');
      });
    });

    describe('when validating include values containing known relations', () => {
      const includeParams = {
        'x-direct-relations': ['user', 'banks'],
      };
      const validIncludeStatement = ['user', 'user.accounts', 'user.accounts.bank', 'user.assets', 'banks'];
      test('then no error is thrown', () => {
        path.guardAgainstForbiddenIncludePattern(validIncludeStatement, includeParams);
      });
    });
  });

  describe('given include params config with a set depth limit of 1 and a whitelisting rule', () => {
    describe('when validating include values containing item from the whitelist', () => {
      const includeParams = {
        'x-direct-relations': ['user', 'banks'],
        'x-include-rules': { 'max-depth': 1, whitelist: ['user.accounts', 'user.accounts.bank'] },
      };
      const validIncludeStatement = ['user', 'user.accounts', 'user.accounts.bank', 'banks'];
      test('then no error is thrown', () => {
        path.guardAgainstForbiddenIncludePattern(validIncludeStatement, includeParams);
      });
    });
  });
});
