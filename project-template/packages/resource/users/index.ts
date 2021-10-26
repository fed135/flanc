import { BadRequest } from 'flanc/errors';
import { compile } from 'flanc/models';
import { Context } from 'flanc';
import { getUserById } from './data';
import itemModel from '@<project_name>/resource-item';
import { UUID } from '@flanc/router-graphql/scalar-types';
import { RawUser, User } from './types';

export default compile<User>({
  type: 'user',
  attributes: {
    name: { type: 'string', resolver: (entity: RawUser) => `${entity.first_name} ${entity.last_name}` },
    id: { type: 'string', scalarType: UUID },
  },
  relationships: {
    items: {
      type: 'array',
      items: { type: 'object', graphqlEntity: 'Item' },
      model: itemModel,
      resolver: (src: RawUser, { context, params }) => {
        return itemModel.members.getItemsByUser(context, { id: src, ...params });
      },
    },
  },
  members: {
    getUserById: (context: Context, params: { id }): RawUser => {
      if (!params?.id) throw BadRequest('Id is missing', context);

      return getUserById(params.id);
    },
  },
});
