import { ObjectId } from '@<project_name>/core-util/mongo';

export function generateObjectIdFromChar(hexChar: string): ObjectId {
  return new ObjectId(Array(24).fill(hexChar[0]).join(''));
}
