import { Days, getNextSpecifiedDayUtc, getYearsSince } from '../dates';

const midnight = { hour: 0, minute: 0, second: 0, millisecond: 0 };

function formatDate(str: string): string {
  return new Date(str).toISOString().split('.')[0] + 'Z';
}

describe('[Packages | Core-util | Dates] interacting with dates utils', () => {
  describe('getNextSpecifiedDayUtc', () => {
    describe('given monday of a week, at midnight', () => {
      describe('when getting the next wednesday', () => {
        test('then it should return wednesday midnight of the same week', () => {
          jest.spyOn(Date, 'now').mockImplementation(() => new Date('2020-03-16T00:00:00').getTime());
          expect(getNextSpecifiedDayUtc(Days.WEDNESDAY).format()).toBe(formatDate('2020-03-18T00:00:00'));
        });
      });
    });

    describe('given friday of a week, before or equal 9:00AM', () => {
      describe('when getting the next friday transfer date', () => {
        test('then it should return friday of the next week', () => {
          jest.spyOn(Date, 'now').mockImplementation(() => new Date('2020-03-20T08:55:00').getTime());
          expect(getNextSpecifiedDayUtc(Days.FRIDAY, { ...midnight, hour: 9 }).format()).toBe(formatDate('2020-03-20T09:00:00'));
          jest.spyOn(Date, 'now').mockImplementation(() => new Date('2020-03-27T09:00:00').getTime());
          expect(getNextSpecifiedDayUtc(Days.FRIDAY, { ...midnight, hour: 9 }).format()).toBe(formatDate('2020-03-27T09:00:00'));
        });
      });
    });

    describe('given friday of a week, passed 9:00AM', () => {
      describe('when getting the next friday transfer date', () => {
        test('then it should return friday of the next week', () => {
          jest.spyOn(Date, 'now').mockImplementation(() => new Date('2020-03-20T09:01:00').getTime());
          expect(getNextSpecifiedDayUtc(Days.FRIDAY, { ...midnight, hour: 9 }).format()).toBe(formatDate('2020-03-27T09:00:00'));
        });
      });
    });

    describe('given friday of a week, before or equal 4:00PM', () => {
      describe('when getting the next friday debt transfer date', () => {
        test('then it should return the same day', () => {
          jest.spyOn(Date, 'now').mockImplementation(() => new Date('2020-03-20T15:30:00').getTime());
          expect(getNextSpecifiedDayUtc(Days.FRIDAY, { ...midnight, hour: 16 }).format()).toBe(formatDate('2020-03-20T16:00:00'));
          jest.spyOn(Date, 'now').mockImplementation(() => new Date('2020-03-20T16:00:00').getTime());
          expect(getNextSpecifiedDayUtc(Days.FRIDAY, { ...midnight, hour: 16 }).format()).toBe(formatDate('2020-03-20T16:00:00'));
        });
      });
    });

    describe('given friday of a week, passed 4:00PM', () => {
      describe('when getting the next friday debt transfer date', () => {
        test('then it should return friday of the next week', () => {
          jest.spyOn(Date, 'now').mockImplementation(() => new Date('2020-03-20T16:01:00').getTime());
          expect(getNextSpecifiedDayUtc(Days.FRIDAY, { ...midnight, hour: 16 }).format()).toBe(formatDate('2020-03-27T16:00:00'));
        });
      });
    });
  });

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
