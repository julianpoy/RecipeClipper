import * as MicrodataUtils from './microdata';
import {
  getLongestTextForQueries,
  getLongestGroupTextForQueries,
  getDescriptionFromMicrodata,
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
        <div itemProp="test2">Short</div>
      `;

      expect(getLongestTextForQueries(window, [
        '[itemProp="test"]',
        '[itemProp="test2"]',
      ])).toEqual('Example Text 2');
    });
  });

  describe('getLongestGroupTextForQueries', () => {
    it('gets the text for longest matching element for query', () => {
      document.body.innerHTML = `
        <div itemProp="test">Example Text</div>
        <div itemProp="test">Example Text 2</div>
        <div itemProp="test2">Short</div>
      `;

      expect(getLongestGroupTextForQueries(window, [
        '[itemProp="test"]',
        '[itemProp="test2"]',
      ])).toEqual('Example Text\nExample Text 2');
    });
  });

  describe('getters', () => {
    let getLongestTextForQueriesSpy;
    let getLongestGroupTextForQueriesSpy;

    beforeEach(() => {
      getLongestTextForQueriesSpy = jest.spyOn(MicrodataUtils, 'getLongestTextForQueries');
      getLongestGroupTextForQueriesSpy = jest.spyOn(MicrodataUtils, 'getLongestGroupTextForQueries');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('getDescriptionFromMicrodata', () => {
      it('calls getLongestTextForQueries', () => {
        getDescriptionFromMicrodata(window);

        expect(getLongestTextForQueriesSpy).toHaveBeenCalledWith(
          window,
          ['[itemProp=description]'],
        );
      });
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
      it('calls getLongestGroupTextForQueries', () => {
        getInstructionsFromMicrodata(window);

        expect(getLongestGroupTextForQueriesSpy).toHaveBeenCalledWith(
          window,
          [
            '[itemProp=recipeInstructions]',
            '[itemProp=instructions]',
          ],
        );
      });
    });

    describe('getIngredientsFromMicrodata', () => {
      it('calls getLongestGroupTextForQueries', () => {
        getIngredientsFromMicrodata(window);

        expect(getLongestGroupTextForQueriesSpy).toHaveBeenCalledWith(
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
