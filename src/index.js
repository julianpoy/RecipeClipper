import * as ClipUtils from './utils/clip';

export const clipRecipe = async () => ({
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
});
