import { getInnerText } from './innerText';

describe('innerText', () => {
  describe('when element has innerText', () => {
    it('returns innerText', () => {
      const innerText = 'inner text';
      const textContent = 'text content';

      expect(getInnerText({
        innerText,
        textContent,
      })).toEqual(innerText);
    });
  });

  describe('when element does not have innerText', () => {
    it('returns textContent', () => {
      const textContent = 'text content';

      expect(getInnerText({
        innerText: undefined,
        textContent,
      })).toEqual(textContent);
    });
  });
});
