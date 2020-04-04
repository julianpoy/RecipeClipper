import {
  getClassNamesMatching,
  softMatchElementsByClass,
  applyLIBlockStyling,
  grabLongestMatchByClasses,
  isImg,
  isPicture,
  getImgElementsWithin,
  isValidImage,
  getImageDimensions,
  grabLargestImage,
  closestToRegExp,
  getAttrIfExists,
  getSrcFromImage,
  grabRecipeTitleFromDocumentTitle,
  grabSourceFromDocumentTitle,
} from './element';

describe('getClassRegExp', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <a class="single-example"></a>
      <a class="multiple-similar-example"></a>
      <a class="multiple-similar-example"></a>
      <a class="multiple-different-example1"></a>
      <a class="multiple-different-example2"></a>
      <a class="example with multiple-classes"></a>
    `;
  });

  afterAll(() => {
    document.body.innerHTML = '';
  });

  it('matches single classname', () => {
    expect(getClassNamesMatching('single-example')).toEqual(['single-example']);
  });

  it('matches and groups multiple, similar classnames', () => {
    expect(getClassNamesMatching('multiple-similar')).toEqual(['multiple-similar-example']);
  });

  it('matches multiple classnames', () => {
    expect(getClassNamesMatching('multiple-different')).toEqual(['multiple-different-example1', 'multiple-different-example2']);
  });

  it('matches elements with multiple classnames', () => {
    expect(getClassNamesMatching('multiple-classes')).toEqual(['example with multiple-classes']);
  });

  it('returns empty array for no matches', () => {
    expect(getClassNamesMatching('shouldnotmatch')).toEqual([]);
  });
});

describe('softMatchElementsByClass', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <a class="example-element-1">Test</a>
      <a class="example-element-2">Test2</a>
      <a class="example-element-3">Test3</a>
    `;
  });

  afterAll(() => {
    document.body.innerHTML = '';
  });

  it('returns matched elements', () => {
    expect(softMatchElementsByClass('example-element')).toMatchSnapshot();
  });

  it('returns empty array when elements not found', () => {
    expect(softMatchElementsByClass('does-not-exist')).toEqual([]);
  });
});

describe('applyLIBlockStyling', () => {
  let el1, el2;

  beforeAll(() => {
    document.body.innerHTML = `
      <ul id="el">
        <li>Test1</li>
        <li>Test2</li>
      </ul>
      <ul id="el2">
        <li>Test1</li>
        <li>Test2</li>
      </ul>
    `;

    el1 = document.getElementById('el');
    el2 = document.getElementById('el2');
    applyLIBlockStyling(el1);
  });

  afterAll(() => {
    document.body.innerHTML = '';
  });

  it('formats el1 li elements as block', () => {
    Array.from(el1.children).forEach((child) => expect(child.style.display).toEqual('block'));
  });

  it('does not format el2 li elements as block', () => {
    Array.from(el2.children).forEach((child) => expect(child.style.display).toEqual(''));
  });

  it('renders dom matching snapshot', () => {
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});

describe('grabLongestMatchByClasses', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('matches preferred first', () => {
    document.body.innerHTML = `
      <div class="recipe-ingredients">
        We'll be making food today!
        <div class="recipe-ingredient">
          Ingredient 1
        </div>
      </div>
    `;

    const text = grabLongestMatchByClasses(['recipe-ingredient'], ['recipe-ingredients']);
    expect(text).toEqual('Ingredient 1');
  });

  it('matches fuzzy second', () => {
    document.body.innerHTML = `
      <div class="recipe-ingredients">
        We'll be making food today!
        <div class="recipe-ingredient-1">
          Ingredient 1
        </div>
      </div>
    `;

    const text = grabLongestMatchByClasses(['recipe-ingredient'], ['recipe-ingredients']);
    expect(text).toEqual("We'll be making food today!\nIngredient 1");
  });

  it('prefers longer preferred matches', () => {
    document.body.innerHTML = `
      <div class="recipe-ingredients">
        We'll be making food today!
      </div>
      <div class="recipe-ingredients">
        We'll be making food today! Some other text
      </div>
    `;

    const text = grabLongestMatchByClasses(['recipe-ingredients'], ['recipe-ingredient-other']);
    expect(text).toEqual("We'll be making food today! Some other text");
  });

  it('prefers longer fuzzy matches', () => {
    document.body.innerHTML = `
      <div class="recipe-ingredients">
        We'll be making food today!
      </div>
      <div class="recipe-ingredients">
        We'll be making food today! Some other text
      </div>
    `;

    const text = grabLongestMatchByClasses(['recipe-ingredient-other'], ['recipe-']);
    expect(text).toEqual("We'll be making food today! Some other text");
  });

  it('handles multiple preferred selectors', () => {
    document.body.innerHTML = `
      <div class="recipe-ingredients">
        <div class="recipe-ingredients">
          We'll be making food today!
        </div>
        <div class="recipe-ingredients">
          We'll be making food today! Some other text
        </div>
      </div>
    `;

    const text = grabLongestMatchByClasses(['recipe-ingredients'], ['recipe-']);
    expect(text).toEqual("We'll be making food today!\nWe'll be making food today! Some other text");
  });

  it('handles multiple fuzzy selectors', () => {
    document.body.innerHTML = `
      <div class="recipe-ingredients-container">
        <div class="recipe-ingredients">
          We'll be making food today!
        </div>
        <div class="recipe-ingredients">
          We'll be making food today! Some other text
        </div>
      </div>
    `;

    const text = grabLongestMatchByClasses(['recipe-ingredient-other'], ['recipe-']);
    expect(text).toEqual("We'll be making food today!\nWe'll be making food today! Some other text");
  });

  it('returns empty string when no matches are found', () => {
    document.body.innerHTML = `
      <div class="recipe-ingredients-container">
        <div class="recipe-ingredients">
          We'll be making food today!
        </div>
        <div class="recipe-ingredients">
          We'll be making food today! Some other text
        </div>
      </div>
    `;

    const text = grabLongestMatchByClasses(['recipe-ingredient-other'], ['recipe-ingredient-other']);
    expect(text).toEqual('');
  });
});

describe('isImg', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns true for image', () => {
    const image = document.createElement('img');
    expect(isImg(image)).toEqual(true);
  });

  it('returns false for non-image element', () => {
    const image = document.createElement('div');
    expect(isImg(image)).toEqual(false);
  });
});

describe('isPicture', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns true for picture', () => {
    const picture = document.createElement('picture');
    expect(isPicture(picture)).toEqual(true);
  });

  it('returns false for non-picture element', () => {
    const picture = document.createElement('div');
    expect(isPicture(picture)).toEqual(false);
  });
});

describe('getImgElementsWithin', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('matches self', () => {
    const image = document.createElement('img');
    expect(getImgElementsWithin(image)).toEqual([image]);
  });

  it('matches child image elements', () => {
    document.body.innerHTML = `
      <img id="test" />
      <div>
        <img id="test2" />
      </div>
    `;

    expect(getImgElementsWithin(document.body)).toMatchSnapshot();
  });
});

describe('isValidImage', () => {
  it('returns true for valid image', () => {
    const image = {
      tagName: 'img',
      attributes: {},
      complete: true,
      naturalWidth: 200,
      naturalHeight: 200,
      src: 'https://example.com',
    };

    expect(isValidImage(image)).toEqual(true);
  });

  it('returns false when not an image', () => {
    const image = {
      tagName: 'div',
      attributes: {},
      complete: true,
      naturalWidth: 200,
      naturalHeight: 200,
      src: 'https://example.com',
    };

    expect(isValidImage(image)).toEqual(false);
  });

  it('returns false when no src is present', () => {
    const image = {
      tagName: 'img',
      attributes: {},
      complete: true,
      naturalWidth: 200,
      naturalHeight: 200,
    };

    expect(isValidImage(image)).toEqual(false);
  });

  it('returns false when incomplete', () => {
    const image = {
      tagName: 'img',
      attributes: {},
      complete: false,
      naturalWidth: 200,
      naturalHeight: 200,
      src: 'https://example.com',
    };

    expect(isValidImage(image)).toEqual(false);
  });

  it('returns false when element has no width', () => {
    const image = {
      tagName: 'img',
      attributes: {},
      complete: true,
      naturalWidth: 0,
      naturalHeight: 200,
      src: 'https://example.com',
    };

    expect(isValidImage(image)).toEqual(false);
  });

  it('returns false when element has no height', () => {
    const image = {
      tagName: 'img',
      attributes: {},
      complete: true,
      naturalWidth: 200,
      naturalHeight: 0,
      src: 'https://example.com',
    };

    expect(isValidImage(image)).toEqual(false);
  });
});

describe('getImageDimensions', () => {
  it('returns size of image with no parent', () => {
    const image = {
      tagName: 'img',
      offsetWidth: 200,
      offsetHeight: 200,
    };

    expect(getImageDimensions(image)).toEqual({
      offsetWidth: 200,
      offsetHeight: 200,
    });
  });

  it('returns size of image with non-image parent', () => {
    const picture = {
      parentNode: {
        tagName: 'div',
        offsetWidth: 400,
        offsetHeight: 400,
      },
      tagName: 'img',
      offsetWidth: 200,
      offsetHeight: 200,
    };

    expect(getImageDimensions(picture)).toEqual({
      offsetWidth: 200,
      offsetHeight: 200,
    });
  });

  it('returns size of image with same size picture parent', () => {
    const picture = {
      parentNode: {
        tagName: 'picture',
        offsetWidth: 200,
        offsetHeight: 200,
      },
      tagName: 'img',
      offsetWidth: 200,
      offsetHeight: 200,
    };

    expect(getImageDimensions(picture)).toEqual({
      offsetWidth: 200,
      offsetHeight: 200,
    });
  });

  it('returns size of parent for image with larger size picture parent', () => {
    const picture = {
      parentNode: {
        tagName: 'picture',
        offsetWidth: 400,
        offsetHeight: 400,
      },
      tagName: 'img',
      offsetWidth: 200,
      offsetHeight: 200,
    };

    expect(getImageDimensions(picture)).toEqual({
      offsetWidth: 400,
      offsetHeight: 400,
    });
  });
});

describe('grabLargestImage', () => {
  let querySelectorAllSpy, img1, img2;

  beforeEach(() => {
    img1 = {
      tagName: 'img',
      attributes: {},
      complete: true,
      naturalWidth: 200,
      naturalHeight: 200,
      src: 'https://example.com',
    };
    img2 = {
      tagName: 'img',
      attributes: {},
      complete: true,
      naturalWidth: 200,
      naturalHeight: 200,
      src: 'https://example.com',
    };

    querySelectorAllSpy = jest.spyOn(document, 'querySelectorAll').mockReturnValue([
      img1,
      img2,
    ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls querySelectorAll()', () => {
    grabLargestImage();
    expect(querySelectorAllSpy).toBeCalledWith('img');
  });

  it('returns largest image within page', () => {
    img1.offsetWidth = 200;
    img1.offsetHeight = 200;
    img2.offsetWidth = 300;
    img2.offsetHeight = 300;

    expect(grabLargestImage()).toEqual(img2);
  });

  it('returns first same-sized image', () => {
    img1.offsetWidth = 200;
    img1.offsetHeight = 200;
    img2.offsetWidth = 200;
    img2.offsetHeight = 200;

    expect(grabLargestImage()).toEqual(img1);
  });

  it('does not include images less than 200x200', () => {
    img1.offsetWidth = 10;
    img1.offsetHeight = 10;
    img2.offsetWidth = 100;
    img2.offsetHeight = 100;

    expect(grabLargestImage()).toEqual(null);
  });

  it('does not include images with no offset', () => {
    expect(grabLargestImage()).toEqual(null);
  });
});

describe('closestToRegExp', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      This is a test
    `;
  });

  afterAll(() => {
    document.body.innerHTML = '';
  });

  it('finds closest match in document', () => {
    expect(closestToRegExp(/this.*a/i)).toEqual('This is a');
  });

  it('returns empty string when no match', () => {
    expect(closestToRegExp(/no match/)).toEqual('');
  });
});

describe('getAttrIfExists', () => {
  const el = {
    attributes: {
      example: {
        value: 'test',
      },
    },
  };

  it('returns attr value when present', () => {
    expect(getAttrIfExists(el, 'example')).toEqual('test');
  });

  it('returns empty string when attr is not present', () => {
    expect(getAttrIfExists(el, 'notpresent')).toEqual('');
  });
});

describe('getSrcFromImage', () => {
  it('returns data-src when present', () => {
    const img = {
      attributes: {
        'data-src': {
          value: 'test',
        },
      },
    };

    expect(getSrcFromImage(img)).toEqual('test');
  });

  it('returns data-lazy-src when present', () => {
    const img = {
      attributes: {
        'data-lazy-src': {
          value: 'test',
        },
      },
    };

    expect(getSrcFromImage(img)).toEqual('test');
  });

  it('returns currentSrc when present', () => {
    const img = {
      currentSrc: 'test',
      attributes: {},
    };

    expect(getSrcFromImage(img)).toEqual('test');
  });

  it('returns src when present', () => {
    const img = {
      src: 'test',
      attributes: {},
    };

    expect(getSrcFromImage(img)).toEqual('test');
  });

  it('returns empty string when no src is found', () => {
    const img = {
      attributes: {},
    };

    expect(getSrcFromImage(img)).toEqual('');
  });

  it('returns empty string when image is null', () => {
    expect(getSrcFromImage(null)).toEqual('');
  });
});

describe('grabRecipeTitleFromDocumentTitle', () => {
  afterEach(() => {
    document.title = '';
  });

  it('grabs first half hyphenated page title', () => {
    document.title = 'Some Title - Some Author';

    expect(grabRecipeTitleFromDocumentTitle()).toEqual('Some Title');
  });

  it('grabs first half of pipe delimited page title', () => {
    document.title = 'Some Title|Some Author';

    expect(grabRecipeTitleFromDocumentTitle()).toEqual('Some Title');
  });

  it('does not split hypenated page title without spaces', () => {
    document.title = 'Some-Title';

    expect(grabRecipeTitleFromDocumentTitle()).toEqual('Some-Title');
  });

  it('returns empty string for blank page title', () => {
    document.title = '';

    expect(grabRecipeTitleFromDocumentTitle()).toEqual('');
  });
});

describe('grabSourceFromDocumentTitle', () => {
  afterEach(() => {
    document.title = '';
  });

  it('grabs second half hyphenated page title', () => {
    document.title = 'Some Title - Some Author';

    expect(grabSourceFromDocumentTitle()).toEqual('Some Author');
  });

  it('grabs second half of pipe delimited page title', () => {
    document.title = 'Some Title|Some Author';

    expect(grabSourceFromDocumentTitle()).toEqual('Some Author');
  });

  it('does not split hypenated page title without spaces', () => {
    document.title = 'Some-Title';

    expect(grabSourceFromDocumentTitle()).toEqual('');
  });

  it('returns empty string for blank page title', () => {
    document.title = '';

    expect(grabSourceFromDocumentTitle()).toEqual('');
  });
});
