import {
  capitalizeEachWord,
  removeSpecialCharacters,
  cleanKnownWords,
  format,
} from './text';

import { badWords } from '../constants/badWords';

describe('capitalizeEachWord', () => {
  it('capitalizes single word', () => {
    expect(capitalizeEachWord('test')).toEqual('Test');
  });

  it('capitalizes multiple words', () => {
    expect(capitalizeEachWord('test test')).toEqual('Test Test');
  });

  it('capitalized word stays the same', () => {
    expect(capitalizeEachWord('Test')).toEqual('Test');
  });
});

describe('removeSpecialCharacters', () => {
  it('removes special characters', () => {
    // Note: not comprehensive
    expect(removeSpecialCharacters('./"\'+_-[](),')).toEqual('');
  });

  it('leaves normal characters alone', () => {
    expect(removeSpecialCharacters('normal characters 9')).toEqual('normal characters 9');
  });
});

describe('cleanKnownWords', () => {
  it('removes excess spacing around lines', () => {
    expect(cleanKnownWords(' test ')).toEqual('test');
  });

  it('removes whitespace-only lines', () => {
    expect(cleanKnownWords('\n')).toEqual('');
  });

  it('removes all badwords', () => {
    badWords.forEach((badWord) => expect(cleanKnownWords(badWord)).toEqual(''));
  });

  it('removes special characters on their own line', () => {
    expect(cleanKnownWords('_ +')).toEqual('');
  });

  it('removes scale multipliers on their own line', () => {
    expect(cleanKnownWords('1x')).toEqual('');
    expect(cleanKnownWords('1 x')).toEqual('');
    expect(cleanKnownWords('[1x]')).toEqual('');
  });

  it('removes step titles', () => {
    expect(cleanKnownWords('Step 3:')).toEqual('');
    expect(cleanKnownWords('Step 3')).toEqual('');
    expect(cleanKnownWords('step 3')).toEqual('');
    expect(cleanKnownWords('- Step 3:')).toEqual('');
    expect(cleanKnownWords('3')).toEqual('');
    expect(cleanKnownWords('3:')).toEqual('');
  });

  it('removes field titles', () => {
    expect(cleanKnownWords('total time: 5')).toEqual('5');
    expect(cleanKnownWords('prep time: 5')).toEqual('5');
    expect(cleanKnownWords('active time: 5')).toEqual('5');
    expect(cleanKnownWords('yield: 5')).toEqual('5');
    expect(cleanKnownWords('servings: 5')).toEqual('5');
    expect(cleanKnownWords('serves: 5')).toEqual('5');
  });

  it('formats capitalized lines as headers', () => {
    expect(cleanKnownWords('HEADER')).toEqual('[Header]');
    expect(cleanKnownWords('MULTIWORD HEADER:')).toEqual('[Multiword Header]');
  });

  it('formats "for the ..." lines as headers', () => {
    expect(cleanKnownWords('for the broth')).toEqual('[For The Broth]');
    expect(cleanKnownWords('FOR THE chicken soup:')).toEqual('[For The Chicken Soup]');
  });

  it('maintains linebreaks', () => {
    const input = '1 cup sugar\n2 tbsp coconut oil';

    expect(cleanKnownWords(input)).toEqual(input);
  });
});

describe('format', () => {
  describe('imageURL', () => {
    it('trims excess spacing', () => {
      const url = 'https://test.com';

      expect(format.imageURL(`  ${url}  `)).toEqual(url);
    });

    it('handles empty input', () => {
      expect(format.imageURL('')).toEqual('');
    });
  });

  describe('title', () => {
    it('capitalizes each word', () => {
      expect(format.title('example title')).toEqual('Example Title');
    });

    it('trims excess spacing', () => {
      expect(format.title('  title  ')).toEqual('Title');
    });

    it('removes unnatural capitalization', () => {
      expect(format.title('mY tItlE')).toEqual('My Title');
    });

    it('handles empty input', () => {
      expect(format.title('')).toEqual('');
    });
  });

  describe('description', () => {
    it('cleans known words', () => {
      expect(format.description('ingredients')).toEqual('');
    });

    it('discards input longer than 300 characters in length', () => {
      expect(format.description('a'.repeat(301))).toEqual('');
    });

    it('preserves valid input', () => {
      expect(format.description('example input')).toEqual('example input');
    });

    it('handles empty input', () => {
      expect(format.description('')).toEqual('');
    });
  });

  describe('source', () => {
    it('trims excess spacing', () => {
      expect(format.source('  example  ')).toEqual('example');
    });

    it('preserves valid input', () => {
      expect(format.source('example input')).toEqual('example input');
    });

    it('handles empty input', () => {
      expect(format.source('')).toEqual('');
    });
  });

  describe('yield', () => {
    it('capitalizes each word', () => {
      expect(format.yield('example input')).toEqual('Example Input');
    });

    it('trims excess spacing', () => {
      expect(format.yield('  input  ')).toEqual('Input');
    });

    it('removes unnatural capitalization', () => {
      expect(format.yield('mY iNpUt')).toEqual('My Input');
    });

    it('discards input longer than 30 characters in length', () => {
      expect(format.yield('a'.repeat(31))).toEqual('');
    });

    it('handles empty input', () => {
      expect(format.yield('')).toEqual('');
    });
  });

  describe('activeTime', () => {
    it('capitalizes each word', () => {
      expect(format.activeTime('example input')).toEqual('Example Input');
    });

    it('trims excess spacing', () => {
      expect(format.activeTime('  input  ')).toEqual('Input');
    });

    it('removes unnatural capitalization', () => {
      expect(format.activeTime('mY iNpUt')).toEqual('My Input');
    });

    it('discards input longer than 30 characters in length', () => {
      expect(format.activeTime('a'.repeat(31))).toEqual('');
    });

    it('handles empty input', () => {
      expect(format.activeTime('')).toEqual('');
    });
  });

  describe('totalTime', () => {
    it('capitalizes each word', () => {
      expect(format.totalTime('example input')).toEqual('Example Input');
    });

    it('trims excess spacing', () => {
      expect(format.totalTime('  input  ')).toEqual('Input');
    });

    it('removes unnatural capitalization', () => {
      expect(format.totalTime('mY iNpUt')).toEqual('My Input');
    });

    it('discards input longer than 30 characters in length', () => {
      expect(format.totalTime('a'.repeat(31))).toEqual('');
    });

    it('handles empty input', () => {
      expect(format.totalTime('')).toEqual('');
    });
  });

  describe('ingredients', () => {
    it('cleans known words', () => {
      expect(format.ingredients('ingredients')).toEqual('');
    });

    it('preserves valid input', () => {
      expect(format.ingredients('example input')).toEqual('example input');
    });

    it('handles empty input', () => {
      expect(format.ingredients('')).toEqual('');
    });
  });

  describe('instructions', () => {
    it('cleans known words', () => {
      expect(format.instructions('ingredients')).toEqual('');
    });

    it('preserves valid input', () => {
      expect(format.instructions('example input')).toEqual('example input');
    });

    it('handles empty input', () => {
      expect(format.instructions('')).toEqual('');
    });
  });

  describe('notes', () => {
    it('cleans known words', () => {
      expect(format.notes('ingredients')).toEqual('');
    });

    it('preserves valid input', () => {
      expect(format.notes('example input')).toEqual('example input');
    });

    it('handles empty input', () => {
      expect(format.notes('')).toEqual('');
    });
  });
});
