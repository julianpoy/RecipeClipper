import { badWords } from '../constants/badWords';

export const capitalizeEachWord = (textBlock) => textBlock.split(' ').map((word) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(' ');

// Undesired words
export const isBadWord = (line) => badWords.includes(line.toLowerCase());

// Digits and steps that sit on their own lines
export const isStep = (line) => line.match(/^(step *)?\d+:?$/i);

export const removeFieldTitles = (line) => line.replace(/^(total time|prep time|active time|yield|servings|serves):? ?/i, '').trim();

// Format capitalized lines "HEADER:" as [Header]
export const formatHeaders = (line) => (line.match(/^([A-Z] *)+:? *$/)
  ? `[${capitalizeEachWord(line.toLowerCase()).replace(':', '')}]` : line);

export const cleanKnownWords = (textBlock) => textBlock.split('\n')
  .map((line) => line.trim())
  .filter((line) => line.length)
  .filter((line) => !isBadWord(line))
  .filter((line) => !isStep(line))
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
