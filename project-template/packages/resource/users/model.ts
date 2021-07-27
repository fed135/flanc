import { Context } from 'flanc';
import { User, RawUser } from './types';
import { BadRequest } from 'flanc/errors';
import { compile } from 'flanc/models';
import { UUID } from 'flanc/router-commons/scalar-types';

import { model as itemModel } from '@<project_name>/resource-item'; 
import { getUserById } from './data';

export const model = compile<User>({
    type: 'user',
    attributes: {
        name: { type: 'string', resolver: (entity: RawUser) => `${entity.first_name} ${entity.last_name}` },
        id: { type: 'string', scalarType: UUID },
    },
    relationships: {
        items: {
            type: 'item',
            resolver: (src: RawUser, { context, params }) => {
                return itemModel.members.getItemsByUser(context, { id: src, ...params });
            },
        },
    },
    members: {
        getUserById: (context: Context, params: { id }): RawUser => {
            if (!params?.id) throw BadRequest('Id is missing', context);

            return getUserById(params.id);
        }
    }
})