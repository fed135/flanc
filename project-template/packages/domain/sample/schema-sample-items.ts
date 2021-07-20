import { register } from '@flanc/router-graphql';
import { Context } from 'flanc';

register({}, {
    Query: `
      getSampleItems(name: String): String
    `
}, {
    Query: {
        getSampleItems: {
            middleware: [],
            resolver: (context: Context) => {
              console.log(context);
              return 'Foo';
            }
        },
    },
});
