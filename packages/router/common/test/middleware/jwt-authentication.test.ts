import config from 'config';
import { ExpressRequest } from '@<project_name>/core-util/express-types';
import { generateObjectIdFromChar } from '@<project_name>/test-utils/tools';
import jwt from 'jsonwebtoken';
import jwtAuthentication from '../../middleware/jwt-authentication';
import { model as legacyUserModel } from '@<project_name>/resource-user-legacy/model';
import { BadRequest, Unauthorized } from '@<project_name>/core-util/errors';
import { generateExpressRequest, generateExpressResponse } from '@<project_name>/core-util/test/express-utils';

enum AuthType {
  BASIC = 'Basic',
  BEARER = 'Bearer',
}

const next = jest.fn();
const userId = '5e593fb39cd43413bdd0253f';
const tokenData = { userId, exp: 5000000000 };

config.auth.jwtSecret = 'some-fake-key';

legacyUserModel.findUserById = jest.fn(() => Promise.reject());

const createRequest = (type, token): ExpressRequest => {
  const request = generateExpressRequest({});
  request.headers.authorization = `${type} ${token}`;
  return request;
};

const mockResponse = generateExpressResponse({
  status: jest.fn().mockReturnValue({}),
  json: jest.fn().mockReturnValue({}),
});

const adminUser = {
  _id: generateObjectIdFromChar('1'),
  person: {
    first_name: 'Wesley',
    last_name: 'Snipes',
  },
  roles: ['user', 'admin'],
};

const regularUser = {
  _id: generateObjectIdFromChar('2'),
  person: {
    first_name: 'Simon',
    last_name: 'Phoenix',
  },
  roles: ['user', 'cryo-prisonner'],
};

const adminUserToken: UserToken = {
  legacyId: adminUser._id.toString(),
  id: 'some-admin-id',
  name: `${adminUser.person.first_name} ${adminUser.person.last_name}`,
  token: 'SWYgeW91IGRpc2NvdmVyIHRoaXMsIEkgb3dlIHlvdSBhIGJlZXIgOikgTWF0cw==',
  expires: 5000000000,
};

const regularUserToken: UserToken = {
  legacyId: regularUser._id.toString(),
  id: 'some-regular-id',
  name: `${regularUser.person.first_name} ${regularUser.person.last_name}`,
  token: 'SWYgeW91IGRpc2NvdmVyIHRoaXMsIEkgb3dlIHlvdSBhIGJlZXIgOikgTWF0cw==',
  expires: 5000000000,
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('[Packages | Router | JSON-API | Middleware] interacting with authentication middleware', () => {
  describe('given JWT secret is not set', () => {
    describe('when validating authentication', () => {
      test('then the server throws an InternalError', () => {
        const jwtSecretBackup = config.auth.jwtSecret;
        config.auth.jwtSecret = undefined;
        expect(jwtAuthentication).toThrowInternalError('JWT secret is not set.');
        config.auth.jwtSecret = jwtSecretBackup;
      });
    });
  });

  describe('given a request not containing an authorization token', () => {
    describe('when validating authentication', () => {
      test('then `next` is called with a BadRequest error', () => {
        const request = generateExpressRequest({});
        return jwtAuthentication()(request, mockResponse, next)
          .then(() => expect(next).toHaveBeenCalledWith(BadRequest('Invalid Token: Bearer auth type is mandatory', request.context)));
      });
    });
  });

  describe('given a request containing an authorization token', () => {
    describe('and the authorization token has an invalid authorization type', () => {
      describe('when validating authentication', () => {
        test('then `next` is called with a BadRequest error', () => {
          const validToken = jwt.sign(tokenData, config.auth.jwtSecret);
          const request = createRequest(AuthType.BASIC, validToken);
          return jwtAuthentication()(request, mockResponse, next)
            .then(() => expect(next).toHaveBeenCalledWith(BadRequest('Invalid Token: Bearer auth type is mandatory', request.context)));
        });
      });
    });

    describe('and the authorization token is expired', () => {
      describe('when validating authentication', () => {
        test('then `next` is called with an Unauthorized error', () => {
          const expiredToken = jwt.sign({ userId, exp: 1516239022 }, config.auth.jwtSecret);
          const request = createRequest(AuthType.BEARER, expiredToken);
          return jwtAuthentication()(request, mockResponse, next)
            .then(() => expect(next).toHaveBeenCalledWith(Unauthorized('Invalid Token: jwt expired', request.context)));
        });
      });
    });

    describe('and the authorization token cannot be verified', () => {
      describe('when validating authentication', () => {
        test('then `next` is called with an Unauthorized error', () => {
          const encryptedWithWrongSecretToken = jwt.sign({ userId, exp: 5000000000 }, 'wrong-secret');
          const request = createRequest(AuthType.BEARER, encryptedWithWrongSecretToken);
          jwtAuthentication()(request, mockResponse, next)
            .then(() => expect(next).toHaveBeenCalledWith(Unauthorized('Invalid Token: invalid signature', request.context)));
        });
      });
    });

    describe('and the authorization token does not contain a user id nor an id', () => {
      const missingUserIdToken = jwt.sign({ exp: 5000000000 }, config.auth.jwtSecret);
      const emptyUserIdToken = jwt.sign({ userId: undefined, exp: 5000000000 }, config.auth.jwtSecret);
      const nullUserIdToken = jwt.sign({ userId: null, exp: 5000000000 }, config.auth.jwtSecret);
      const missingUserIdWithId = jwt.sign({ id: userId, exp: 5000000000 }, config.auth.jwtSecret);

      describe('when validating authentication', () => {
        test('then `next` is called with a BadRequest error', () => {
          const request = createRequest(AuthType.BEARER, missingUserIdToken);
          return jwtAuthentication()(request, mockResponse, next)
            .then(() => expect(next).toHaveBeenCalledWith(Unauthorized('Invalid Token: Missing userId or legacyId', request.context)));
        });

        test('then `next` is called with a BadRequest error', () => {
          const request = createRequest(AuthType.BEARER, emptyUserIdToken);
          return jwtAuthentication()(request, mockResponse, next)
            .then(() => expect(next).toHaveBeenCalledWith(Unauthorized('Invalid Token: Missing userId or legacyId', request.context)));
        });

        test('then `next` is called with a BadRequest error', () => {
          const request = createRequest(AuthType.BEARER, nullUserIdToken);
          jwtAuthentication()(request, mockResponse, next)
            .then(() => expect(next).toHaveBeenCalledWith(Unauthorized('Invalid Token: Missing userId or legacyId', request.context)));
        });

        test('then `next` is called with a BadRequest error', () => {
          const request = createRequest(AuthType.BEARER, missingUserIdWithId);
          jwtAuthentication()(request, mockResponse, next)
            .then(() => expect(next).toHaveBeenCalledWith(Unauthorized('Invalid Token: Missing userId or legacyId', request.context)));
        });
      });
    });

    describe('when the authorization token is valid', () => {
      describe('when validating authentication with `userId`', () => {
        test('then `next` is called without any error', () => {
          const validToken = jwt.sign(tokenData, config.auth.jwtSecret);
          const request = createRequest(AuthType.BEARER, validToken);
          return jwtAuthentication()(request, mockResponse, next)
            .then(() => expect(next).toHaveBeenCalledWith());
        });
      });
    });
  });

  describe('given a request with invalid access', () => {
    describe('when the user is not an admin', () => {
      test('then the request fails with an error', () => {
        const token = jwt.sign(regularUserToken, config.auth.jwtSecret);
        const req = createRequest(AuthType.BEARER, token);
        legacyUserModel.findUserById.mockResolvedValueOnce(regularUser);

        return jwtAuthentication({ roles: ['paranoid-in-chief'] })(req, mockResponse, next)
          .then(() => expect(next).toHaveBeenCalledWith(Unauthorized(`User with legacy ID "${regularUser._id}" does not have one of the required roles "paranoid-in-chief"`)));
      });
    });

    describe('when the user token does not contain an admin role', () => {
      test('then the request fails with an error', () => {
        const token = jwt.sign({ ...regularUserToken, roles: ['samurai'] }, config.auth.jwtSecret);
        const req = createRequest(AuthType.BEARER, token);
        legacyUserModel.findUserById.mockResolvedValueOnce(regularUser);

        return jwtAuthentication({ roles: ['galactic-viceroy', 'chief-flavor-officer'] })(req, mockResponse, next)
          .then(() => expect(next).toHaveBeenCalledWith(Unauthorized(`User with legacy ID "${regularUser._id}" does not have one of the required roles "galactic-viceroy, chief-flavor-officer"`)));
      });
    });
  });

  describe('given a request with valid access', () => {
    describe('when the user object in the database has admin access', () => {
      test('then the request is not interrupted', () => {
        const token = jwt.sign(adminUserToken, config.auth.jwtSecret);
        const req = createRequest(AuthType.BEARER, token);
        legacyUserModel.findUserById.mockResolvedValueOnce(adminUser);

        return jwtAuthentication({ roles: ['admin'] })(req, mockResponse, next)
          .then(() => expect(next).toHaveBeenCalledWith());
      });
    });

    describe('when the user token has admin access', () => {
      test('then the request is not interrupted', () => {
        const token = jwt.sign({ ...adminUserToken, roles: ['admin'] }, config.auth.jwtSecret);
        const req = createRequest(AuthType.BEARER, token);

        return jwtAuthentication({ roles: ['admin'] })(req, mockResponse, next)
          .then(() => expect(next).toHaveBeenCalledWith());
      });
    });
  });
});
