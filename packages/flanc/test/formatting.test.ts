import { latinize } from '../src/formatting';

describe('[Packages | Core-util | Formatting] interacting with latinize', () => {
  describe('given a string with accents and emojis', () => {
    describe('when converting accents (diacritics) from strings to latin characters', () => {
      test('then the resulted string should be without diacritics', () => {
        expect(latinize('☕éeeeà 💩 ùûüÿàâæç😷éèêëïîôœ🍋'))
          .toEqual('eeeea  uuuyaaæceeeeiioœ');
      });
    });
  });
});
