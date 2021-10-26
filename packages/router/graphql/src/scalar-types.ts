import { GraphQLScalarType } from 'graphql';
import isUUID from 'uuid-validate';
import { Kind } from 'graphql/language';


// UUID: https://github.com/olistic/graphql-type-uuid
export const UUID = new GraphQLScalarType({
  name: 'UUID',
  description:
    'The `UUID` scalar type represents UUID values as specified by [RFC 4122](https://tools.ietf.org/html/rfc4122).',
  serialize: (value) => {
    if (!isUUID(value)) {
      throw new TypeError(`UUID cannot represent non-UUID value: ${value}`);
    }

    return value.toLowerCase();
  },
  parseValue: (value) => {
    if (!isUUID(value)) {
      throw new TypeError(`UUID cannot represent non-UUID value: ${value}`);
    }

    return value.toLowerCase();
  },
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      if (isUUID(ast.value)) {
        return ast.value;
      }
    }

    return undefined;
  },
});
