import { createVerifier } from 'fast-jwt';

const decoders = {};

function createDecoder(key) {
  decoders[key] = createVerifier(key);
  return decoders[key];
}

export function verifyToken(token: string, key: string): UserToken {
  const decoder = decoders[key] || createDecoder(key);
  return decoder(token);
}
