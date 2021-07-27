import { Context } from 'flanc';
import { Item, RawItem } from './types';
import { BadRequest } from 'flanc/errors';
import { compile } from 'flanc/models';
import { model as userModel } from '@<project_name>/resource-user'; 
import { findItemsByUserId, getItemById } from './data';
import { UUID } from 'flanc/router-commons/scalar-types';

export const model = compile<Item>({
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
            type: 'user',
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
        }
    }
})