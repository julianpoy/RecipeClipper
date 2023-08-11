import * as self from './schema';
import { getInnerText } from './innerText';
import { getLongestString } from './text';

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
  else if (typeof images.url === 'string') imageSrc = images.url;
  else if (typeof images[0] === 'string') [imageSrc] = images;
  else if (images[0] && typeof images[0].url === 'string') imageSrc = images[0].url;

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
  if (typeof recipeYield[0] === 'string') return getLongestString(recipeYield);

  return '';
};

/**
 * Useful for breaking down:
 * Recipe.recipeIngredient (https://schema.org/recipeIngredient)
 * Recipe.recipeInstructions (https://schema.org/recipeInstructions)
 * Which can both often be provided as a string, array, or list of more objects within.
 */
export const getTextFromSchema = (schema) => {
  if (typeof schema === 'string') return schema;
  if (Array.isArray(schema)) {
    return schema.map((item) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object') {
        if (item.text) return item.text;
        if (item.itemListElement) return getTextFromSchema(item.itemListElement);
      }

      return undefined;
    }).filter((el) => el !== null && el !== undefined).join('\n');
  }

  return '';
};

export const getInstructionsFromSchema = (window) => {
  const instructions = self.getPropertyFromSchema(window, 'recipeInstructions');
  if (!instructions) return '';

  return self.getTextFromSchema(instructions);
};

export const getIngredientsFromSchema = (window) => {
  const ingredients = self.getPropertyFromSchema(window, 'recipeIngredient');
  if (!ingredients) return '';

  return self.getTextFromSchema(ingredients);
};
