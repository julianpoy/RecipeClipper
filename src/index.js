import global from './global';
import * as ClipUtils from './utils/clip';

export const clipRecipe = async (options) => {
  global.options = {
    ...global.options,
    ...(options || {}),
  };
  global.window = global.options.window;

  return {
    imageURL: ClipUtils.clipImageURL(),
    title: ClipUtils.clipTitle(),
    description: ClipUtils.clipDescription(),
    source: ClipUtils.clipSource(),
    yield: ClipUtils.clipYield(),
    activeTime: ClipUtils.clipActiveTime(),
    totalTime: ClipUtils.clipTotalTime(),
    ingredients: await ClipUtils.clipIngredients(),
    instructions: await ClipUtils.clipInstructions(),
    notes: ClipUtils.clipNotes(),
  };
};
