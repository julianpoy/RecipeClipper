import * as self from './microdata';
import { getInnerText } from './innerText';
import { getLongestString } from './text';

export const getLongestSingleElementTextForQueries = (window, queries) => {
  const vals = queries
    .map((query) => [...window.document.querySelectorAll(query)])
    .flat()
    .map((el) => getInnerText(el));

  return getLongestString(vals);
};

export const getLongestTextGroupForQueries = (window, queries) => {
  const vals = queries
    .map((query) =>
         [...window.document.querySelectorAll(query)]
           .map((el) => getInnerText(el))
           .join('\n');
    );

  return getLongestString(vals);
};

export const getActiveTimeFromMicrodata = (window) => self.getLongestSingleElementTextForQueries(window, [
  '[itemProp=prepTime]',
]);

export const getTotalTimeFromMicrodata = (window) => self.getLongestSingleElementTextForQueries(window, [
  '[itemProp=totalTime]',
]);

export const getYieldFromMicrodata = (window) => self.getLongestSingleElementTextForQueries(window, [
  '[itemProp=recipeYield]',
]);

export const getInstructionsFromMicrodata = (window) => self.getLongestTextGroupForQueries(window, [
  '[itemProp=recipeInstructions]',
  '[itemProp=recipeInstruction]',
  '[itemProp=instructions]',
  '[itemProp=instruction]',
]);

export const getIngredientsFromMicrodata = (window) => self.getLongestTextGroupForQueries(window, [
  '[itemProp=recipeIngredients]',
  '[itemProp=recipeIngredient]',
  '[itemProp=ingredients]',
  '[itemProp=ingredient]',
]);
