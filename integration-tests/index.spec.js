import { clipRecipeFromUrl } from './integration-test-utils'

const sites = [
  'https://www.bettycrocker.com/recipes/ultimate-chocolate-chip-cookies/77c14e03-d8b0-4844-846d-f19304f61c57'
];

describe('testing', () => {
  sites.forEach(site => {
    it(`clips recipe matching snapshot from ${site}`, async () => {
      const clip = await clipRecipeFromUrl(site)
      expect(clip).toMatchSnapshot();
    })
  })
})
