import { generateConfig } from './utils/config';
import * as ClipUtils from './utils/clip';

export const clipRecipe = async (options) => {
  const config = generateConfig(options);

  return {
    imageURL: ClipUtils.clipImageURL(config),
    title: ClipUtils.clipTitle(config),
    description: ClipUtils.clipDescription(config),
    source: ClipUtils.clipSource(config),
    yield: ClipUtils.clipYield(config),
    activeTime: ClipUtils.clipActiveTime(config),
    totalTime: ClipUtils.clipTotalTime(config),
    ingredients: await ClipUtils.clipIngredients(config),
    instructions: await ClipUtils.clipInstructions(config),
    notes: ClipUtils.clipNotes(config),
  };
};
