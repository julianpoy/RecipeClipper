import * as ClipUtils from './utils/clip';

export const clipRecipe = () => ({
  imageURL: ClipUtils.clipImageURL(),
  title: ClipUtils.clipTitle(),
  description: ClipUtils.clipDescription(),
  source: ClipUtils.clipSource(),
  yield: ClipUtils.clipYield(),
  activeTime: ClipUtils.clipActiveTime(),
  totalTime: ClipUtils.clipTotalTime(),
  ingredients: ClipUtils.clipIngredients(),
  instructions: ClipUtils.clipInstructions(),
  notes: ClipUtils.clipNotes(),
});
