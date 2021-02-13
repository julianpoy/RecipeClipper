import * as schemaUtils from './schema';

import {
  getRecipeSchemasFromDocument,
  getPropertyFromSchema,
  getImageSrcFromSchema,
  getTitleFromSchema,
  getDescriptionFromSchema,
  getYieldFromSchema,
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
    expect(getRecipeSchemasFromDocument()).toEqual([]);
  });

  it('returns empty array when invalid schema is present', () => {
    createSchema('invalid schema content');

    expect(getRecipeSchemasFromDocument()).toEqual([]);
  });

  it('returns recipe schema when present', () => {
    const recipeSchema = {
      '@type': 'Recipe',
    };
    createSchema(JSON.stringify(recipeSchema));

    expect(getRecipeSchemasFromDocument()).toEqual([recipeSchema]);
  });

  it('returns multiple recipe schemas when present', () => {
    const recipeSchema = {
      '@type': 'Recipe',
    };
    createSchema(JSON.stringify(recipeSchema));
    createSchema(JSON.stringify(recipeSchema));

    expect(getRecipeSchemasFromDocument()).toEqual([recipeSchema, recipeSchema]);
  });

  it('returns recipe schema from within schema graph', () => {
    const recipeSchema = {
      '@type': 'Recipe',
    };
    const graphSchema = {
      '@graph': [recipeSchema],
    };
    createSchema(JSON.stringify(graphSchema));

    expect(getRecipeSchemasFromDocument()).toEqual([recipeSchema]);
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

    expect(getRecipeSchemasFromDocument()).toEqual([recipeSchema]);
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
    getPropertyFromSchema('test');
    getPropertyFromSchema('test');
    getPropertyFromSchema('test');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('only calls getRecipeSchemasFromDocument once', () => {
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('returns null when no schemas match', () => {
    expect(getPropertyFromSchema('test')).toEqual(null);
  });

  it('returns value from first schema with matching element', () => {
    expect(getPropertyFromSchema('example')).toEqual(value);
  });
});

describe('getImageSrcFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getImageSrcFromSchema();
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
  });

  it('returns empty string when no match is found', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(null);
    expect(getImageSrcFromSchema()).toEqual('');
  });

  it('returns value when schema query result is string', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(exampleString);
    expect(getImageSrcFromSchema()).toEqual(exampleString);
  });

  it('returns first value when schema query result is array of strings', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([exampleString]);
    expect(getImageSrcFromSchema()).toEqual(exampleString);
  });

  it('returns empty string when schema query result is object', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue({
      some: 'object',
    });
    expect(getImageSrcFromSchema()).toEqual('');
  });

  it('returns empty string when schema query result is array of objects', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([{
      some: 'object',
    }]);
    expect(getImageSrcFromSchema()).toEqual('');
  });
});

describe('getTitleFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getTitleFromSchema();
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledWith('name');
  });

  it('returns empty string when no match is found', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(null);
    expect(getTitleFromSchema()).toEqual('');
  });

  it('returns value when schema query result is string', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(exampleString);
    expect(getTitleFromSchema()).toEqual(exampleString);
  });

  it('returns empty string when schema query result is not a string', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue({
      some: 'object',
    });
    expect(getTitleFromSchema()).toEqual('');
  });
});

describe('getDescriptionFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getDescriptionFromSchema();
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledWith('description');
  });

  it('returns empty string when no match is found', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(null);
    expect(getDescriptionFromSchema()).toEqual('');
  });

  it('returns value when schema query result is string', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(exampleString);
    expect(getDescriptionFromSchema()).toEqual(exampleString);
  });

  it('returns empty string when schema query result is not a string', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue({
      some: 'object',
    });
    expect(getDescriptionFromSchema()).toEqual('');
  });
});

describe('getYieldFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getYieldFromSchema();
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledWith('recipeYield');
  });

  it('returns empty string when no match is found', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(null);
    expect(getYieldFromSchema()).toEqual('');
  });

  it('returns value when schema query result is string', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(exampleString);
    expect(getYieldFromSchema()).toEqual(exampleString);
  });

  it('returns longest value when schema query result is an array of strings', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(['a', exampleString, 'ab']);
    expect(getYieldFromSchema()).toEqual(exampleString);
  });

  it('returns empty string when schema query result is not a string or array of strings', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([{
      some: 'object',
    }]);
    expect(getYieldFromSchema()).toEqual('');
  });
});

describe('getInstructionsFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getInstructionsFromSchema();
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledWith('recipeInstructions');
  });

  it('returns empty string when no match is found', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(null);
    expect(getInstructionsFromSchema()).toEqual('');
  });

  it('returns value when schema query result is string', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(exampleString);
    expect(getInstructionsFromSchema()).toEqual(exampleString);
  });

  it('returns concatenated value when schema query result is an array of strings', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([exampleString, exampleString, exampleString]);
    expect(getInstructionsFromSchema()).toEqual('example\nexample\nexample');
  });

  it('returns concatenated value when schema query result is an array of schemas with text', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([{
      text: exampleString,
    }, {
      text: exampleString,
    }]);

    expect(getInstructionsFromSchema()).toEqual('example\nexample');
  });

  it('returns empty string when schema query result is not a string, array of strings, or array of schema objects with text', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([{
      some: 'object',
    }]);
    expect(getInstructionsFromSchema()).toEqual('');
  });
});

describe('getIngredientsFromSchema', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getPropertyFromSchema', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema');
    getIngredientsFromSchema();
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledTimes(1);
    expect(schemaUtils.getPropertyFromSchema).toHaveBeenCalledWith('recipeIngredient');
  });

  it('returns empty string when no match is found', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(null);
    expect(getIngredientsFromSchema()).toEqual('');
  });

  it('returns value when schema query result is string', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue(exampleString);
    expect(getIngredientsFromSchema()).toEqual(exampleString);
  });

  it('returns concatenated value when schema query result is an array of strings', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([exampleString, exampleString, exampleString]);
    expect(getIngredientsFromSchema()).toEqual('example\nexample\nexample');
  });

  it('returns concatenated value when schema query result is an array of schemas with text', () => {
    const exampleString = 'example';
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([{
      text: exampleString,
    }, {
      text: exampleString,
    }]);

    expect(getIngredientsFromSchema()).toEqual('example\nexample');
  });

  it('returns empty string when schema query result is not a string, array of strings, or array of schema objects with text', () => {
    jest.spyOn(schemaUtils, 'getPropertyFromSchema').mockReturnValue([{
      some: 'object',
    }]);
    expect(getIngredientsFromSchema()).toEqual('');
  });
});
