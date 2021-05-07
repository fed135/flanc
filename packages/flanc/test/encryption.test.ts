import { Encryption } from '../src/encryption';

const text = 'some text';
const encrypted = 'encrypted';
const encryptionKey = '1234567890-1234567890-1234567890';
const invalidEncryptionKey = 'some-key';

describe('[Packages | Core-util | Encryption] interacting with encryption utils', () => {
  describe('given an unsupported algorithm', () => {
    describe('when trying to encrypt a string', () => {
      test('then an error is thrown', () => {
        return expect(Encryption.encrypt.bind(null, text, encryptionKey, 'not-valid'))
          .toThrow('Encryption algorithm \'not-valid\' is not supported.');
      });
    });

    describe('when trying to decrypt an encrypted string', () => {
      test('then an error is thrown', () => {
        return expect(Encryption.decrypt.bind(null, encrypted, encryptionKey, 'not-valid'))
          .toThrow('Encryption algorithm \'not-valid\' is not supported.');
      });
    });
  });

  describe('given an invalid encryption key', () => {
    describe('and encryption algorithm is AES 256', () => {
      describe('and password length is not 32 characters', () => {
        describe('when trying to encrypt a string', () => {
          test('then an error is thrown', () => {
            expect(invalidEncryptionKey.length).not.toBe(32);
            return expect(Encryption.encrypt.bind(null, text, invalidEncryptionKey, Encryption.Algorithm.AES_256))
              .toThrow('Encryption key must be 32 characters.');
          });
        });

        describe('when trying to decrypt an encrypted string', () => {
          test('then an error is thrown', () => {
            expect(invalidEncryptionKey.length).not.toBe(32);
            return expect(Encryption.decrypt.bind(null, encrypted, invalidEncryptionKey, Encryption.Algorithm.AES_256))
              .toThrow('Encryption key must be 32 characters.');
          });
        });
      });
    });
  });

  describe('given valid a valid encryption key', () => {
    describe('and encryption algorithm is AES 256', () => {
      describe('when a string is encrypted', () => {
        test('then the string can be decrypted', () => {
          const encryptedText = Encryption.encrypt(text, encryptionKey, Encryption.Algorithm.AES_256);
          return expect(Encryption.decrypt(encryptedText, encryptionKey, Encryption.Algorithm.AES_256))
            .toBe(text);
        });
      });
    });
  });
});
