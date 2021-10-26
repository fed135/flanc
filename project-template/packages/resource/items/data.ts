import { Context } from 'flanc';
import { db } from '@<project_name>/db';
import { NotFound } from 'flanc/errors';
import { RawItem } from './types';

export function findItemsByUserId(userId: string, context: Context): RawItem[] {
  return db.query('SELECT * FROM items WHERE ownerId = ? ', [userId])
    .then((items: RawItem[]) => {
      if (!items || items.length === 0) throw NotFound(`No items found for userId ${userId}`, context);

      return items;
    });
}

export function getItemById(id: string): RawItem {
  return db.query('SELECT * FROM items WHERE id = ? ', [id]);
}
