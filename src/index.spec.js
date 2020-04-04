import { clipRecipe } from './index';
import * as ClipUtils from './utils/clip';

describe('clip', () => {
  let clipImageURLSpy, clipTitleSpy, clipDescriptionSpy, clipSourceSpy, clipYieldSpy;
  let clipTotalTimeSpy, clipIngredientsSpy, clipInstructionsSpy, clipNotesSpy, clipActiveTimeSpy;
  let outputVal;

  beforeAll(() => {
    clipImageURLSpy = jest.spyOn(ClipUtils, 'clipImageURL').mockReturnValue('imageURL');
    clipTitleSpy = jest.spyOn(ClipUtils, 'clipTitle').mockReturnValue('title');
    clipDescriptionSpy = jest.spyOn(ClipUtils, 'clipDescription').mockReturnValue('description');
    clipSourceSpy = jest.spyOn(ClipUtils, 'clipSource').mockReturnValue('source');
    clipYieldSpy = jest.spyOn(ClipUtils, 'clipYield').mockReturnValue('yield');
    clipActiveTimeSpy = jest.spyOn(ClipUtils, 'clipActiveTime').mockReturnValue('activeTime');
    clipTotalTimeSpy = jest.spyOn(ClipUtils, 'clipTotalTime').mockReturnValue('totalTime');
    clipIngredientsSpy = jest.spyOn(ClipUtils, 'clipIngredients').mockReturnValue('ingredients');
    clipInstructionsSpy = jest.spyOn(ClipUtils, 'clipInstructions').mockReturnValue('instructions');
    clipNotesSpy = jest.spyOn(ClipUtils, 'clipNotes').mockReturnValue('notes');

    outputVal = clipRecipe();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('calls clippers for subfields', () => {
    expect(clipImageURLSpy).toBeCalled();
    expect(clipTitleSpy).toBeCalled();
    expect(clipDescriptionSpy).toBeCalled();
    expect(clipSourceSpy).toBeCalled();
    expect(clipYieldSpy).toBeCalled();
    expect(clipActiveTimeSpy).toBeCalled();
    expect(clipTotalTimeSpy).toBeCalled();
    expect(clipIngredientsSpy).toBeCalled();
    expect(clipInstructionsSpy).toBeCalled();
    expect(clipNotesSpy).toBeCalled();
  });

  it('returns result matching snapshot', () => {
    expect(outputVal).toMatchSnapshot();
  });
});
