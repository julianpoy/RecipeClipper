import * as TextUtils from './text'
import * as ElementUtils from './element'
import * as ClipUtils from './clip'
import * as ClassMatchers from '../constants/classMatchers'
import {
  matchYield,
  matchActiveTime,
  matchTotalTime
} from '../constants/regex'

describe('clipImageURL', () => {
  let mockImage = {}
  let mockImageSrc = " https://test.com "
  let mockImageUrl = "https://test.com"
  let outputVal
  let grabLargestImageSpy, getSrcFromImageSpy, formatImageURLSpy

  beforeAll(() => {
    grabLargestImageSpy = jest.spyOn(ElementUtils, 'grabLargestImage').mockReturnValue(mockImage)
    getSrcFromImageSpy = jest.spyOn(ElementUtils, 'getSrcFromImage').mockReturnValue(mockImageSrc)
    formatImageURLSpy = jest.spyOn(TextUtils.format, 'imageURL').mockReturnValue(mockImageUrl)

    outputVal = ClipUtils.clipImageURL()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('calls grabLargestImage()', () => {
    expect(grabLargestImageSpy).toBeCalled()
  })

  it('calls getSrcFromImage() with image', () => {
    expect(getSrcFromImageSpy).toBeCalledWith(mockImage)
  })

  it('calls format.imageURL() with image src', () => {
    expect(formatImageURLSpy).toBeCalledWith(mockImageSrc)
  })

  it('returns formatted image URL', () => {
    expect(outputVal).toEqual(mockImageUrl)
  })
})

describe('clipTitle', () => {
  describe('when title is found within document', () => {
    let classTitleMatch = "example title"
    let documentTitleMatch = "alternate title"
    let title = "Example"
    let outputVal
    let grabLongestMatchByClassesSpy, grabRecipeTitleFromDocumentTitleSpy, formatTitleSpy

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(classTitleMatch)
      grabRecipeTitleFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabRecipeTitleFromDocumentTitle').mockReturnValue(documentTitleMatch)
      formatTitleSpy = jest.spyOn(TextUtils.format, 'title').mockReturnValue(title)

      outputVal = ClipUtils.clipTitle()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled()
    })

    it('calls formatTitle()', () => {
      expect(formatTitleSpy).toBeCalledWith(classTitleMatch)
    })

    it('does not call grabRecipeTitleFromDocumentTitle()', () => {
      expect(grabRecipeTitleFromDocumentTitleSpy).not.toBeCalled()
    })

    it('returns formatted title', () => {
      expect(outputVal).toEqual(title)
    })
  })

  describe('when title is not found within document', () => {
    let classTitleMatch = "example title"
    let documentTitleMatch = "alternate title"
    let title = "Example"
    let outputVal
    let grabLongestMatchByClassesSpy, grabRecipeTitleFromDocumentTitleSpy, formatTitleSpy

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(null)
      grabRecipeTitleFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabRecipeTitleFromDocumentTitle').mockReturnValue(documentTitleMatch)
      formatTitleSpy = jest.spyOn(TextUtils.format, 'title').mockReturnValue(title)

      outputVal = ClipUtils.clipTitle()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled()
    })

    it('calls grabRecipeTitleFromDocumentTitle()', () => {
      expect(grabRecipeTitleFromDocumentTitleSpy).toBeCalled()
    })

    it('calls formatTitle()', () => {
      expect(formatTitleSpy).toBeCalledWith(documentTitleMatch)
    })

    it('returns formatted title', () => {
      expect(outputVal).toEqual(title)
    })
  })
})

describe('clipDescription', () => {
  let descriptionMatch = "example description"
  let description = "example"
  let outputVal
  let grabLongestMatchByClassesSpy, formatDescriptionSpy

  beforeAll(() => {
    grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(descriptionMatch)
    formatDescriptionSpy = jest.spyOn(TextUtils.format, 'description').mockReturnValue(description)

    outputVal = ClipUtils.clipDescription()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('calls grabLongestMatchByClasses()', () => {
    expect(grabLongestMatchByClassesSpy).toBeCalled()
  })

  it('calls formatDescription()', () => {
    expect(formatDescriptionSpy).toBeCalledWith(descriptionMatch)
  })

  it('returns formatted description', () => {
    expect(outputVal).toEqual(description)
  })
})

describe('clipSource', () => {
  describe('when source is found in the document title', () => {
    let titleMatch = "title source"
    let source = "Example"
    let outputVal
    let grabSourceFromDocumentTitleSpy, formatSourceSpy

    beforeAll(() => {
      grabSourceFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabSourceFromDocumentTitle').mockReturnValue(titleMatch)
      formatSourceSpy = jest.spyOn(TextUtils.format, 'source').mockReturnValue(source)

      outputVal = ClipUtils.clipSource()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('calls grabSourceFromDocumentTitle()', () => {
      expect(grabSourceFromDocumentTitleSpy).toBeCalled()
    })

    it('calls formatSource()', () => {
      expect(formatSourceSpy).toBeCalledWith(titleMatch)
    })

    it('returns formatted source', () => {
      expect(outputVal).toEqual(source)
    })
  })

  describe('when source is not found in the document title', () => {
    let titleMatch = "title source"
    let source = "Example"
    let outputVal
    let grabSourceFromDocumentTitleSpy, formatSourceSpy

    beforeAll(() => {
      grabSourceFromDocumentTitleSpy = jest.spyOn(ElementUtils, 'grabSourceFromDocumentTitle').mockReturnValue(null)
      formatSourceSpy = jest.spyOn(TextUtils.format, 'source').mockReturnValue(source)

      outputVal = ClipUtils.clipSource()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('calls grabSourceFromDocumentTitle()', () => {
      expect(grabSourceFromDocumentTitleSpy).toBeCalled()
    })

    it('calls formatSource()', () => {
      expect(formatSourceSpy).toBeCalledWith("localhost")
    })

    it('returns formatted source', () => {
      expect(outputVal).toEqual(source)
    })
  })
})

describe('clipYield', () => {
  describe('when yield is found in the document', () => {
    let documentMatch = "example yield"
    let searchMatch = "searched yield"
    let finalYield = "example"
    let outputVal
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatYieldSpy

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(documentMatch)
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch)
      formatYieldSpy = jest.spyOn(TextUtils.format, 'yield').mockReturnValue(finalYield)

      outputVal = ClipUtils.clipYield()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled()
    })

    it('calls formatYield()', () => {
      expect(formatYieldSpy).toBeCalledWith(documentMatch)
    })

    it('does not call closestToRegExp()', () => {
      expect(closestToRegExpSpy).not.toBeCalled()
    })

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalYield)
    })
  })

  describe('when yield is not found in the document', () => {
    let searchMatch = "searched yield"
    let finalYield = "example"
    let outputVal
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatYieldSpy

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(null)
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch)
      formatYieldSpy = jest.spyOn(TextUtils.format, 'yield').mockReturnValue(finalYield)

      outputVal = ClipUtils.clipYield()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled()
    })

    it('calls closestToRegExp()', () => {
      expect(closestToRegExpSpy).toBeCalledWith(matchYield)
    })

    it('calls formatYield()', () => {
      expect(formatYieldSpy).toBeCalledWith(searchMatch)
    })

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalYield)
    })
  })
})

describe('clipActiveTime', () => {
  describe('when activeTime is found in the document', () => {
    let documentMatch = "example activeTime"
    let searchMatch = "searched activeTime"
    let finalActiveTime = "example"
    let outputVal
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatActiveTimeSpy

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(documentMatch)
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch)
      formatActiveTimeSpy = jest.spyOn(TextUtils.format, 'activeTime').mockReturnValue(finalActiveTime)

      outputVal = ClipUtils.clipActiveTime()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled()
    })

    it('calls formatActiveTime()', () => {
      expect(formatActiveTimeSpy).toBeCalledWith(documentMatch)
    })

    it('does not call closestToRegExp()', () => {
      expect(closestToRegExpSpy).not.toBeCalled()
    })

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalActiveTime)
    })
  })

  describe('when activeTime is not found in the document', () => {
    let searchMatch = "searched activeTime"
    let finalActiveTime = "example"
    let outputVal
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatActiveTimeSpy

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(null)
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch)
      formatActiveTimeSpy = jest.spyOn(TextUtils.format, 'activeTime').mockReturnValue(finalActiveTime)

      outputVal = ClipUtils.clipActiveTime()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled()
    })

    it('calls closestToRegExp()', () => {
      expect(closestToRegExpSpy).toBeCalledWith(matchActiveTime)
    })

    it('calls formatActiveTime()', () => {
      expect(formatActiveTimeSpy).toBeCalledWith(searchMatch)
    })

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalActiveTime)
    })
  })
})

describe('clipTotalTime', () => {
  describe('when totalTime is found in the document', () => {
    let documentMatch = "example totalTime"
    let searchMatch = "searched totalTime"
    let finalTotalTime = "example"
    let outputVal
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatTotalTimeSpy

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(documentMatch)
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch)
      formatTotalTimeSpy = jest.spyOn(TextUtils.format, 'totalTime').mockReturnValue(finalTotalTime)

      outputVal = ClipUtils.clipTotalTime()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled()
    })

    it('calls formatTotalTime()', () => {
      expect(formatTotalTimeSpy).toBeCalledWith(documentMatch)
    })

    it('does not call closestToRegExp()', () => {
      expect(closestToRegExpSpy).not.toBeCalled()
    })

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalTotalTime)
    })
  })

  describe('when totalTime is not found in the document', () => {
    let searchMatch = "searched totalTime"
    let finalTotalTime = "example"
    let outputVal
    let grabLongestMatchByClassesSpy, closestToRegExpSpy, formatTotalTimeSpy

    beforeAll(() => {
      grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(null)
      closestToRegExpSpy = jest.spyOn(ElementUtils, 'closestToRegExp').mockReturnValue(searchMatch)
      formatTotalTimeSpy = jest.spyOn(TextUtils.format, 'totalTime').mockReturnValue(finalTotalTime)

      outputVal = ClipUtils.clipTotalTime()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('calls grabLongestMatchByClasses()', () => {
      expect(grabLongestMatchByClassesSpy).toBeCalled()
    })

    it('calls closestToRegExp()', () => {
      expect(closestToRegExpSpy).toBeCalledWith(matchTotalTime)
    })

    it('calls formatTotalTime()', () => {
      expect(formatTotalTimeSpy).toBeCalledWith(searchMatch)
    })

    it('returns formatted', () => {
      expect(outputVal).toEqual(finalTotalTime)
    })
  })
})

describe('clipIngredients', () => {
  let ingredientsMatch = "example ingredients"
  let ingredients = "example"
  let outputVal
  let grabLongestMatchByClassesSpy, formatIngredientsSpy

  beforeAll(() => {
    grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(ingredientsMatch)
    formatIngredientsSpy = jest.spyOn(TextUtils.format, 'ingredients').mockReturnValue(ingredients)

    outputVal = ClipUtils.clipIngredients()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('calls grabLongestMatchByClasses()', () => {
    expect(grabLongestMatchByClassesSpy).toBeCalled()
  })

  it('calls formatIngredients()', () => {
    expect(formatIngredientsSpy).toBeCalledWith(ingredientsMatch)
  })

  it('returns formatted', () => {
    expect(outputVal).toEqual(ingredients)
  })
})

describe('clipInstructions', () => {
  let instructionsMatch = "example instructions"
  let instructions = "example"
  let outputVal
  let grabLongestMatchByClassesSpy, formatInstructionsSpy

  beforeAll(() => {
    grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(instructionsMatch)
    formatInstructionsSpy = jest.spyOn(TextUtils.format, 'instructions').mockReturnValue(instructions)

    outputVal = ClipUtils.clipInstructions()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('calls grabLongestMatchByClasses()', () => {
    expect(grabLongestMatchByClassesSpy).toBeCalled()
  })

  it('calls formatInstructions()', () => {
    expect(formatInstructionsSpy).toBeCalledWith(instructionsMatch)
  })

  it('returns formatted', () => {
    expect(outputVal).toEqual(instructions)
  })
})

describe('clipNotes', () => {
  let notesMatch = "example notes"
  let notes = "example"
  let outputVal
  let grabLongestMatchByClassesSpy, formatNotesSpy

  beforeAll(() => {
    grabLongestMatchByClassesSpy = jest.spyOn(ElementUtils, 'grabLongestMatchByClasses').mockReturnValue(notesMatch)
    formatNotesSpy = jest.spyOn(TextUtils.format, 'notes').mockReturnValue(notes)

    outputVal = ClipUtils.clipNotes()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('calls grabLongestMatchByClasses()', () => {
    expect(grabLongestMatchByClassesSpy).toBeCalled()
  })

  it('calls formatNotes()', () => {
    expect(formatNotesSpy).toBeCalledWith(notesMatch)
  })

  it('returns formatted', () => {
    expect(outputVal).toEqual(notes)
  })
})

