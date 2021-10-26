import { BadRequest } from 'flanc/errors';
import { compile } from 'flanc/models';
import { Context } from 'flanc';
import userModel from '@<project_name>/resource-user';
import { UUID } from '@flanc/router-graphql/scalar-types';
import { findItemsByUserId, getItemById } from './data';
import { Item, RawItem } from './types';

export default compile<Item>({
  type: 'item',
  attributes: {
    name: { type: 'string' },
    id: { type: 'string', scalarType: UUID },
    categories: { type: 'array', items: { type: 'string' } },
    amount: { type: 'integer' },
    ownerId: { type: 'string', scalarType: UUID },
  },
  relationships: {
    owner: {
      type: 'object',
      graphqlEntity: 'User',
      model: userModel,
      resolver: (src: RawItem, { context, params }) => {
        return userModel.members.getUserById(context, { id: src.ownerId, ...params });
      },
    },
  },
  members: {
    getItemsByUser: (context: Context, params: { user }): RawItem[] => {
      if (!params?.user?.id) throw BadRequest('User data missing', context);

      return findItemsByUserId(params.user.id, context);
    },
    getItemById: (context: Context, params: { id }): RawItem => {
      if (!params?.id) throw BadRequest('Id is missing', context);

      return getItemById(params.id);
    },
  },
});
