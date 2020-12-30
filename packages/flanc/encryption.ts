import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

enum Algorithm {
  AES_256 = 'aes-256-cbc',
}

enum IvLength {
  'aes-256-cbc' = 16,
}

function guardAgainstUnsupportedAlgorithm(value) {
  const exists = Object.values(Algorithm).filter((name) => name === value);
  if (exists.length === 0) throw new Error(`Encryption algorithm '${value}' is not supported.`);
}

function guardAgainstInvalidEncryptionKey(value) {
  if (!value || value.length !== 32) throw new Error('Encryption key must be 32 characters.');
}

function encrypt(text: string, encryptionKey: string, algorithm: Algorithm) {
  guardAgainstUnsupportedAlgorithm(algorithm);
  guardAgainstInvalidEncryptionKey(encryptionKey);

  const iv = randomBytes(IvLength[algorithm]);
  const cipher = createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encrypted: string, encryptionKey: string, algorithm: Algorithm) {
  guardAgainstUnsupportedAlgorithm(algorithm);
  guardAgainstInvalidEncryptionKey(encryptionKey);

  const textParts = encrypted.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv(algorithm, Buffer.from(encryptionKey), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export const Encryption = {
  Algorithm,
  decrypt,
  encrypt,
};
