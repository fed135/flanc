import { db } from '@<project_name>/db';
import { RawUser } from './types';

export function getUserById(id: string): RawUser {
  return db.query('SELECT * FROM users WHERE id = ? ', [id]);
}
