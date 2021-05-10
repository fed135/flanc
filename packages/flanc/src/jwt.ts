import jwt from 'jsonwebtoken';

export function verifyToken(token: string, key: string): UserToken {
  try {
    const { userId, id, exp, roles } = jwt.verify(token, key);

    if (!userId) throw new Error('Missing userId or legacyId');

    return {
      id: id || null,
      expires: exp,
      token,
      ...(roles && { roles }),
    };
  } catch (e) {
    throw new Error(`Invalid Token: ${e.message}`);
  }
}
