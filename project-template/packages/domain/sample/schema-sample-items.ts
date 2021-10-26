import { Context } from 'flanc';
import ItemSchema from '@<project_name>/resource-item';
import { register } from '@flanc/router-graphql';

register(ItemSchema, {
  Query: `
      getItems(name: String): Item
    `,
}, {
  Query: {
    getItems: {
      middleware: [],
      resolver: (context: Context) => {
        console.log('request context:', context);
        return 'Foo';
      },
    },
  },
});
