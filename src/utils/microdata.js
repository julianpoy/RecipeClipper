import * as self from './microdata';
import { getInnerText } from './innerText';
import { getLongestString } from './text';

export const getLongestTextForQueries = (window, queries) => {
  const vals = queries
    .map((query) => [...window.document.querySelectorAll(query)])
    .flat()
    .map((el) => getInnerText(el));

  return getLongestString(vals);
};

export const getActiveTimeFromMicrodata = (window) => self.getLongestTextForQueries(window, [
  '[itemProp=prepTime]',
]);

export const getTotalTimeFromMicrodata = (window) => self.getLongestTextForQueries(window, [
  '[itemProp=totalTime]',
]);

export const getYieldFromMicrodata = (window) => self.getLongestTextForQueries(window, [
  '[itemProp=recipeYield]',
]);

export const getInstructionsFromMicrodata = (window) => self.getLongestTextForQueries(window, [
  '[itemProp=recipeInstructions]',
  '[itemProp=instructions]',
]);

export const getIngredientsFromMicrodata = (window) => self.getLongestTextForQueries(window, [
  '[itemProp=recipeIngredients]',
  '[itemProp=ingredients]',
]);
