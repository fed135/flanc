import { DataModel, sanitize } from '../data-model';

describe('[Packages | Core-util | Data-Model] interacting with data model utils', () => {
  describe('given an invalid model with no type configuration', () => {
    const invalidModel = {
      attributes: {
        name: { type: 'string' },
      },
    };

    describe('when sanitizing the model', () => {
      test('then an error is thrown', () => {
        return expect(sanitize.bind(null, invalidModel)).toThrowError('Missing "type" property on model');
      });
    });
  });

  describe('given an invalid model with an invalid attribute type', () => {
    const invalidModel = {
      type: 'bazooka',
      attributes: {
        name: { type: 'goomba' },
      },
    };

    describe('when sanitizing the model', () => {
      test('then an error is thrown', () => {
        return expect(sanitize.bind(null, invalidModel)).toThrowError('Invalid type "goomba" property on attribute "name" for model "bazooka"');
      });
    });
  });

  describe('given valid model with a defined resolver for an attribute', () => {
    const validModel = DataModel({
      type: 'user',
      attributes: {
        multiplier: { type: 'number', resolver: (data) => data.multiplier * 2 },
      },
    });

    describe('when sanitizing the model', () => {
      const sanitizedModel = sanitize(validModel);

      test('then custom resolvers are defined as expected', () => {
        return expect(sanitizedModel.multiplier.resolver({ multiplier: 2 })).toEqual(4);
      });
    });
  });

  describe('given valid model with no defined resolver for an attribute', () => {
    const validModel = DataModel({
      type: 'user',
      attributes: {
        name: { type: 'string' },
      },
    });

    describe('when sanitizing the model', () => {
      const sanitizedModel = sanitize(validModel);

      test('then a default resolver should be created', () => {
        return expect(sanitizedModel.name.resolver({ name: 'test' })).toEqual('test');
      });
    });
  });
});
