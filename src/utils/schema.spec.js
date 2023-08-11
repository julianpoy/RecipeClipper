import * as schemaUtils from './schema';

import {
  getRecipeSchemasFromDocument,
  getPropertyFromSchema,
  getImageSrcFromSchema,
  getTitleFromSchema,
  getDescriptionFromSchema,
  getYieldFromSchema,
  getTextFromSchema,
  getInstructionsFromSchema,
  getIngredientsFromSchema,
} from './schema';

const createSchema = (schemaText) => {
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.text = schemaText;

  document.head.appendChild(schema);
};

describe('getRecipeSchemasFromDocument', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('returns empty array when no schemas are present', () => {
    expect(getRecipeSchemasFromDocument(window)).toEqual([]);
  });

  it('returns empty array when invalid schema is present', () => {
    createSchema('invalid schema content');

    expect(getRecipeSchemasFromDocument(window)).toEqual([]);
  });

  it('returns recipe schema when present', () => {
    const recipeSchema = {
      '@type': 'Recipe',
    };
    createSchema(JSON.stringify(recipeSchema));

    expect(getRecipeSchemasFromDocument(window)).toEqual([recipeSchema]);
  });

  it('returns multiple recipe schemas when present', () => {
    const recipeSchema = {
      '@type': 'Recipe',
    };
    createSchema(JSON.stringify(recipeSchema));
    createSchema(JSON.stringify(recipeSchema));

    expect(getRecipeSchemasFromDocument(window)).toEqual([recipeSchema, recipeSchema]);
  });

  it('returns recipe schema from within schema graph', () => {
    const recipeSchema = {
      '@type': 'Recipe',
    };
    const graphSchema = {
      '@graph': [recipeSchema],
    };
    createSchema(JSON.stringify(graphSchema));

    expect(getRecipeSchemasFromDocument(window)).toEqual([recipeSchema]);
  });

  it('returns recipe schema if schema is actually an array of schemas', () => {
    const recipeSchema = {
      '@type': 'Recipe',
    };
    const arraySchema = [recipeSchema];
    createSchema(JSON.stringify(arraySchema));

    expect(getRecipeSchemasFromDocument(window)).toEqual([recipeSchema]);
  });

  it('does not return non-recipe schema types', () => {
    const nonRecipeSchema = {
      '@type': 'Article',
    };
    const recipeSchema = {
      '@type': 'Recipe',
    };
    createSchema(JSON.stringify(nonRecipeSchema));
    createSchema(JSON.stringify(recipeSchema));

    expect(getRecipeSchemasFromDocument(window)).toEqual([recipeSchema]);
  });
});

describe('getPropertyFromSchema', () => {
  let spy;
  const value = 'value';
  beforeAll(() => {
    spy = jest.spyOn(schemaUtils, 'getRecipeSchemasFromDocument').mockReturnValue([{
      example: value,
    }, {
      example: '1234',
    }]);
    getPropertyFromSchema(window, 'test');
    getPropertyFromSchema(window, 'test');
    getPropertyFromSchema(window, 'test');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('only calls getRecipeSchemasFromDocument once', () => {
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('returns null when no schemas match', () => {
    expect(getPropertyFromSchema(window, 'test')).toEqual(null);
  });

  it('returns value from first schema with matching element', () => {
    expect(getPropertyFromSchema(window, 'example')).toEqual(value);
  });
});

describe('getImageSrcFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getImageSrcFromSchema(window);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
  });

  it('returns empty string when no match is found', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(null);
    expect(getImageSrcFromSchema(window)).toEqual('');
  });

  it('returns value when schema query result is valid url', () => {
    const exampleString = 'https://example.com/test.jpg';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(exampleString);
    expect(getImageSrcFromSchema(window)).toEqual(exampleString);
  });

  it('returns value when schema query result is an ImageObject', () => {
    const exampleString = 'http://example.com/test.jpg';
    const imageObj = {
      url: exampleString,
    };
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(imageObj);
    expect(getImageSrcFromSchema(window)).toEqual(exampleString);
  });

  it('returns first value when schema query result is array of valid urls', () => {
    const exampleString = 'http://example.com/test.jpg';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([exampleString]);
    expect(getImageSrcFromSchema(window)).toEqual(exampleString);
  });

  it('returns first value when schema query result is an array of ImageObjects', () => {
    const exampleString = 'http://example.com/test.jpg';
    const imageObj = {
      url: exampleString,
    };
    const imageObj2 = {
      url: `${exampleString}h`,
    };
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([imageObj, imageObj2]);
    expect(getImageSrcFromSchema(window)).toEqual(exampleString);
  });

  it('returns first value when schema query result is an ImageObject', () => {
    const exampleString = 'http://example.com/test.jpg';
    const imageObj = {
      url: exampleString,
    };
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(imageObj);
    expect(getImageSrcFromSchema(window)).toEqual(exampleString);
  });

  it('returns empty string when schema query result is non-http url', () => {
    const exampleString = 'ftp://example.com/test.jpg';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([exampleString]);
    expect(getImageSrcFromSchema(window)).toEqual('');
  });

  it('returns empty string when schema query result is invalid url', () => {
    const exampleString = 'test.jpg';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([exampleString]);
    expect(getImageSrcFromSchema(window)).toEqual('');
  });

  it('returns empty string when schema query result is object', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue({
      some: 'object',
    });
    expect(getImageSrcFromSchema(window)).toEqual('');
  });

  it('returns empty string when schema query result is array of objects', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([{
      some: 'object',
    }]);
    expect(getImageSrcFromSchema(window)).toEqual('');
  });
});

describe('getTitleFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getTitleFromSchema(window);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledWith(window, 'name');
  });

  it('returns empty string when no match is found', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(null);
    expect(getTitleFromSchema(window)).toEqual('');
  });

  it('returns value when schema query result is string', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(exampleString);
    expect(getTitleFromSchema(window)).toEqual(exampleString);
  });

  it('returns empty string when schema query result is not a string', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue({
      some: 'object',
    });
    expect(getTitleFromSchema(window)).toEqual('');
  });
});

describe('getDescriptionFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getDescriptionFromSchema(window);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledWith(window, 'description');
  });

  it('returns empty string when no match is found', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(null);
    expect(getDescriptionFromSchema(window)).toEqual('');
  });

  it('returns value when schema query result is string', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(exampleString);
    expect(getDescriptionFromSchema(window)).toEqual(exampleString);
  });

  it('returns empty string when schema query result is not a string', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue({
      some: 'object',
    });
    expect(getDescriptionFromSchema(window)).toEqual('');
  });
});

describe('getYieldFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getYieldFromSchema(window);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledWith(window, 'recipeYield');
  });

  it('returns empty string when no match is found', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(null);
    expect(getYieldFromSchema(window)).toEqual('');
  });

  it('returns value when schema query result is string', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(exampleString);
    expect(getYieldFromSchema(window)).toEqual(exampleString);
  });

  it('returns longest value when schema query result is an array of strings', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(['a', exampleString, 'ab']);
    expect(getYieldFromSchema(window)).toEqual(exampleString);
  });

  it('returns empty string when schema query result is not a string or array of strings', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([{
      some: 'object',
    }]);
    expect(getYieldFromSchema(window)).toEqual('');
  });
});

describe('getInstructionsFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getInstructionsFromSchema(window);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledWith(window, 'recipeInstructions');
  });

  it('calls getTextFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue('example');
    jest.spyOn(schemaUtils, 'getTextFromSchema');
    getInstructionsFromSchema(window);
    expect(schemaUtils.getTextFromSchema).toHaveBeenCalledTimes(1);
  });
});

describe('getIngredientsFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getIngredientsFromSchema(window);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledWith(window, 'recipeIngredient');
  });

  it('calls getTextFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue('example');
    jest.spyOn(schemaUtils, 'getTextFromSchema');
    getIngredientsFromSchema(window);
    expect(schemaUtils.getTextFromSchema).toHaveBeenCalledTimes(1);
  });
});

describe('getTextFromSchema', () => {
  it('returns empty string when schema is null', () => {
    expect(getTextFromSchema(null)).toEqual('');
  });

  it('returns value when schema is string', () => {
    const exampleString = 'example';
    expect(getTextFromSchema(exampleString)).toEqual(exampleString);
  });

  it('returns concatenated value when schema is an array of strings', () => {
    const exampleString = 'example';
    expect(getTextFromSchema([exampleString, exampleString, exampleString])).toEqual('example\nexample\nexample');
  });

  it('returns concatenated value when schema is an array of schemas with text', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue();

    expect(
      getTextFromSchema([{
        text: exampleString,
      }, {
        text: exampleString,
      }]),
    ).toEqual('example\nexample');
  });

  it('returns concatenated string when schema contains itemListElements', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue();

    expect(
      getTextFromSchema([{
        itemListElement: [{
          text: exampleString,
        }],
      }, {
        text: exampleString,
      }]),
    ).toEqual('example\nexample');
  });

  it('returns empty string when schema is in an unrecognizable format', () => {
    expect(getTextFromSchema([{
      some: 'object',
    }])).toEqual('');
  });

  it('returns empty string when schema is in an unrecognizable format', () => {
    expect(getTextFromSchema([
      {
        some: {
          property: 'value',
        },
      },
      3, // Check against an unexpected type of value
    ])).toEqual('');
  });
});
