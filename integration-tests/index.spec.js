import { clipRecipeFromUrl } from './integration-test-utils'

const sites = [
  'https://www.bettycrocker.com/recipes/ultimate-chocolate-chip-cookies/77c14e03-d8b0-4844-846d-f19304f61c57',
  'https://panlasangpinoy.com/leche-flan/',
  'https://sallysbakingaddiction.com/quiche-recipe/',
  'https://www.allrecipes.com/recipe/231244/asparagus-mushroom-bacon-crustless-quiche/',
  'https://www.foodnetwork.com/recipes/food-network-kitchen/fall-off-the-bone-chicken-5195778',
  'https://www.delish.com/cooking/recipe-ideas/a25648042/crustless-quiche-recipe/',
  'https://food52.com/recipes/81867-best-quiche-recipe',
  'https://myheartbeets.com/paleo-tortilla-chips/',
  'https://www.bonappetit.com/recipe/chocolate-babka',
  'https://www.kingarthurflour.com/recipes/chocolate-cake-recipe',
];

describe('testing', () => {
  sites.forEach(site => {
    it(`clips recipe matching snapshot from ${site}`, async () => {
      const clip = await clipRecipeFromUrl(site)
      expect(clip).toMatchSnapshot();
    })
  })
})
