import * as MicrodataUtils from './microdata';
import {
  getLongestTextForQueries,
  getActiveTimeFromMicrodata,
  getTotalTimeFromMicrodata,
  getYieldFromMicrodata,
  getIngredientsFromMicrodata,
  getInstructionsFromMicrodata,
} from './microdata';

describe('MicrodataUtils', () => {
  describe('getLongestTextForQueries', () => {
    it('gets the text for longest matching element for query', () => {
      document.body.innerHTML = `
        <div itemProp="test">Example Text</div>
        <div itemProp="test">Example Text 2</div>
      `;

      expect(getLongestTextForQueries(window, [
        '[itemProp="test"]',
      ])).toEqual('Example Text 2');
    });
  });

  describe('getters', () => {
    let getLongestTextForQueriesSpy;

    beforeEach(() => {
      getLongestTextForQueriesSpy = jest.spyOn(MicrodataUtils, 'getLongestTextForQueries');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('getActiveTimeFromMicrodata', () => {
      it('calls getLongestTextForQueries', () => {
        getActiveTimeFromMicrodata(window);

        expect(getLongestTextForQueriesSpy).toHaveBeenCalledWith(
          window,
          ['[itemProp=prepTime]'],
        );
      });
    });

    describe('getTotalTimeFromMicrodata', () => {
      it('calls getLongestTextForQueries', () => {
        getTotalTimeFromMicrodata(window);

        expect(getLongestTextForQueriesSpy).toHaveBeenCalledWith(
          window,
          ['[itemProp=totalTime]'],
        );
      });
    });

    describe('getYieldFromMicrodata', () => {
      it('calls getLongestTextForQueries', () => {
        getYieldFromMicrodata(window);

        expect(getLongestTextForQueriesSpy).toHaveBeenCalledWith(
          window,
          ['[itemProp=recipeYield]'],
        );
      });
    });

    describe('getInstructionsFromMicrodata', () => {
      it('calls getLongestTextForQueries', () => {
        getInstructionsFromMicrodata(window);

        expect(getLongestTextForQueriesSpy).toHaveBeenCalledWith(
          window,
          [
            '[itemProp=recipeInstructions]',
            '[itemProp=instructions]',
          ],
        );
      });
    });

    describe('getIngredientsFromMicrodata', () => {
      it('calls getLongestTextForQueries', () => {
        getIngredientsFromMicrodata(window);

        expect(getLongestTextForQueriesSpy).toHaveBeenCalledWith(
          window,
          [
            '[itemProp=recipeIngredients]',
            '[itemProp=ingredients]',
          ],
        );
      });
    });
  });
});
