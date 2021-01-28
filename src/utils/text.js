import { badWords } from '../constants/badWords';
import {
  matchStep, matchFieldTitles, matchScale, matchSpecialChracters,
} from '../constants/regex';

export const capitalizeEachWord = (textBlock) => textBlock.split(' ').map((word) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(' ');

export const removeSpecialCharacters = (line) => line.replace(matchSpecialChracters, '').trim();

// Undesired words
export const isBadWord = (line) => badWords.includes(removeSpecialCharacters(line).toLowerCase());

// Digits and steps that sit on their own lines
export const isStep = (line) => removeSpecialCharacters(line).match(matchStep);

// Scale buttons/interface that was picked up accidentally (4x)
export const isScale = (line) => removeSpecialCharacters(line).match(matchScale);

export const removeFieldTitles = (line) => line.replace(matchFieldTitles, '').trim();

// Format capitalized lines "HEADER:" as [Header] or "for the xyz" as [For The Xyz]
export const formatHeaders = (line) => (
  line.trim().match(/^([A-Z] *)+:?$/) || line.trim().match(/^for the ([a-z] *)+:?$/i)
    ? `[${capitalizeEachWord(line.trim().toLowerCase()).replace(':', '')}]` : line
);

export const cleanKnownWords = (textBlock) => textBlock.split('\n')
  .map((line) => line.trim())
  .filter((line) => removeSpecialCharacters(line).length)
  .filter((line) => !isBadWord(line))
  .filter((line) => !isStep(line))
  .filter((line) => !isScale(line))
  .map((line) => removeFieldTitles(line))
  .map((line) => formatHeaders(line))
  .join('\n');

export const format = {
  imageURL: (val) => val.trim(),
  title: (val) => capitalizeEachWord(val.trim().toLowerCase()),
  description: (val) => (val.length > 300 ? '' : cleanKnownWords(val)),
  source: (val) => val.trim(),
  yield: (val) => (val.length > 30 ? '' : capitalizeEachWord(cleanKnownWords(val).trim().toLowerCase())),
  activeTime: (val) => (val.length > 30 ? '' : capitalizeEachWord(cleanKnownWords(val).trim().toLowerCase())),
  totalTime: (val) => (val.length > 30 ? '' : capitalizeEachWord(cleanKnownWords(val).trim().toLowerCase())),
  ingredients: (val) => cleanKnownWords(val),
  instructions: (val) => cleanKnownWords(val),
  notes: (val) => cleanKnownWords(val),
};
