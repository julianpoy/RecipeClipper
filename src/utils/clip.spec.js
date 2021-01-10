import * as TextUtils from './text';
import * as ElementUtils from './element';
import * as ClipUtils from './clip';
import * as ML from './ml';
import {
  matchYield,
  matchActiveTime,
  matchTotalTime,
} from '../constants/regex';

describe('clipImageURL', () => {
  const mockImage = {};
  const mockImageSrc = ' https://test.com ';
  const mockImageUrl = 'https://test.com';
  let outputVal;
  let grabLargestImageSpy, getSrcFromImageSpy, formatImageURLSpy;

  beforeAll(() => {
    grabLargestImageSpy = jest.spyOn(ElementUtils, 'grabLargestImage').mockReturnValue(mockImage);
    getSrcFromImageSpy = jest.spyOn(ElementUtils, 'getSrcFromImage').mockReturnValue(mockImageSrc);
    formatImageURLSpy = jest.spyOn(TextUtils.format, 'imageURL').mockReturnValue(mockImageUrl);

    outputVal = ClipUtils.clipImageURL();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('calls grabLargestImage()', () => {
    expect(grabLargestImageSpy).toBeCalled();
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

describe('clipTitle', () => {
  describe('when title is found within document', () => {
    const classTitleMatch = 'example title';
    const documentTitleMatch = 'alternate title';
    const title = 'Example';
    let outputVal;
    let grabLongestMatchByClassesSpy, grabRecipeTitleFromDocumentTitleSpy, formatTitleSpy;

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(classTitleMatch);
      grabRecipeTitleFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabRecipeTitleFromDocumentTitle').mockReturnValue(documentTitleMatch);
      formatTitleSpy = jest.spyOn(TextUtils.format, 'title').mockReturnValue(title);

      outputVal = ClipUtils.clipTitle();
    });

    afterAll(() => {
      jest.restoreAllMocks();
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
    const documentTitleMatch = 'alternate title';
    const title = 'Example';
    let outputVal;
    let grabLongestMatchByClassesSpy, grabRecipeTitleFromDocumentTitleSpy, formatTitleSpy;

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(null);
      grabRecipeTitleFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabRecipeTitleFromDocumentTitle').mockReturnValue(documentTitleMatch);
      formatTitleSpy = jest.spyOn(TextUtils.format, 'title').mockReturnValue(title);

      outputVal = ClipUtils.clipTitle();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls grabRecipeTitleFromDocumentTitle()', () => {
      expect(grabRecipeTitleFromDocumentTitleSpy).toBeCalled();
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
  let grabLongestMatchByClassesSpy, formatDescriptionSpy;

  beforeAll(() => {
    grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(descriptionMatch);
    formatDescriptionSpy = jest.spyOn(TextUtils.format, 'description').mockReturnValue(description);

    outputVal = ClipUtils.clipDescription();
  });

  afterAll(() => {
    jest.restoreAllMocks();
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

describe('clipSource', () => {
  describe('when source is found in the document title', () => {
    const titleMatch = 'title source';
    const source = 'Example';
    let outputVal;
    let grabSourceFromDocumentTitleSpy, formatSourceSpy;

    beforeAll(() => {
      grabSourceFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabSourceFromDocumentTitle').mockReturnValue(titleMatch);
      formatSourceSpy = jest.spyOn(TextUtils.format, 'source').mockReturnValue(source);

      outputVal = ClipUtils.clipSource();
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

      outputVal = ClipUtils.clipSource();
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
  describe('when yield is found in the document', () => {
    const documentMatch = 'example yield';
    const searchMatch = 'searched yield';
    const finalYield = 'example';
    let outputVal;
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatYieldSpy;

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(documentMatch);
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch);
      formatYieldSpy = jest.spyOn(TextUtils.format, 'yield').mockReturnValue(finalYield);

      outputVal = ClipUtils.clipYield();
    });

    afterAll(() => {
      jest.restoreAllMocks();
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
    const searchMatch = 'searched yield';
    const finalYield = 'example';
    let outputVal;
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatYieldSpy;

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(null);
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch);
      formatYieldSpy = jest.spyOn(TextUtils.format, 'yield').mockReturnValue(finalYield);

      outputVal = ClipUtils.clipYield();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls closestToRegExp()', () => {
      expect(closestToRegExpSpy).toBeCalledWith(matchYield);
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

      outputVal = ClipUtils.clipActiveTime();
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

      outputVal = ClipUtils.clipActiveTime();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls closestToRegExp()', () => {
      expect(closestToRegExpSpy).toBeCalledWith(matchActiveTime);
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

      outputVal = ClipUtils.clipTotalTime();
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

      outputVal = ClipUtils.clipTotalTime();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('calls closestToRegExp()', () => {
      expect(closestToRegExpSpy).toBeCalledWith(matchTotalTime);
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
  let grabLongestMatchByClassesSpy, grabByMlSpy, formatIngredientsSpy;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when grabLongestMatchByClasses returns a value', () => {
    beforeEach(async () => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(ingredientsMatch);
      grabByMlSpy = jest.spyOn(ML, 'grabByMl');
      formatIngredientsSpy = jest.spyOn(TextUtils.format, 'ingredients').mockReturnValue(ingredients);

      outputVal = await ClipUtils.clipIngredients();
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
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue('');
      grabByMlSpy = jest.spyOn(ML, 'grabByMl').mockResolvedValue(ingredientsMatch);
      formatIngredientsSpy = jest.spyOn(TextUtils.format, 'ingredients').mockReturnValue(ingredients);

      outputVal = await ClipUtils.clipIngredients();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('does not call grabByMl()', () => {
      expect(grabByMlSpy).toHaveBeenCalledWith(1);
    });

    it('calls formatIngredients()', () => {
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
  let grabLongestMatchByClassesSpy, grabByMlSpy, formatInstructionsSpy;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when grabLongestMatchByClasses returns a value', () => {
    beforeEach(async () => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(instructionsMatch);
      grabByMlSpy = jest.spyOn(ML, 'grabByMl');
      formatInstructionsSpy = jest.spyOn(TextUtils.format, 'instructions').mockReturnValue(instructions);

      outputVal = await ClipUtils.clipInstructions();
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
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue('');
      grabByMlSpy = jest.spyOn(ML, 'grabByMl').mockResolvedValue(instructionsMatch);
      formatInstructionsSpy = jest.spyOn(TextUtils.format, 'instructions').mockReturnValue(instructions);

      outputVal = await ClipUtils.clipInstructions();
    });

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled();
    });

    it('does not call grabByMl()', () => {
      expect(grabByMlSpy).toHaveBeenCalledWith(2);
    });

    it('calls formatInstructions()', () => {
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

    outputVal = ClipUtils.clipNotes();
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
