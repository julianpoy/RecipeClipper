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
  grabByMl
} from './ml';

export const clipImageURL = () => format.imageURL(
  getSrcFromImage(grabLargestImage()),
);

export const clipTitle = () => format.title(
  grabLongestMatchByClasses(...ClassMatchers.title) || grabRecipeTitleFromDocumentTitle(),
);

export const clipDescription = () => format.description(
  grabLongestMatchByClasses(...ClassMatchers.description),
);

export const clipSource = () => format.source(
  grabSourceFromDocumentTitle() || window.location.hostname,
);

export const clipYield = () => format.yield(
  grabLongestMatchByClasses(...ClassMatchers.yield)
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
  grabLongestMatchByClasses(...ClassMatchers.ingredients)
  || await grabByMl(1),
);

export const clipInstructions = async () => format.instructions(
  grabLongestMatchByClasses(...ClassMatchers.instructions)
  || await grabByMl(2),
);

export const clipNotes = () => format.notes(
  grabLongestMatchByClasses(...ClassMatchers.notes),
);
