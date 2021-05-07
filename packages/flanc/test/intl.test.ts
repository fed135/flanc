import { finances } from '../src/intl';

describe('[Packages | Core-util | Intl] interacting with int utils', () => {
  describe('using finances functions', () => {
    describe('given an initial amount in cents', () => {
      describe('and input number has too many decimals', () => {
        describe('when formatting to amount in dollars', () => {
          test('then expected value is returned', () => {
            expect(finances.toAmountInDollars(9.5544)).toBe(0.1);
            expect(finances.toAmountInDollars(9.5544, 'JPY')).toBe(9.55);
            expect(finances.toAmountInDollars(19.5544)).toBe(0.2);
            expect(finances.toAmountInDollars(19.5544, 'JPY')).toBe(19.55);

            expect(finances.toAmountInDollars(9.5555)).toBe(0.1);
            expect(finances.toAmountInDollars(9.5555, 'JPY')).toBe(9.56);
            expect(finances.toAmountInDollars(19.5555)).toBe(0.2);
            expect(finances.toAmountInDollars(19.5555, 'JPY')).toBe(19.56);

            expect(finances.toAmountInDollars('9.5544')).toBe(0.1);
            expect(finances.toAmountInDollars('9.5544', 'JPY')).toBe(9.55);
            expect(finances.toAmountInDollars('19.5544')).toBe(0.2);
            expect(finances.toAmountInDollars('19.5544', 'JPY')).toBe(19.55);

            expect(finances.toAmountInDollars('9.5555')).toBe(0.1);
            expect(finances.toAmountInDollars('9.5555', 'JPY')).toBe(9.56);
            expect(finances.toAmountInDollars('19.5555')).toBe(0.2);
            expect(finances.toAmountInDollars('19.5555', 'JPY')).toBe(19.56);
          });
        });
      });

      describe('and input number has an expected amount of decimals', () => {
        describe('when formatting to amount in dollars', () => {
          test('then expected value is returned', () => {
            expect(finances.toAmountInDollars(1)).toBe(0.01);
            expect(finances.toAmountInDollars(1, 'CAD')).toBe(0.01);
            expect(finances.toAmountInDollars(1, 'EUR')).toBe(0.01);
            expect(finances.toAmountInDollars(1, 'USD')).toBe(0.01);
            expect(finances.toAmountInDollars(1, 'JPY')).toBe(1);

            expect(finances.toAmountInDollars('1')).toBe(0.01);
            expect(finances.toAmountInDollars('1', 'CAD')).toBe(0.01);
            expect(finances.toAmountInDollars('1', 'EUR')).toBe(0.01);
            expect(finances.toAmountInDollars('1', 'USD')).toBe(0.01);
            expect(finances.toAmountInDollars('1', 'JPY')).toBe(1);

            expect(finances.toAmountInDollars(9.99)).toBe(0.10);
            expect(finances.toAmountInDollars(9.45)).toBe(0.09);
            expect(finances.toAmountInDollars(9.99, 'CAD')).toBe(0.10);
            expect(finances.toAmountInDollars(9.99, 'EUR')).toBe(0.10);
            expect(finances.toAmountInDollars(9.99, 'USD')).toBe(0.10);
            expect(finances.toAmountInDollars(9.99, 'JPY')).toBe(9.99);

            expect(finances.toAmountInDollars('9.99')).toBe(0.10);
            expect(finances.toAmountInDollars('9.45')).toBe(0.09);
            expect(finances.toAmountInDollars('9.99', 'CAD')).toBe(0.10);
            expect(finances.toAmountInDollars('9.99', 'EUR')).toBe(0.10);
            expect(finances.toAmountInDollars('9.99', 'USD')).toBe(0.10);
            expect(finances.toAmountInDollars('9.99', 'JPY')).toBe(9.99);
          });
        });
      });
    });

    describe('given an initial amount in dollars', () => {
      describe('and input number has too many decimals', () => {
        describe('when formatting to amount in cents with too many decimals', () => {
          test('then expected value is returned', () => {
            expect(finances.toAmountInCents(9.5544)).toBe(955);
            expect(finances.toAmountInCents(9.5544, 'JPY')).toBe(9.55);

            expect(finances.toAmountInCents(9.5555)).toBe(956);
            expect(finances.toAmountInCents(9.5555, 'JPY')).toBe(9.56);

            expect(finances.toAmountInCents('9.5544')).toBe(955);
            expect(finances.toAmountInCents('9.5544', 'JPY')).toBe(9.55);

            expect(finances.toAmountInCents('9.5555')).toBe(956);
            expect(finances.toAmountInCents('9.5555', 'JPY')).toBe(9.56);
          });
        });
      });

      describe('and input number has an expected amount of decimals', () => {
        describe('when formatting to amount in cents', () => {
          test('then expected value is returned', () => {
            expect(finances.toAmountInCents(1)).toBe(100);
            expect(finances.toAmountInCents(1, 'CAD')).toBe(100);
            expect(finances.toAmountInCents(1, 'EUR')).toBe(100);
            expect(finances.toAmountInCents(1, 'USD')).toBe(100);
            expect(finances.toAmountInCents(1, 'JPY')).toBe(1);

            expect(finances.toAmountInCents('1')).toBe(100);
            expect(finances.toAmountInCents('1', 'CAD')).toBe(100);
            expect(finances.toAmountInCents('1', 'EUR')).toBe(100);
            expect(finances.toAmountInCents('1', 'USD')).toBe(100);
            expect(finances.toAmountInCents('1', 'JPY')).toBe(1);

            expect(finances.toAmountInCents(9.99)).toBe(999);
            expect(finances.toAmountInCents(9.99, 'CAD')).toBe(999);
            expect(finances.toAmountInCents(9.99, 'EUR')).toBe(999);
            expect(finances.toAmountInCents(9.99, 'USD')).toBe(999);
            expect(finances.toAmountInCents(9.99, 'JPY')).toBe(9.99);

            expect(finances.toAmountInCents('9.99')).toBe(999);
            expect(finances.toAmountInCents('9.99', 'CAD')).toBe(999);
            expect(finances.toAmountInCents('9.99', 'EUR')).toBe(999);
            expect(finances.toAmountInCents('9.99', 'USD')).toBe(999);
            expect(finances.toAmountInCents('9.99', 'JPY')).toBe(9.99);
          });
        });
      });
    });
  });
});
