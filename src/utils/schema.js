import * as self from './schema';
import { getInnerText } from './innerText';

const longestStringIn = (strArray) => strArray.reduce((max, match) => (match.length > max.length ? match : max), '');

export const getRecipeSchemasFromDocument = (window) => {
  const schemas = [...window.document.querySelectorAll('script[type="application/ld+json"]')]
    .map((schema) => {
      try {
        return JSON.parse(getInnerText(schema));
      } catch (e) {
        // Do nothing
      }

      return null;
    })
    .filter((e) => e);

  const recipeSchemas = schemas.map((schema) => {
    // Schemas that evaluate to a graph
    if (schema['@graph']) {
      return schema['@graph'].find((subSchema) => subSchema['@type'] === 'Recipe');
    }

    // Schemas that are directly embedded
    if (schema['@type'] === 'Recipe') return schema;

    // Schemas that evaluate to an array
    if (schema.length && schema[0]) {
      return schema.find((subSchema) => subSchema['@type'] === 'Recipe');
    }

    return null;
  }).filter((e) => e);

  return recipeSchemas;
};

export const getPropertyFromSchema = (window, propName) => {
  if (!window.parsedSchemas) window.parsedSchemas = self.getRecipeSchemasFromDocument(window);

  const foundSchema = window.parsedSchemas.find((schema) => schema[propName]) || {};

  return foundSchema[propName] || null;
};

export const getImageSrcFromSchema = (window) => {
  const images = self.getPropertyFromSchema(window, 'image');
  if (!images) return '';

  let imageSrc;
  if (typeof images === 'string') imageSrc = images;
  else if (typeof images[0] === 'string') [imageSrc] = images;

  if (imageSrc) {
    try {
      const url = new URL(imageSrc);

      if (url.protocol === 'http:' || url.protocol === 'https:') return imageSrc;
    } catch (_) {
      // Do nothing
    }
  }

  return '';
};

export const getTitleFromSchema = (window) => {
  const title = self.getPropertyFromSchema(window, 'name');

  if (typeof title === 'string') return title;

  return '';
};

export const getDescriptionFromSchema = (window) => {
  const description = self.getPropertyFromSchema(window, 'description');

  if (typeof description === 'string') return description;

  return '';
};

export const getYieldFromSchema = (window) => {
  const recipeYield = self.getPropertyFromSchema(window, 'recipeYield');
  if (!recipeYield) return '';

  if (typeof recipeYield === 'string') return recipeYield;
  if (typeof recipeYield[0] === 'string') return longestStringIn(recipeYield);

  return '';
};

export const getInstructionsFromSchema = (window) => {
  const instructions = self.getPropertyFromSchema(window, 'recipeInstructions');
  if (!instructions) return '';

  if (typeof instructions === 'string') return instructions;
  if (typeof instructions[0] === 'string') return instructions.join('\n');
  if (instructions[0] && typeof instructions[0].text === 'string') {
    return instructions.map((instruction) => instruction.text).join('\n');
  }

  return '';
};

export const getIngredientsFromSchema = (window) => {
  const ingredients = self.getPropertyFromSchema(window, 'recipeIngredient');
  if (!ingredients) return '';

  if (typeof ingredients === 'string') return ingredients;
  if (typeof ingredients[0] === 'string') return ingredients.join('\n');
  if (ingredients[0] && typeof ingredients[0].text === 'string') {
    return ingredients.map((ingredient) => ingredient.text).join('\n');
  }

  return '';
};
