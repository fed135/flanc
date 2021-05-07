import { getYearsSince } from '../dates';

describe('[Packages | Dates] interacting with dates utils', () => {
  describe('getYearsSince', () => {
    describe('given a date far in the past', () => {
      test('then it should return that it is greater than 18', () => {
        expect(getYearsSince(new Date('01-01-1990'))).toBeGreaterThan(18);
      });
    });
  });
  describe('given the current date', () => {
    test('then it should return that it is lower than 18', () => {
      expect(getYearsSince(new Date())).toBeLessThan(18);
    });
  });
});
