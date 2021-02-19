import global from '../global';
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

export const clipImageURL = () => format.imageURL(
  getImageSrcFromSchema()
  || getSrcFromImage(grabLargestImage()),
);

export const clipTitle = () => format.title(
  getTitleFromSchema()
  || grabLongestMatchByClasses(...ClassMatchers.title) || grabRecipeTitleFromDocumentTitle(),
);

export const clipDescription = () => format.description(
  getDescriptionFromSchema()
  || grabLongestMatchByClasses(...ClassMatchers.description),
);

export const clipSource = () => format.source(
  grabSourceFromDocumentTitle() || global.window.location.hostname,
);

export const clipYield = () => format.yield(
  getYieldFromSchema()
  || grabLongestMatchByClasses(...ClassMatchers.yield)
  || closestToRegExp(matchYield).replace('\n', ''),
);

export const clipActiveTime = () => format.activeTime(
  grabLongestMatchByClasses(...ClassMatchers.activeTime)
  || closestToRegExp(matchActiveTime).replace('\n', ''),
);

export const clipTotalTime = () => format.totalTime(
  grabLongestMatchByClasses(...ClassMatchers.totalTime)
  || closestToRegExp(matchTotalTime).replace('\n', ''),
);

export const clipIngredients = async () => format.ingredients(
  getIngredientsFromSchema()
  || grabLongestMatchByClasses(...ClassMatchers.ingredients),
)
  || format.ingredients(await grabByMl(1));

export const clipInstructions = async () => format.instructions(
  getInstructionsFromSchema()
  || grabLongestMatchByClasses(...ClassMatchers.instructions),
)
  || format.instructions(await grabByMl(2));

export const clipNotes = () => format.notes(
  grabLongestMatchByClasses(...ClassMatchers.notes),
);
