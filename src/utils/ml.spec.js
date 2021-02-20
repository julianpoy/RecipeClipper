import * as element from './element';
import * as ml from './ml';
import {
  grabByMl,
  findByHeader,
  findFullSearch,
  mlFilter,
  mlClassify,
  mlClassifyRemote,
  mlClassifyLocal,
  loadModel,
  findPotentialSetsByHeader,
  getDocumentContent,
} from './ml';
import {
  ingredientSectionHeader,
  instructionSectionHeader,
} from '../constants/regex';

const config = {
  window,
  options: {},
};

describe('ml', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    config.options.mlDisable = undefined;
  });

  describe('grabByMl', () => {
    let findByHeaderMock;
    let findFullSearchMock;

    beforeEach(() => {
      findByHeaderMock = jest.spyOn(ml, 'findByHeader');
      findFullSearchMock = jest.spyOn(ml, 'findFullSearch');
    });

    describe('when mlDisable true', () => {
      let result;

      beforeEach(async () => {
        config.options.mlDisable = true;
        result = await grabByMl(config, 1);
      });

      it('returns empty string', () => {
        expect(result).toEqual('');
      });

      it('does not call findByHeader', () => {
        expect(ml.findByHeader).not.toHaveBeenCalled();
      });

      it('does not call findFullSearch', () => {
        expect(ml.findFullSearch).not.toHaveBeenCalled();
      });
    });

    describe('when findByHeader finds a match', () => {
      let result;
      const mockHeaderResult = 'headerExample';

      beforeEach(async () => {
        findByHeaderMock.mockResolvedValue(mockHeaderResult);

        result = await grabByMl(config, 1);
      });

      it('returns match from findByHeader', () => {
        expect(result).toEqual(mockHeaderResult);
      });

      it('calls findByHeader', () => {
        expect(ml.findByHeader).toHaveBeenCalledWith(config, 1);
      });

      it('does not call findFullSearch', () => {
        expect(ml.findFullSearch).not.toHaveBeenCalled();
      });
    });

    describe('when findByHeader does not find a match', () => {
      let result;
      const mockFullTextResult = 'fullTextExample';

      beforeEach(async () => {
        findByHeaderMock.mockReturnValue(null);
        findFullSearchMock.mockReturnValue(mockFullTextResult);

        result = await grabByMl(config, 1);
      });

      it('returns match from findFullSearch', () => {
        expect(result).toEqual(mockFullTextResult);
      });

      it('calls findByHeader', () => {
        expect(ml.findByHeader).toHaveBeenCalledWith(config, 1);
      });

      it('calls findFullSearch', () => {
        expect(ml.findFullSearch).toHaveBeenCalledWith(config, 1);
      });
    });
  });

  describe('findByHeader', () => {
    let findPotentialSetsByHeaderMock;
    const findPotentialSetsByHeaderMockReturn = [
      ['example line', 'example line 2'],
      ['example 2 line', 'example 2 line 2'],
    ];
    let mlFilterMock;
    let result;

    beforeEach(() => {
      findPotentialSetsByHeaderMock = jest.spyOn(ml, 'findPotentialSetsByHeader')
        .mockReturnValue(findPotentialSetsByHeaderMockReturn);
      mlFilterMock = jest.spyOn(ml, 'mlFilter');
    });

    describe('for ingredients', () => {
      beforeEach(async () => {
        mlFilterMock
          .mockReturnValueOnce(findPotentialSetsByHeaderMockReturn[0])
          .mockReturnValueOnce(findPotentialSetsByHeaderMockReturn[1]);
        result = await findByHeader(config, 1);
      });

      it('calls findPotentialSetsByHeader with ingredient regexp', () => {
        expect(findPotentialSetsByHeaderMock).toHaveBeenCalledWith(config, ingredientSectionHeader);
      });

      it('calls mlFilter with ingredient type', () => {
        expect(mlFilterMock.mock.calls).toEqual([
          [config, findPotentialSetsByHeaderMockReturn[0], 1],
          [config, findPotentialSetsByHeaderMockReturn[1], 1],
        ]);
      });
    });

    describe('for instructions', () => {
      beforeEach(async () => {
        mlFilterMock
          .mockReturnValueOnce(findPotentialSetsByHeaderMockReturn[0])
          .mockReturnValueOnce(findPotentialSetsByHeaderMockReturn[1]);
        result = await findByHeader(config, 2);
      });

      it('calls findPotentialSetsByHeader with instruction regexp', () => {
        expect(findPotentialSetsByHeaderMock)
          .toHaveBeenCalledWith(config, instructionSectionHeader);
      });

      it('calls mlFilter with ingredient type', () => {
        expect(mlFilterMock.mock.calls).toEqual([
          [config, findPotentialSetsByHeaderMockReturn[0], 2],
          [config, findPotentialSetsByHeaderMockReturn[1], 2],
        ]);
      });
    });

    describe('for ingredients and instructions', () => {
      beforeEach(async () => {
        mlFilterMock
          .mockReturnValueOnce(findPotentialSetsByHeaderMockReturn[0])
          .mockReturnValueOnce(findPotentialSetsByHeaderMockReturn[1]);
        result = await findByHeader(config, 2);
      });

      it('returns the longest length result as a string', () => {
        expect(result).toEqual(findPotentialSetsByHeaderMockReturn[1].join('\n'));
      });
    });

    describe('for ingredients and instructions reverse order', () => {
      beforeEach(async () => {
        mlFilterMock
          .mockReturnValueOnce(findPotentialSetsByHeaderMockReturn[1])
          .mockReturnValueOnce(findPotentialSetsByHeaderMockReturn[0]);
        findPotentialSetsByHeaderMock
          .mockReturnValue(findPotentialSetsByHeaderMockReturn.slice().reverse());
        result = await findByHeader(config, 2);
      });

      it('returns the longest length result as a string', () => {
        expect(result).toEqual(findPotentialSetsByHeaderMockReturn[1].join('\n'));
      });
    });

    describe('no content', () => {
      beforeEach(async () => {
        mlFilterMock.mockReturnValue([]);
        result = await findByHeader(config, 2);
      });

      it('returns nothing', () => {
        expect(result).toEqual('');
      });
    });
  });

  describe('findFullSearch', () => {
    let getDocumentContentMock;
    const getDocumentContentMockReturn = [
      '1 tbsp butter', // Normal ingredient
      'buy now', // Button in the middle of the group - should be forgiven
      '1 cup milk',
      '1 cup flour',

      'my life story...', // Some non-ingredient and non-instruction text
      'more life story...',
      'even more life story...',

      'Flour 50% off!', // A lone line that, say, is interpereted as an ingredient

      'Add butter to the mixing bowl', // Normal instruction
      'Add milk to the mixing bowl',
      'Add flour to the mixing bowl',
    ];
    let mlClassifyMock;
    const mlClassifyMockReturn = [
      [1, 0, 0], // Ingredient
      [0, 0, 1], // Non-ingredient
      [1, 0, 0], // Ingredient
      [1, 0, 0],

      [0, 0, 1], // Non-recipe
      [0, 0, 1],
      [0, 0, 1],

      [1, 0, 0], // Ingredient

      [0, 1, 0], // Instruction
      [0, 1, 0],
      [0, 1, 0],
    ];

    beforeEach(() => {
      getDocumentContentMock = jest.spyOn(ml, 'getDocumentContent').mockReturnValue(getDocumentContentMockReturn);
      mlClassifyMock = jest.spyOn(ml, 'mlClassify').mockReturnValue(mlClassifyMockReturn);
    });

    it('sanity/setup test - test arrays equal length', () => {
      expect(getDocumentContentMockReturn.length).toEqual(mlClassifyMockReturn.length);
    });

    it('calls getDocumentContent', async () => {
      await findFullSearch(config, 1);
      expect(getDocumentContentMock).toHaveBeenCalledWith(config);
    });

    it('calls mlClassify', async () => {
      await findFullSearch(config, 1);
      expect(mlClassifyMock).toHaveBeenCalled();
    });

    it('returns largest group of ingredients', async () => {
      const expectedIngredients = getDocumentContentMockReturn.slice(0, 4).join('\n');

      expect(await findFullSearch(config, 1)).toEqual(expectedIngredients);
    });

    it('returns largest group of instructions', async () => {
      const expectedInstructions = getDocumentContentMockReturn.slice(8, 11).join('\n');

      expect(await findFullSearch(config, 2)).toEqual(expectedInstructions);
    });
  });

  describe('mlFilter', () => {
    let mlClassifyMock;

    beforeEach(() => {
      mlClassifyMock = jest.spyOn(ml, 'mlClassify');
    });

    describe('ingredients', () => {
      const content = [
        '1 tbsp butter', // Normal ingredient
        'buy now', // Button in the middle of the group - should be forgiven
        '1 cup milk',
        '1 cup flour',

        'my life story...', // Some non-ingredient and non-instruction text
        'more life story...',
        'even more life story...',

        'Add butter to the mixing bowl', // Normal instruction
        'Add milk to the mixing bowl',
        'Add flour to the mixing bowl',

        'Flour 50% off!', // A lone line that, say, is interpereted as an ingredient
      ];
      const mlClassifyMockReturn = [
        [1, 0, 0], // Ingredient
        [0, 0, 1], // Non-ingredient
        [1, 0, 0], // Ingredient
        [1, 0, 0],

        [0, 0, 1], // Non-recipe
        [0, 0, 1],
        [0, 0, 1],

        [0, 1, 0], // Instruction
        [0, 1, 0],
        [0, 1, 0],

        [1, 0, 0], // Ingredient
      ];

      beforeEach(() => {
        mlClassifyMock.mockReturnValue(mlClassifyMockReturn);
      });

      it('returns ingredients up to non-ingredient content', async () => {
        const expectedIngredients = content.slice(0, 4);

        expect(await mlFilter(config, content, 1)).toEqual(expectedIngredients);
      });
    });

    describe('instructions', () => {
      const content = [
        'Add butter to the mixing bowl', // Normal instruction
        'Add milk to the mixing bowl',
        'Add flour to the mixing bowl',

        '1 tbsp butter', // Normal ingredient
        'buy now', // Button in the middle of the group - should be forgiven
        '1 cup milk',
        '1 cup flour',

        'my life story...', // Some non-ingredient and non-instruction text
        'more life story...',
        'even more life story...',

        'Flour 50% off!', // A lone line that, say, is interpereted as an ingredient
      ];
      const mlClassifyMockReturn = [
        [0, 1, 0], // Instruction
        [0, 1, 0],
        [0, 1, 0],

        [1, 0, 0], // Ingredient
        [0, 0, 1], // Non-ingredient
        [1, 0, 0], // Ingredient
        [1, 0, 0],

        [0, 0, 1], // Non-recipe
        [0, 0, 1],
        [0, 0, 1],

        [1, 0, 0], // Ingredient
      ];

      beforeEach(() => {
        mlClassifyMock.mockReturnValue(mlClassifyMockReturn);
      });

      it('returns instructions up to non-instruction content', async () => {
        const expectedInstructions = content.slice(0, 3);

        expect(await mlFilter(config, content, 2)).toEqual(expectedInstructions);
      });
    });

    describe('neither instructions nor ingredients', () => {
      const content = [
        'my life story...', // Some non-ingredient and non-instruction text
        'more life story...',
        'even more life story...',

        'Add butter to the mixing bowl', // Normal instruction
        'Add milk to the mixing bowl',
        'Add flour to the mixing bowl',

        '1 tbsp butter', // Normal ingredient
        'buy now', // Button in the middle of the group - should be forgiven
        '1 cup milk',
        '1 cup flour',

        'Flour 50% off!', // A lone line that, say, is interpereted as an ingredient
      ];
      const mlClassifyMockReturn = [
        [0, 0, 1], // Non-recipe
        [0, 0, 1],
        [0, 0, 1],

        [0, 1, 0], // Instruction
        [0, 1, 0],
        [0, 1, 0],

        [1, 0, 0], // Ingredient
        [0, 0, 1], // Non-ingredient
        [1, 0, 0], // Ingredient
        [1, 0, 0],

        [1, 0, 0], // Ingredient
      ];

      beforeEach(() => {
        mlClassifyMock.mockReturnValue(mlClassifyMockReturn);
      });

      it('returns nothing for ingredient filter', async () => {
        expect(await mlFilter(config, content, 1)).toEqual([]);
      });

      it('returns nothing for instruction filter', async () => {
        expect(await mlFilter(config, content, 2)).toEqual([]);
      });
    });

    describe('no content', () => {
      const content = [];
      const mlClassifyMockReturn = [];

      beforeEach(() => {
        mlClassifyMock.mockReturnValue(mlClassifyMockReturn);
      });

      it('returns nothing', async () => {
        expect(await mlFilter(config, content, 1)).toEqual([]);
      });
    });
  });

  describe('mlClassify', () => {
    const input = [
      'line 1',
      'line 2',
    ];
    let mlClassifyRemoteMock;
    const mlClassifyRemoteMockReturn = [
      [1, 0, 0],
    ];
    let mlClassifyLocalMock;
    const mlClassifyLocalMockReturn = [
      [0, 0, 1],
    ];

    beforeEach(() => {
      mlClassifyRemoteMock = jest.spyOn(ml, 'mlClassifyRemote').mockResolvedValue(mlClassifyRemoteMockReturn);
      mlClassifyLocalMock = jest.spyOn(ml, 'mlClassifyLocal').mockResolvedValue(mlClassifyLocalMockReturn);
      window.tf = undefined;
      window.use = undefined;
    });

    describe('when USE is present', () => {
      describe('when tensorflow is present', () => {
        let result;

        beforeEach(async () => {
          window.tf = {
            loadLayersModel: () => {},
          };
          window.use = {
            load: () => {},
          };

          result = await mlClassify(config, input);
        });

        it('calls local classify', () => {
          expect(mlClassifyLocalMock).toHaveBeenCalledWith(config, input);
        });

        it('does not call remote classify', () => {
          expect(mlClassifyRemoteMock).not.toHaveBeenCalled();
        });

        it('returns results', () => {
          expect(result).toEqual(mlClassifyLocalMockReturn);
        });
      });

      describe('when tensorflow is defined but not present', () => {
        let result;

        beforeEach(async () => {
          window.tf = {};
          window.use = {
            load: () => {},
          };

          result = await mlClassify(config, input);
        });

        it('calls remote classify', () => {
          expect(mlClassifyRemoteMock).toHaveBeenCalledWith(config, input);
        });

        it('does not call local classify', () => {
          expect(mlClassifyLocalMock).not.toHaveBeenCalled();
        });

        it('returns results', () => {
          expect(result).toEqual(mlClassifyRemoteMockReturn);
        });
      });

      describe('when tensorflow is not present', () => {
        let result;

        beforeEach(async () => {
          window.use = {
            load: () => {},
          };

          result = await mlClassify(config, input);
        });

        it('calls remote classify', () => {
          expect(mlClassifyRemoteMock).toHaveBeenCalledWith(config, input);
        });

        it('does not call local classify', () => {
          expect(mlClassifyLocalMock).not.toHaveBeenCalled();
        });

        it('returns results', () => {
          expect(result).toEqual(mlClassifyRemoteMockReturn);
        });
      });
    });

    describe('when USE is defined but not present', () => {
      let result;

      beforeEach(async () => {
        window.tf = {
          loadLayersModel: () => {},
        };
        window.use = {};

        result = await mlClassify(config, input);
      });

      it('calls remote classify', () => {
        expect(mlClassifyRemoteMock).toHaveBeenCalledWith(config, input);
      });

      it('does not call local classify', () => {
        expect(mlClassifyLocalMock).not.toHaveBeenCalled();
      });

      it('returns results', () => {
        expect(result).toEqual(mlClassifyRemoteMockReturn);
      });
    });

    describe('when USE is not present', () => {
      let result;

      beforeEach(async () => {
        window.tf = {
          loadLayersModel: () => {},
        };

        result = await mlClassify(config, input);
      });

      it('calls remote classify', () => {
        expect(mlClassifyRemoteMock).toHaveBeenCalledWith(config, input);
      });

      it('does not call local classify', () => {
        expect(mlClassifyLocalMock).not.toHaveBeenCalled();
      });

      it('returns results', () => {
        expect(result).toEqual(mlClassifyRemoteMockReturn);
      });
    });
  });

  describe('mlClassifyRemote', () => {
    const input = [
      'line 1',
      'line 2',
    ];
    const jsonReturn = [
      [0, 0, 1],
      [1, 0, 0],
    ];
    let fetchMock;
    const fetchMockReturn = {
      json: () => Promise.resolve(jsonReturn),
    };
    let result;

    beforeEach(() => {
      fetchMock = jest.fn().mockResolvedValue(fetchMockReturn);
      window.fetch = fetchMock;
    });

    afterEach(() => {
      config.options.mlClassifyEndpoint = undefined;
      window.fetch = undefined;
    });

    describe('when mlClassifyEndpoint is set', () => {
      beforeEach(async () => {
        config.options.mlClassifyEndpoint = 'https://example.com/test';

        result = await mlClassifyRemote(config, input);
      });

      it('sends fetch request', () => {
        expect(fetchMock.mock.calls).toMatchSnapshot();
      });

      it('returns response from fetch', () => {
        expect(result).toEqual(jsonReturn);
      });
    });

    describe('when mlClassifyEndpoint is not set', () => {
      it('should throw', async () => {
        expect(mlClassifyRemote(config, input)).rejects.toThrow();
      });
    });
  });

  describe('mlClassifyLocal', () => {
    const input = [
      'line 1',
      'line 2',
    ];
    const mockEmbeddedSentence = [131, 1551, 156]; // Some vector
    const predictionValue = [0, 0, 1];
    // TF
    let loadModelMock;
    let predictMock;
    let dataSyncMock;

    // USE
    let loadUseMock;
    let embedMock;

    let result;

    beforeEach(async () => {
      dataSyncMock = jest.fn().mockReturnValue(predictionValue);

      predictMock = jest.fn().mockReturnValue({
        dataSync: dataSyncMock,
      });

      loadModelMock = jest.spyOn(ml, 'loadModel').mockResolvedValue({
        predict: predictMock,
      });

      embedMock = jest.fn().mockResolvedValue(mockEmbeddedSentence);

      loadUseMock = jest.fn().mockResolvedValue({
        embed: embedMock,
      });

      window.use = {
        load: loadUseMock,
      };

      result = await mlClassifyLocal(config, input);
    });

    it('calls loadModel', () => {
      expect(loadModelMock).toHaveBeenCalled();
    });

    it('calls predict', () => {
      expect(predictMock).toHaveBeenCalledTimes(2);
      expect(predictMock).toHaveBeenCalledWith(mockEmbeddedSentence);
    });

    it('calls dataSync', () => {
      expect(dataSyncMock).toHaveBeenCalled();
    });

    it('calls load for USE', () => {
      expect(loadUseMock).toHaveBeenCalled();
    });

    it('calls embed for USE', () => {
      expect(predictMock).toHaveBeenCalledTimes(2);
      expect(embedMock).nthCalledWith(1, [input[0]]);
      expect(embedMock).nthCalledWith(2, [input[1]]);
    });

    it('returns result', () => {
      // One prediction per input line
      expect(result).toEqual([predictionValue, predictionValue]);
    });
  });

  describe('loadModel', () => {
    let loadLayersModelMock;
    const exampleModelEndpoint = 'https://example.com/test.json';

    beforeEach(() => {
      loadLayersModelMock = jest.fn();

      window.tf = {
        loadLayersModel: loadLayersModelMock,
      };
    });

    afterEach(() => {
      window.tf = undefined;
    });

    describe('when mlModelEndpoint is not set', () => {
      it('throws', () => {
        expect(loadModel(config)).rejects.toThrow();
      });

      it('does not call loadLayersModel', async () => {
        try {
          await loadModel(config);
        } catch (e) {
          // Do nothing
        }

        expect(loadLayersModelMock).not.toHaveBeenCalled();
      });
    });

    describe('when mlModelEndpoint is set', () => {
      beforeEach(() => {
        config.options.mlModelEndpoint = exampleModelEndpoint;
      });

      it('calls loadLayersModel', async () => {
        await loadModel(config);

        expect(loadLayersModelMock).toHaveBeenCalledWith(exampleModelEndpoint);
      });
    });
  });

  describe('findPotentialSetsByHeader', () => {
    let getDocumentContentMock;
    const exampleDocumentContent = [
      'example 1',
      'example 2',
      'example 3',
      'example 4',
      'example 5',
    ];

    beforeEach(() => {
      getDocumentContentMock = jest.spyOn(ml, 'getDocumentContent').mockReturnValue(exampleDocumentContent);
    });

    it('calls getDocumentContent', () => {
      findPotentialSetsByHeader(config, /example 1/);
      expect(getDocumentContentMock).toHaveBeenCalled();
    });

    it('returns content found after regex', () => {
      const result = findPotentialSetsByHeader(config, /example 2/);
      expect(result).toEqual([
        [
          'example 3',
          'example 4',
          'example 5',
        ],
      ]);
    });

    it('returns multiple when regex matches', () => {
      const result = findPotentialSetsByHeader(config, /example 2|example 4/);
      expect(result).toEqual([
        [
          'example 3',
          'example 4',
          'example 5',
        ],
        [
          'example 5',
        ],
      ]);
    });
  });

  describe('getDocumentContent', () => {
    let applyLIBlockStylingMock;
    const documentHtml = '<div>example 1\nexample 2</div>';
    const documentContent = [
      'example 1',
      'example 2',
    ];
    let result;

    beforeEach(() => {
      applyLIBlockStylingMock = jest.spyOn(element, 'applyLIBlockStyling');
      document.body.innerHTML = documentHtml;

      result = getDocumentContent(config);
    });

    it('returns document innerText', () => {
      expect(result).toEqual(documentContent);
    });

    it('calls applyLIBlockStyling', () => {
      expect(applyLIBlockStylingMock).toHaveBeenCalledWith(window.document.body);
    });
  });
});
