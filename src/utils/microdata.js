import * as self from './microdata';
import { getInnerText } from './innerText';
import { getLongestString } from './text';

/**
  * For each query passed, find all matching elements and takes the longest string match
  */
export const getLongestTextForQueries = (window, queries) => {
  const vals = queries
    .map((query) => [...window.document.querySelectorAll(query)])
    .flat()
    .map((el) => getInnerText(el));

  return getLongestString(vals);
};

/**
  * For each query passed, find all matching elements and append them together.
  * Will take the longest match across each query, grouped.
  */
export const getLongestGroupTextForQueries = (window, queries) => {
  const vals = queries
    .map((query) => [...window.document.querySelectorAll(query)])
    .map((els) => els.map((el) => getInnerText(el)).join('\n'));

  return getLongestString(vals);
};

export const getDescriptionFromMicrodata = (window) => self.getLongestTextForQueries(window, [
  '[itemProp=description]',
]);

export const getActiveTimeFromMicrodata = (window) => self.getLongestTextForQueries(window, [
  '[itemProp=prepTime]',
]);

export const getTotalTimeFromMicrodata = (window) => self.getLongestTextForQueries(window, [
  '[itemProp=totalTime]',
]);

export const getYieldFromMicrodata = (window) => self.getLongestTextForQueries(window, [
  '[itemProp=recipeYield]',
]);

export const getInstructionsFromMicrodata = (window) => self.getLongestGroupTextForQueries(window, [
  '[itemProp=recipeInstructions]',
  '[itemProp=instructions]',
]);

export const getIngredientsFromMicrodata = (window) => self.getLongestGroupTextForQueries(window, [
  '[itemProp=recipeIngredients]',
  '[itemProp=ingredients]',
]);
