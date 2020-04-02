import { badWords } from '../constants/badWords'

export const capitalizeEachWord = textBlock => {
  return textBlock.split(' ').map(word => `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(' ');
}

export const cleanKnownWords = textBlock => {
  return textBlock.split('\n')
    .map   (line => line.trim())
    .filter(line => line.length !== 0) // Remove whitespace-only lines
    .filter(line => badWords.indexOf(line.toLowerCase()) === -1) // Remove known undesired words/sentences
    .filter(line => !line.match(/^(step *)?\d+:?$/i)) // Remove digits and steps that sit on their own lines
    .map   (line => line.replace(/^(total time|prep time|active time|yield|servings|serves):? ?/i, '')) // Remove direct field names for meta
    .map   (line => line.trim())
    .map   (line => line.match(/^([A-Z] *)+:? *$/) ? `[${capitalizeEachWord(line.toLowerCase()).replace(':', '')}]` : line) // Format capitalized lines "HEADER:" as [Header]
    .join  ('\n');
}

export const format = {
  imageURL:     val => val.trim(),
  title:        val => capitalizeEachWord(val.trim().toLowerCase()),
  description:  val => val.length > 300 ? '' : cleanKnownWords(val),
  source:       val => val.trim(),
  yield:        val => val.length > 30 ? '' : capitalizeEachWord(cleanKnownWords(val).trim().toLowerCase()),
  activeTime:   val => val.length > 30 ? '' : capitalizeEachWord(cleanKnownWords(val).trim().toLowerCase()),
  totalTime:    val => val.length > 30 ? '' : capitalizeEachWord(cleanKnownWords(val).trim().toLowerCase()),
  ingredients:  val => cleanKnownWords(val),
  instructions: val => cleanKnownWords(val),
  notes:        val => cleanKnownWords(val)
}

