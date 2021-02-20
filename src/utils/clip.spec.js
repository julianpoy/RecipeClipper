import * as TextUtils from './text';
import * as ElementUtils from './element';
import * as ClipUtils from './clip';
import * as SchemaUtils from './schema';
import * as ML from './ml';
import {
  matchYield,
  matchActiveTime,
  matchTotalTime,
} from '../constants/regex';

const config = {
  window,
};

describe('clipImageURL', () => {
  const mockImage = {};
  const mockImageSrc = ' https://test.com ';
  const mockImageUrl = 'https://test.com';
  let outputVal;
  let getImageSrcFromSchemaSpy, grabLargestImageSpy, getSrcFromImageSpy, formatImageURLSpy;

  describe('when schema match is found', () => {
    beforeAll(() => {
      getImageSrcFromSchemaSpy = jest.spyOn(SchemaUtils, 'getImageSrcFromSchema').mockReturnValue(mockImageSrc);
      grabLargestImageSpy = jest.spyOn(ElementUtils, 'grabLargestImage').mockReturnValue(mockImage);
      getSrcFromImageSpy = jest.spyOn(ElementUtils, 'getSrcFromImage').mockReturnValue(mockImageSrc);
      formatImageURLSpy = jest.spyOn(TextUtils.format, 'imageURL').mockReturnValue(mockImageUrl);

      outputVal = ClipUtils.clipImageURL(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls getImageSrcFromSchema()', () => {
      expect(getImageSrcFromSchemaSpy).toBeCalled();
    });

    it('does not call grabLargestImage()', () => {
      expect(grabLargestImageSpy).not.toHaveBeenCalled();
    });

    it('does not call getSrcFromImage()', () => {
      expect(getSrcFromImageSpy).not.toHaveBeenCalled();
    });

    it('calls format.imageURL() with image src', () => {
      expect(formatImageURLSpy).toBeCalledWith(mockImageSrc);
    });

    it('returns formatted image URL', () => {
      expect(outputVal).toEqual(mockImageUrl);
    });
  });

  describe('when no schema match is found', () => {
    beforeAll(() => {
      getImageSrcFromSchemaSpy = jest.spyOn(SchemaUtils, 'getImageSrcFromSchema').mockReturnValue('');
      grabLargestImageSpy = jest.spyOn(ElementUtils, 'grabLargestImage').mockReturnValue(mockImage);
      getSrcFromImageSpy = jest.spyOn(ElementUtils, 'getSrcFromImage').mockReturnValue(mockImageSrc);
      formatImageURLSpy = jest.spyOn(TextUtils.format, 'imageURL').mockReturnValue(mockImageUrl);

      outputVal = ClipUtils.clipImageURL(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls getImageSrcFromSchema()', () => {
      expect(getImageSrcFromSchemaSpy).toBeCalledWith(config.window);
    });

    it('calls grabLargestImage()', () => {
      expect(grabLargestImageSpy).toBeCalledWith(config.window);
    });

    it('calls getSrcFromImage() with image', () => {
      expect(getSrcFromImageSpy).toBeCalledWith(mockImage);
    });

    it('calls format.imageURL() with image src', () => {
      expect(formatImageURLSpy).toBeCalledWith(mockImageSrc);
    });

    it('returns formatted image URL', () => {
      expect(outputVal).toEqual(mockImageUrl);
    });
  });
});

describe('clipTitle', () => {
  const schemaTitleMatch = 'schema title';
  const classTitleMatch = 'example title';
  const documentTitleMatch = 'alternate title';
  const title = 'Example';
  let outputVal;
  let getTitleFromSchemaSpy, grabLongestMatchByClassesSpy;
  let grabRecipeTitleFromDocumentTitleSpy, formatTitleSpy;

  describe('when schema match is found', () => {
    beforeAll(() => {
      getTitleFromSchemaSpy = jest.spyOn(SchemaUtils, 'getTitleFromSchema').mockReturnValue(schemaTitleMatch);
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(classTitleMatch);
      grabRecipeTitleFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabRecipeTitleFromDocumentTitle').mockReturnValue(documentTitleMatch);
      formatTitleSpy = jest.spyOn(TextUtils.format, 'title').mockReturnValue(title);

      outputVal = ClipUtils.clipTitle(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls getTitleFromSchema()', () => {
      expect(getTitleFromSchemaSpy).toHaveBeenCalledWith(config.window);
    });

    it('does not call grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).not.toBeCalled();
    });

    it('calls formatTitle()', () => {
      expect(formatTitleSpy).toBeCalledWith(schemaTitleMatch);
    });

    it('does not call grabRecipeTitleFromDocumentTitle()', () => {
      expect(grabRecipeTitleFromDocumentTitleSpy).not.toBeCalled();
    });

    it('returns formatted title', () => {
      expect(outputVal).toEqual(title);
    });
  });

  describe('when title is found within document', () => {
    beforeAll(() => {
      getTitleFromSchemaSpy = jest.spyOn(SchemaUtils, 'getTitleFromSchema').mockReturnValue('');
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(classTitleMatch);
      grabRecipeTitleFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabRecipeTitleFromDocumentTitle').mockReturnValue(documentTitleMatch);
      formatTitleSpy = jest.spyOn(TextUtils.format, 'title').mockReturnValue(title);

      outputVal = ClipUtils.clipTitle(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls getTitleFromSchema()', () => {
      expect(getTitleFromSchemaSpy).toBeCalledWith(config.window);
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls formatTitle()', () => {
      expect(formatTitleSpy).toBeCalledWith(classTitleMatch);
    });

    it('does not call grabRecipeTitleFromDocumentTitle()', () => {
      expect(grabRecipeTitleFromDocumentTitleSpy).not.toBeCalled();
    });

    it('returns formatted title', () => {
      expect(outputVal).toEqual(title);
    });
  });

  describe('when title is not found within document', () => {
    beforeAll(() => {
      getTitleFromSchemaSpy = jest.spyOn(SchemaUtils, 'getTitleFromSchema').mockReturnValue('');
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(null);
      grabRecipeTitleFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabRecipeTitleFromDocumentTitle').mockReturnValue(documentTitleMatch);
      formatTitleSpy = jest.spyOn(TextUtils.format, 'title').mockReturnValue(title);

      outputVal = ClipUtils.clipTitle(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls getTitleFromSchema()', () => {
      expect(getTitleFromSchemaSpy).toBeCalledWith(config.window);
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls grabRecipeTitleFromDocumentTitle()', () => {
      expect(grabRecipeTitleFromDocumentTitleSpy).toBeCalledWith(config.window);
    });

    it('calls formatTitle()', () => {
      expect(formatTitleSpy).toBeCalledWith(documentTitleMatch);
    });

    it('returns formatted title', () => {
      expect(outputVal).toEqual(title);
    });
  });
});

describe('clipDescription', () => {
  const descriptionMatch = 'example description';
  const description = 'example';
  let outputVal;
  let getDescriptionFromSchemaSpy, grabLongestMatchByClassesSpy, formatDescriptionSpy;

  describe('when schema match is found', () => {
    beforeAll(() => {
      getDescriptionFromSchemaSpy = jest.spyOn(SchemaUtils, 'getDescriptionFromSchema').mockReturnValue(descriptionMatch);
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(descriptionMatch);
      formatDescriptionSpy = jest.spyOn(TextUtils.format, 'description').mockReturnValue(description);

      outputVal = ClipUtils.clipDescription(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls getDescriptionFromSchema()', () => {
      expect(getDescriptionFromSchemaSpy).toBeCalled();
    });

    it('does not call grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).not.toBeCalled();
    });

    it('calls formatDescription()', () => {
      expect(formatDescriptionSpy).toBeCalledWith(descriptionMatch);
    });

    it('returns formatted description', () => {
      expect(outputVal).toEqual(description);
    });
  });

  describe('when no schema match is found', () => {
    beforeAll(() => {
      getDescriptionFromSchemaSpy = jest.spyOn(SchemaUtils, 'getDescriptionFromSchema').mockReturnValue('');
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(descriptionMatch);
      formatDescriptionSpy = jest.spyOn(TextUtils.format, 'description').mockReturnValue(description);

      outputVal = ClipUtils.clipDescription(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls getDescriptionFromSchema()', () => {
      expect(getDescriptionFromSchemaSpy).toBeCalled();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls formatDescription()', () => {
      expect(formatDescriptionSpy).toBeCalledWith(descriptionMatch);
    });

    it('returns formatted description', () => {
      expect(outputVal).toEqual(description);
    });
  });
});

describe('clipSource', () => {
  describe('when source is found in the document title', () => {
    const titleMatch = 'title source';
    const source = 'Example';
    let outputVal;
    let grabSourceFromDocumentTitleSpy, formatSourceSpy;

    beforeAll(() => {
      grabSourceFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabSourceFromDocumentTitle').mockReturnValue(titleMatch);
      formatSourceSpy = jest.spyOn(TextUtils.format, 'source').mockReturnValue(source);

      outputVal = ClipUtils.clipSource(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls grabSourceFromDocumentTitle()', () => {
      expect(grabSourceFromDocumentTitleSpy).toBeCalled();
    });

    it('calls formatSource()', () => {
      expect(formatSourceSpy).toBeCalledWith(titleMatch);
    });

    it('returns formatted source', () => {
      expect(outputVal).toEqual(source);
    });
  });

  describe('when source is not found in the document title', () => {
    const source = 'Example';
    let outputVal;
    let grabSourceFromDocumentTitleSpy, formatSourceSpy;

    beforeAll(() => {
      grabSourceFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabSourceFromDocumentTitle').mockReturnValue(null);
      formatSourceSpy = jest.spyOn(TextUtils.format, 'source').mockReturnValue(source);

      outputVal = ClipUtils.clipSource(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls grabSourceFromDocumentTitle()', () => {
      expect(grabSourceFromDocumentTitleSpy).toBeCalled();
    });

    it('calls formatSource()', () => {
      expect(formatSourceSpy).toBeCalledWith('localhost');
    });

    it('returns formatted source', () => {
      expect(outputVal).toEqual(source);
    });
  });
});

describe('clipYield', () => {
  const documentMatch = 'example yield';
  const searchMatch = 'searched yield';
  const finalYield = 'example';
  let outputVal;
  let getYieldFromSchemaSpy, grabLongestMatchByClassesSpy, closestToRegExpSpy, formatYieldSpy;

  describe('when schema match is found', () => {
    beforeAll(() => {
      getYieldFromSchemaSpy = jest.spyOn(SchemaUtils, 'getYieldFromSchema').mockReturnValue(documentMatch);
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(documentMatch);
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch);
      formatYieldSpy = jest.spyOn(TextUtils.format, 'yield').mockReturnValue(finalYield);

      outputVal = ClipUtils.clipYield(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls getYieldFromSchema()', () => {
      expect(getYieldFromSchemaSpy).toBeCalled();
    });

    it('does not call grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).not.toBeCalled();
    });

    it('calls formatYield()', () => {
      expect(formatYieldSpy).toBeCalledWith(documentMatch);
    });

    it('does not call closestToRegExp()', () => {
      expect(closestToRegExpSpy).not.toBeCalled();
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalYield);
    });
  });

  describe('when yield is found in the document', () => {
    beforeAll(() => {
      getYieldFromSchemaSpy = jest.spyOn(SchemaUtils, 'getYieldFromSchema').mockReturnValue('');
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(documentMatch);
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch);
      formatYieldSpy = jest.spyOn(TextUtils.format, 'yield').mockReturnValue(finalYield);

      outputVal = ClipUtils.clipYield(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls getYieldFromSchema()', () => {
      expect(getYieldFromSchemaSpy).toBeCalled();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls formatYield()', () => {
      expect(formatYieldSpy).toBeCalledWith(documentMatch);
    });

    it('does not call closestToRegExp()', () => {
      expect(closestToRegExpSpy).not.toBeCalled();
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalYield);
    });
  });

  describe('when yield is not found in the document', () => {
    beforeAll(() => {
      getYieldFromSchemaSpy = jest.spyOn(SchemaUtils, 'getYieldFromSchema').mockReturnValue('');
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(null);
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch);
      formatYieldSpy = jest.spyOn(TextUtils.format, 'yield').mockReturnValue(finalYield);

      outputVal = ClipUtils.clipYield(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls getYieldFromSchema()', () => {
      expect(getYieldFromSchemaSpy).toBeCalled();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls closestToRegExp()', () => {
      expect(closestToRegExpSpy).toBeCalledWith(config.window, matchYield);
    });

    it('calls formatYield()', () => {
      expect(formatYieldSpy).toBeCalledWith(searchMatch);
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalYield);
    });
  });
});

describe('clipActiveTime', () => {
  describe('when activeTime is found in the document', () => {
    const documentMatch = 'example activeTime';
    const searchMatch = 'searched activeTime';
    const finalActiveTime = 'example';
    let outputVal;
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatActiveTimeSpy;

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(documentMatch);
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch);
      formatActiveTimeSpy = jest.spyOn(TextUtils.format, 'activeTime').mockReturnValue(finalActiveTime);

      outputVal = ClipUtils.clipActiveTime(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls formatActiveTime()', () => {
      expect(formatActiveTimeSpy).toBeCalledWith(documentMatch);
    });

    it('does not call closestToRegExp()', () => {
      expect(closestToRegExpSpy).not.toBeCalled();
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalActiveTime);
    });
  });

  describe('when activeTime is not found in the document', () => {
    const searchMatch = 'searched activeTime';
    const finalActiveTime = 'example';
    let outputVal;
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatActiveTimeSpy;

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(null);
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch);
      formatActiveTimeSpy = jest.spyOn(TextUtils.format, 'activeTime').mockReturnValue(finalActiveTime);

      outputVal = ClipUtils.clipActiveTime(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls closestToRegExp()', () => {
      expect(closestToRegExpSpy).toBeCalledWith(config.window, matchActiveTime);
    });

    it('calls formatActiveTime()', () => {
      expect(formatActiveTimeSpy).toBeCalledWith(searchMatch);
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalActiveTime);
    });
  });
});

describe('clipTotalTime', () => {
  describe('when totalTime is found in the document', () => {
    const documentMatch = 'example totalTime';
    const searchMatch = 'searched totalTime';
    const finalTotalTime = 'example';
    let outputVal;
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatTotalTimeSpy;

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(documentMatch);
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch);
      formatTotalTimeSpy = jest.spyOn(TextUtils.format, 'totalTime').mockReturnValue(finalTotalTime);

      outputVal = ClipUtils.clipTotalTime(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls formatTotalTime()', () => {
      expect(formatTotalTimeSpy).toBeCalledWith(documentMatch);
    });

    it('does not call closestToRegExp()', () => {
      expect(closestToRegExpSpy).not.toBeCalled();
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalTotalTime);
    });
  });

  describe('when totalTime is not found in the document', () => {
    const searchMatch = 'searched totalTime';
    const finalTotalTime = 'example';
    let outputVal;
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatTotalTimeSpy;

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(null);
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch);
      formatTotalTimeSpy = jest.spyOn(TextUtils.format, 'totalTime').mockReturnValue(finalTotalTime);

      outputVal = ClipUtils.clipTotalTime(config);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls closestToRegExp()', () => {
      expect(closestToRegExpSpy).toBeCalledWith(config.window, matchTotalTime);
    });

    it('calls formatTotalTime()', () => {
      expect(formatTotalTimeSpy).toBeCalledWith(searchMatch);
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalTotalTime);
    });
  });
});

describe('clipIngredients', () => {
  const ingredientsMatch = 'example ingredients';
  const ingredients = 'example';
  let outputVal;
  let getIngredientsFromSchemaSpy, grabLongestMatchByClassesSpy, grabByMlSpy, formatIngredientsSpy;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when schema match is found', () => {
    beforeEach(async () => {
      getIngredientsFromSchemaSpy = jest.spyOn(SchemaUtils, 'getIngredientsFromSchema').mockReturnValue(ingredientsMatch);
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(ingredientsMatch);
      grabByMlSpy = jest.spyOn(ML, 'grabByMl');
      formatIngredientsSpy = jest.spyOn(TextUtils.format, 'ingredients').mockReturnValue(ingredients);

      outputVal = await ClipUtils.clipIngredients(config);
    });

    it('calls getIngredientsFromSchema()', () => {
      expect(getIngredientsFromSchemaSpy).toBeCalled();
    });

    it('does not call grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).not.toBeCalled();
    });

    it('does not call grabByMl()', () => {
      expect(grabByMlSpy).not.toBeCalled();
    });

    it('calls formatIngredients()', () => {
      expect(formatIngredientsSpy).toBeCalledWith(ingredientsMatch);
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(ingredients);
    });
  });

  describe('when grabLongestMatchByClasses returns a value', () => {
    beforeEach(async () => {
      getIngredientsFromSchemaSpy = jest.spyOn(SchemaUtils, 'getIngredientsFromSchema').mockReturnValue('');
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(ingredientsMatch);
      grabByMlSpy = jest.spyOn(ML, 'grabByMl');
      formatIngredientsSpy = jest.spyOn(TextUtils.format, 'ingredients').mockReturnValue(ingredients);

      outputVal = await ClipUtils.clipIngredients(config);
    });

    it('calls getIngredientsFromSchema()', () => {
      expect(getIngredientsFromSchemaSpy).toBeCalled();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('does not call grabByMl()', () => {
      expect(grabByMlSpy).not.toBeCalled();
    });

    it('calls formatIngredients()', () => {
      expect(formatIngredientsSpy).toBeCalledWith(ingredientsMatch);
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(ingredients);
    });
  });

  describe('when grabLongestMatchByClasses does not return a value', () => {
    beforeEach(async () => {
      getIngredientsFromSchemaSpy = jest.spyOn(SchemaUtils, 'getIngredientsFromSchema').mockReturnValue('');
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue('');
      grabByMlSpy = jest.spyOn(ML, 'grabByMl').mockResolvedValue(ingredientsMatch);
      formatIngredientsSpy = jest.spyOn(TextUtils.format, 'ingredients')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(ingredients);

      outputVal = await ClipUtils.clipIngredients(config);
    });

    it('calls getIngredientsFromSchema()', () => {
      expect(getIngredientsFromSchemaSpy).toBeCalled();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('does not call grabByMl()', () => {
      expect(grabByMlSpy).toHaveBeenCalledWith(config, 1);
    });

    it('calls formatIngredients() for class match', () => {
      expect(formatIngredientsSpy).toBeCalledWith('');
    });

    it('calls formatIngredients() for ml match', () => {
      expect(formatIngredientsSpy).toBeCalledWith(ingredientsMatch);
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(ingredients);
    });
  });
});

describe('clipInstructions', () => {
  const instructionsMatch = 'example instructions';
  const instructions = 'example';
  let outputVal;
  let getInstructionsFromSchemaSpy, grabLongestMatchByClassesSpy;
  let grabByMlSpy, formatInstructionsSpy;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when schema match is found', () => {
    beforeEach(async () => {
      getInstructionsFromSchemaSpy = jest.spyOn(SchemaUtils, 'getInstructionsFromSchema').mockReturnValue(instructionsMatch);
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(instructionsMatch);
      grabByMlSpy = jest.spyOn(ML, 'grabByMl');
      formatInstructionsSpy = jest.spyOn(TextUtils.format, 'instructions').mockReturnValue(instructions);

      outputVal = await ClipUtils.clipInstructions(config);
    });

    it('calls getInstructionsFromSchema()', () => {
      expect(getInstructionsFromSchemaSpy).toBeCalled();
    });

    it('does not call grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).not.toBeCalled();
    });

    it('does not call grabByMl()', () => {
      expect(grabByMlSpy).not.toBeCalled();
    });

    it('calls formatInstructions()', () => {
      expect(formatInstructionsSpy).toBeCalledWith(instructionsMatch);
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(instructions);
    });
  });

  describe('when grabLongestMatchByClasses returns a value', () => {
    beforeEach(async () => {
      getInstructionsFromSchemaSpy = jest.spyOn(SchemaUtils, 'getInstructionsFromSchema').mockReturnValue('');
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(instructionsMatch);
      grabByMlSpy = jest.spyOn(ML, 'grabByMl');
      formatInstructionsSpy = jest.spyOn(TextUtils.format, 'instructions').mockReturnValue(instructions);

      outputVal = await ClipUtils.clipInstructions(config);
    });

    it('calls getInstructionsFromSchema()', () => {
      expect(getInstructionsFromSchemaSpy).toBeCalled();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('does not call grabByMl()', () => {
      expect(grabByMlSpy).not.toBeCalled();
    });

    it('calls formatInstructions()', () => {
      expect(formatInstructionsSpy).toBeCalledWith(instructionsMatch);
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(instructions);
    });
  });

  describe('when grabLongestMatchByClasses does not return a value', () => {
    beforeEach(async () => {
      getInstructionsFromSchemaSpy = jest.spyOn(SchemaUtils, 'getInstructionsFromSchema').mockReturnValue('');
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue('');
      grabByMlSpy = jest.spyOn(ML, 'grabByMl').mockResolvedValue(instructionsMatch);
      formatInstructionsSpy = jest.spyOn(TextUtils.format, 'instructions')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(instructions);

      outputVal = await ClipUtils.clipInstructions(config);
    });

    it('calls getInstructionsFromSchema()', () => {
      expect(getInstructionsFromSchemaSpy).toBeCalled();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('does not call grabByMl()', () => {
      expect(grabByMlSpy).toHaveBeenCalledWith(config, 2);
    });

    it('calls formatInstructions() for class match', () => {
      expect(formatInstructionsSpy).toBeCalledWith('');
    });

    it('calls formatInstructions() for ml match', () => {
      expect(formatInstructionsSpy).toBeCalledWith(instructionsMatch);
    });

    it('returns formatted', () => {
      expect(outputVal).toEqual(instructions);
    });
  });
});

describe('clipNotes', () => {
  const notesMatch = 'example notes';
  const notes = 'example';
  let outputVal;
  let grabLongestMatchByClassesSpy, formatNotesSpy;

  beforeAll(() => {
    grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(notesMatch);
    formatNotesSpy = jest.spyOn(TextUtils.format, 'notes').mockReturnValue(notes);

    outputVal = ClipUtils.clipNotes(config);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('calls grabLongestMatchByClasses()', () => {
    expect(grabLongestMatchByClassesSpy).toBeCalled();
  });

  it('calls formatNotes()', () => {
    expect(formatNotesSpy).toBeCalledWith(notesMatch);
  });

  it('returns formatted', () => {
    expect(outputVal).toEqual(notes);
  });
});
