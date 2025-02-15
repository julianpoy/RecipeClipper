import { format } from './text';
import {
  getSrcFromImage,
  grabLargestImage,
  grabLongestMatchByClasses,
  closestToRegExp,
  grabRecipeTitleFromDocumentTitle,
  grabSourceFromDocumentTitle,
} from './element';
import ClassMatchers from '../constants/classMatchers';
import {
  matchYield,
  matchActiveTime,
  matchTotalTime,
} from '../constants/regex';
import {
  grabByMl,
} from './ml';
import {
  getImageSrcFromSchema,
  getTitleFromSchema,
  getDescriptionFromSchema,
  getYieldFromSchema,
  getIngredientsFromSchema,
  getInstructionsFromSchema,
} from './schema';
import {
  getDescriptionFromMicrodata,
  getYieldFromMicrodata,
  getActiveTimeFromMicrodata,
  getTotalTimeFromMicrodata,
  getIngredientsFromMicrodata,
  getInstructionsFromMicrodata,
} from './microdata';

export const clipImageURL = (config) => format.imageURL(
  getImageSrcFromSchema(config.window)
  || getSrcFromImage(grabLargestImage(config.window)),
);

export const clipTitle = (config) => format.title(
  getTitleFromSchema(config.window)
  || grabLongestMatchByClasses(config.window, ...ClassMatchers.title)
  || grabRecipeTitleFromDocumentTitle(config.window),
);

export const clipDescription = (config) => format.description(
  getDescriptionFromSchema(config.window)
  || getDescriptionFromMicrodata(config.window)
  || grabLongestMatchByClasses(config.window, ...ClassMatchers.description),
);

export const clipSource = (config) => format.source(
  grabSourceFromDocumentTitle(config.window) || config.window.location.hostname,
);

export const clipYield = (config) => format.yield(
  getYieldFromSchema(config.window)
  || getYieldFromMicrodata(config.window)
  || grabLongestMatchByClasses(config.window, ...ClassMatchers.yield)
  || closestToRegExp(config.window, matchYield).replace('\n', ''),
);

export const clipActiveTime = (config) => format.activeTime(
  getActiveTimeFromMicrodata(config.window)
  || grabLongestMatchByClasses(config.window, ...ClassMatchers.activeTime)
  || closestToRegExp(config.window, matchActiveTime).replace('\n', ''),
);

export const clipTotalTime = (config) => format.totalTime(
  getTotalTimeFromMicrodata(config.window)
  || grabLongestMatchByClasses(config.window, ...ClassMatchers.totalTime)
  || closestToRegExp(config.window, matchTotalTime).replace('\n', ''),
);

export const clipIngredients = async (config) => format.ingredients(
  getIngredientsFromSchema(config.window)
  || getIngredientsFromMicrodata(config.window)
  || grabLongestMatchByClasses(config.window, ...ClassMatchers.ingredients),
)
  || format.ingredients(await grabByMl(config, 1));

export const clipInstructions = async (config) => format.instructions(
  getInstructionsFromSchema(config.window)
  || getInstructionsFromMicrodata(config.window)
  || grabLongestMatchByClasses(config.window, ...ClassMatchers.instructions),
)
  || format.instructions(await grabByMl(config, 2));

export const clipNotes = (config) => format.notes(
  grabLongestMatchByClasses(config.window, ...ClassMatchers.notes),
);
