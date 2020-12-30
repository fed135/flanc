import jwt from 'jsonwebtoken';

export function verifyToken(token: string, key: string): UserToken {
  try {
    const { legacyId, userId, id, name, exp, roles } = jwt.verify(token, key);

    if (!legacyId && !userId) throw new Error('Missing userId or legacyId');

    return {
      legacyId: legacyId || userId,
      id: id || null,
      name: name || null,
      expires: exp,
      token,
      ...(roles && { roles }),
    };
  } catch (e) {
    throw new Error(`Invalid Token: ${e.message}`);
  }
}
