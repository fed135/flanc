import { createHmac } from 'crypto';
import { generateRequestContext } from './express-utils';
import { guards, validations } from '../validations';

const context = generateRequestContext();
const userLegacyId = '111111111111111111111111';
const userId = '11111111-1111-1111-1111-111111111111';
const contextWithLegacyUser = generateRequestContext(undefined, { legacyId: userLegacyId });
const contextWithUser = generateRequestContext(undefined, { id: userId });

const payload = Buffer.from(JSON.stringify({ someJsPayload: 'Very nice payload indeed' })).toString('base64');
const key = 'test-key-so-strong';
const signature = createHmac('sha256', key).update(payload).digest('base64');
const validPayloadHmacSignature = { payload, key, signature };

describe('[Packages | Core-util | Validations] interacting with validations utils', () => {
  describe('given an invalid email', () => {
    describe('when validating an undefined value as an email', () => {
      test('then false is returned', () => {
        return expect(validations.isValidEmail(undefined)).toEqual(false);
      });
    });

    describe('when validating an empty value as an email', () => {
      test('then false is returned', () => {
        return expect(validations.isValidEmail('')).toEqual(false);
      });
    });

    describe('when validating a badly formatted value as an email', () => {
      test('then false is returned', () => {
        expect(validations.isValidEmail('my@address')).toEqual(false);
        expect(validations.isValidEmail('my/@address')).toEqual(false);
        expect(validations.isValidEmail('my.address')).toEqual(false);
        expect(validations.isValidEmail('my.address>')).toEqual(false);
        expect(validations.isValidEmail('my<@address.test')).toEqual(false);
      });
    });
  });

  describe('given a valid email', () => {
    describe('when trying to validate a string', () => {
      test('then true is returned', () => {
        expect(validations.isValidEmail('my@address.test')).toEqual(true);
        expect(validations.isValidEmail('my@address.subdomain.test')).toEqual(true);
        expect(validations.isValidEmail('my-seconde@address.test')).toEqual(true);
      });
    });
  });

  describe('given an invalid IP', () => {
    describe('when validating an undefined value as a IP', () => {
      test('then exception is returned', () => {
        return expect(() => validations.isValidIp(undefined)).toThrow('Cannot read property \'trim\' of undefined');
      });
    });

    describe('when validating an empty value as a IP', () => {
      test('then exception is returned', () => {
        return expect(validations.isValidIp('')).toEqual(false);
      });
    });

    describe('when validating a badly formatted value as a IP', () => {
      test('then false is returned', () => {
        expect(validations.isValidIp('0')).toEqual(false);
        expect(validations.isValidIp('0.0')).toEqual(false);
        expect(validations.isValidIp('0.0.0')).toEqual(false);
        expect(validations.isValidIp('256.0.0.0')).toEqual(false);
        expect(validations.isValidIp('0.256.0.0')).toEqual(false);
        expect(validations.isValidIp('0.0.256.0')).toEqual(false);
        expect(validations.isValidIp('0.0.0.256')).toEqual(false);
        expect(validations.isValidIp('1270.127.127.127')).toEqual(false);
        expect(validations.isValidIp('127.1270.127.127')).toEqual(false);
        expect(validations.isValidIp('127.127.1270.127')).toEqual(false);
        expect(validations.isValidIp('127.127.127.1270')).toEqual(false);
      });
    });
  });

  describe('given a valid IP', () => {
    describe('when trying to validate a string', () => {
      test('then true is returned', () => {
        expect(validations.isValidIp('0.0.0.0')).toEqual(true);
        expect(validations.isValidIp('127.0.0.0')).toEqual(true);
        expect(validations.isValidIp('255.255.255.255')).toEqual(true);
      });
    });
  });

  describe('given an invalid UUID', () => {
    describe('when validating an undefined value as an UUID', () => {
      test('then false is returned', () => {
        return expect(validations.isValidUUID(undefined)).toEqual(false);
      });
    });

    describe('when validating an empty value as an UUID', () => {
      test('then false is returned', () => {
        return expect(validations.isValidUUID('')).toEqual(false);
      });
    });

    describe('when validating a badly formatted value as an UUID', () => {
      test('then false is returned', () => {
        expect(validations.isValidUUID('11111111-1111-1111-11111111111')).toEqual(false);
        expect(validations.isValidUUID('11111111-bad-1111-1111-11111111111')).toEqual(false);
        expect(validations.isValidUUID('1111111111111111111111111111111')).toEqual(false);
      });
    });
  });

  describe('given a valid UUID', () => {
    describe('when trying to validate a string', () => {
      test('then true is returned', () => {
        return expect(validations.isValidUUID('11111111-1111-1111-1111-111111111111')).toEqual(true);
      });
    });
  });

  describe('given an invalid ObjectId', () => {
    describe('when validating an undefined value as an ObjectId', () => {
      test('then false is returned', () => {
        return expect(validations.isValidObjectId(undefined)).toEqual(false);
      });
    });

    describe('when validating an empty value as an ObjectId', () => {
      test('then false is returned', () => {
        return expect(validations.isValidObjectId('')).toEqual(false);
      });
    });

    describe('when validating a badly formatted value as an ObjectId', () => {
      test('then false is returned', () => {
        expect(validations.isValidObjectId('badIdWithMoreCharactersThan24')).toEqual(false);
        expect(validations.isValidObjectId('badId')).toEqual(false);
      });
    });
  });

  describe('given a valid ObjectId', () => {
    describe('when trying to validate a string', () => {
      test('then true is returned', () => {
        expect(validations.isValidObjectId('111111111111111111111111')).toEqual(true);
        expect(validations.isValidObjectId('111111111111')).toEqual(true);
      });
    });
  });

  describe('given an invalid 2 digits month', () => {
    describe('when trying to validate a string', () => {
      test('then false is returned', () => {
        expect(validations.isValidMonth('')).toEqual(false);
        expect(validations.isValidMonth('00')).toEqual(false);
        expect(validations.isValidMonth('01 ')).toEqual(false);
        expect(validations.isValidMonth('13')).toEqual(false);
        expect(validations.isValidMonth('0')).toEqual(false);
        expect(validations.isValidMonth('1')).toEqual(false);
        expect(validations.isValidMonth('2')).toEqual(false);
        expect(validations.isValidMonth('3')).toEqual(false);
        expect(validations.isValidMonth('4')).toEqual(false);
        expect(validations.isValidMonth('5')).toEqual(false);
        expect(validations.isValidMonth('6')).toEqual(false);
        expect(validations.isValidMonth('7')).toEqual(false);
        expect(validations.isValidMonth('8')).toEqual(false);
        expect(validations.isValidMonth('9')).toEqual(false);
      });
    });
  });

  describe('given a valid 2 digits month', () => {
    describe('when trying to validate a string', () => {
      test('then true is returned', () => {
        expect(validations.isValidMonth('01')).toEqual(true);
        expect(validations.isValidMonth('02')).toEqual(true);
        expect(validations.isValidMonth('03')).toEqual(true);
        expect(validations.isValidMonth('04')).toEqual(true);
        expect(validations.isValidMonth('05')).toEqual(true);
        expect(validations.isValidMonth('06')).toEqual(true);
        expect(validations.isValidMonth('07')).toEqual(true);
        expect(validations.isValidMonth('08')).toEqual(true);
        expect(validations.isValidMonth('09')).toEqual(true);
        expect(validations.isValidMonth('10')).toEqual(true);
        expect(validations.isValidMonth('11')).toEqual(true);
        expect(validations.isValidMonth('12')).toEqual(true);
      });
    });
  });

  describe('given a valid 4 digits year', () => {
    describe('when trying to validate a string', () => {
      test('then true is returned', () => {
        expect(validations.isValidFullYear('2020')).toEqual(true);
        expect(validations.isValidFullYear('0000')).toEqual(true);
        expect(validations.isValidFullYear('1111')).toEqual(true);
        expect(validations.isValidFullYear('9999')).toEqual(true);
      });
    });
  });

  describe('given an invalid 4 digits year', () => {
    describe('when trying to validate a string', () => {
      test('then false is returned', () => {
        expect(validations.isValidFullYear('20')).toEqual(false);
        expect(validations.isValidFullYear('99')).toEqual(false);
        expect(validations.isValidFullYear('')).toEqual(false);
        expect(validations.isValidFullYear('2020 ')).toEqual(false);
      });
    });
  });

  describe('given a invalid positive integer', () => {
    describe('when validating an undefined value as positive integer', () => {
      test('then false is returned', () => {
        return expect(validations.isPositiveInteger(undefined)).toEqual(false);
      });
    });

    describe('when validating a number that is type string as positive integer', () => {
      test('then false is returned', () => {
        return expect(validations.isPositiveInteger('1')).toEqual(false);
      });
    });

    describe('when validating a number that is negative as positive integer', () => {
      test('then false is returned', () => {
        return expect(validations.isPositiveInteger(-1)).toEqual(false);
      });
    });

    describe('when validating a string as positive integer', () => {
      test('then false is returned', () => {
        return expect(validations.isPositiveInteger('thisisastring')).toEqual(false);
      });
    });

    describe('when validating an empty value as positive integer', () => {
      test('then false is returned', () => {
        return expect(validations.isPositiveInteger('')).toEqual(false);
      });
    });
  });

  describe('given a valid positive integer', () => {
    describe('when trying to validate a positive integer', () => {
      test('then true is returned', () => {
        expect(validations.isPositiveInteger(0)).toEqual(true);
        expect(validations.isPositiveInteger(1)).toEqual(true);
      });
    });
  });

  describe('given a non-empty string', () => {
    describe('when trying to validate if it is empty', () => {
      test('then false is returned', () => {
        expect(validations.isEmpty('allo')).toEqual(false);
      });
    });
  });

  describe('given an empty string', () => {
    describe('when trying to validate if it is empty', () => {
      test('then true is returned', () => {
        expect(validations.isEmpty(undefined)).toEqual(true);
        expect(validations.isEmpty(null)).toEqual(true);
        expect(validations.isEmpty('')).toEqual(true);
        expect(validations.isEmpty(' ')).toEqual(true);
        expect(validations.isEmpty('        ')).toEqual(true);
      });
    });
  });

  describe('given a valid object', () => {
    describe('when trying to validate if an unexisting field is not empty ', () => {
      test('then false is returned', () => {
        const data1 = {};
        const data2 = { field2: 'yes' };
        expect(validations.isFieldNotEmpty(data1, 'field1')).toEqual(false);
        expect(validations.isFieldNotEmpty(data2, 'field1')).toEqual(false);
      });
    });

    describe('when trying to validate if an existing field with an empty value is not empty ', () => {
      test('then false is returned', () => {
        const data = {
          field1: undefined,
          field2: null,
          field3: '',
        };
        expect(validations.isFieldNotEmpty(data, 'field1')).toEqual(false);
        expect(validations.isFieldNotEmpty(data, 'field3')).toEqual(false);
        expect(validations.isFieldNotEmpty(data, 'field3')).toEqual(false);
      });
    });

    describe('when trying to validate if an existing field with a value is not empty ', () => {
      test('then true is returned', () => {
        const data = {
          field1: 'value',
          field2: 2,
          field3: false,
        };
        expect(validations.isFieldNotEmpty(data, 'field1')).toEqual(true);
        expect(validations.isFieldNotEmpty(data, 'field3')).toEqual(true);
        expect(validations.isFieldNotEmpty(data, 'field3')).toEqual(true);
      });
    });
  });

  describe('given an invalid hmac signature', () => {
    describe('when the signed base64 value is bad', () => {
      test('then the returned value is false', () => {
        const invalidPayloadHmacSignature = JSON.parse(JSON.stringify(validPayloadHmacSignature));
        invalidPayloadHmacSignature.signature = 'Rmlyc3Qgb25lIHRvIGZpbmQgdGhpcyB3aWxsIGJlIG9mZmVyZWQgYSBiZWVyIDopIE1hdHM=';
        expect(validations.isValidHmacSignature(invalidPayloadHmacSignature)).toBe(false);
      });
    });

    describe('when the signed value is good', () => {
      test('then the returned value is true', () => {
        expect(validations.isValidHmacSignature(validPayloadHmacSignature)).toBe(true);
      });
    });
  });
});

describe('[Packages | Core-util | Validations] interacting with the guards utils', () => {
  describe('testing the invalid legacy id guard', () => {
    describe('when user legacy id is not defined', () => {
      test('then an exception is thrown', () => {
        expect(guards.invalidLegacyId.bind(null, undefined, 'userLegacyId', context)).toThrowBadRequest('Missing `userLegacyId`.');
        expect(guards.invalidLegacyId.bind(null, null, 'userLegacyId', context)).toThrowBadRequest('Missing `userLegacyId`.');
        expect(guards.invalidLegacyId.bind(null, '', 'userLegacyId', context)).toThrowBadRequest('Missing `userLegacyId`.');
      });
    });

    describe('when user legacy id is not a valid Object Id', () => {
      test('then an exception is thrown', () => {
        expect(guards.invalidLegacyId.bind(null, '123', 'userLegacyId', context)).toThrowBadRequest('Invalid `userLegacyId`: 123.');
      });
    });

    describe('when user legacy id is a valid Object Id', () => {
      test('then an exception is thrown', () => {
        expect(guards.invalidLegacyId.bind(null, userLegacyId, 'userLegacyId', context)).not.toThrow();
      });
    });
  });

  describe('testing the unauthorized user guard', () => {
    describe('when user id is not defined', () => {
      test('then an exception is thrown', () => {
        expect(guards.unauthorizedUser.bind(null, undefined, context)).toThrowBadRequest('Invalid user id.');
        expect(guards.unauthorizedUser.bind(null, null, context)).toThrowBadRequest('Invalid user id.');
        expect(guards.unauthorizedUser.bind(null, '', context)).toThrowBadRequest('Invalid user id.');
      });
    });

    describe('when user id is not a valid ObjectId nor a valid UUID', () => {
      test('then an exception is thrown', () => {
        expect(guards.unauthorizedUser.bind(null, '12343', context)).toThrowBadRequest('Invalid user id.');
      });
    });

    describe('when user legacy id is a valid Object Id', () => {
      describe('and value does not match user legacy id in context', () => {
        test('then an exception is thrown', () => {
          expect(guards.unauthorizedUser.bind(null, userLegacyId, context)).toThrowUnauthorized('Unauthorized (request user_id: 111111111111111111111111, session user_id: undefined).');
        });
      });
      describe('and value matches user legacy id in context', () => {
        test('then an exception is thrown', () => {
          expect(guards.unauthorizedUser.bind(null, userLegacyId, contextWithLegacyUser)).not.toThrow();
        });
      });
    });

    describe('when user id is a valid UUID', () => {
      describe('and value does not match user id in context', () => {
        test('then an exception is thrown', () => {
          expect(guards.unauthorizedUser.bind(null, userId, context)).toThrowUnauthorized('Unauthorized (request user_id: 11111111-1111-1111-1111-111111111111, session user_id: undefined).');
        });
      });
      describe('and value matches user legacy id in context', () => {
        test('then an exception is thrown', () => {
          expect(guards.unauthorizedUser.bind(null, userId, contextWithUser)).not.toThrow();
        });
      });
    });
  });

  describe('testing the hmac payload guard', () => {
    describe('when the signed base64 value is bad', () => {
      test('then the guard throws an Unauthorized error', () => {
        const invalidPayloadHmacSignature = JSON.parse(JSON.stringify(validPayloadHmacSignature));
        invalidPayloadHmacSignature.signature = 'Rmlyc3Qgb25lIHRvIGZpbmQgdGhpcyB3aWxsIGJlIG9mZmVyZWQgYSBiZWVyIDopIE1hdHM=';
        expect(guards.invalidHmacSignature.bind(null, invalidPayloadHmacSignature, context)).toThrowUnauthorized('Invalid Signature');
      });
    });

    describe('when the signed value is good', () => {
      test('then the guard does not throw', () => {
        expect(guards.invalidHmacSignature.bind(null, validPayloadHmacSignature, context)).not.toThrow();
      });
    });
  });
});
