# :fork_and_knife: RecipeSage Recipe Clipper
A utility for grabbing recipes from (almost) any website using some CSS selectors, and used to power RecipeSage (https://recipesage.com).

The Recipe Clipper is quite useful within a headless Chromium instance (ex. puppeteer), for grabbing/scraping recipes from the web. 

## :rice: How it Works

The Recipe Clipper works by looking for common CSS selectors present on cooking sites, and grabbing the text within. There's some smarts around picking matches, such as what CSS selectors are preferred.

This approach is different than many importers that rely on specific site format to grab recipe details. I chose this approach due to it's flexibility and ability to support a large number of sites without a tremendous amount of tweaking.

## :hamburger: Site Support

There is currently no official site support list. Sites are constantly changing

To add support for a specific site, you'll want to find the relevant CSS selectors for the recipe fields on the page and add those to the relevant array within `src/constants/classMatchers.js`.

## :sushi: Usage

You can use this package in any browser that supports the `innerText` prop. At the time of writing, this is approximately 98.7% of worldwide browser usage. See support here: https://caniuse.com/#feat=innertext

Note: The Recipe Clipper does not support fake browser engines such as JSDOM, which lack `innerText` support.

To import:
```
const RecipeClipper = require('@julianpoy/recipe-clipper');
import RecipeClipper from '@julianpoy/recipe-clipper';
```

Or:
```
<script src="/path/to/recipe-clipper.umd.js"></script>
```

## :ramen: Setup, Testing & Building

The Recipe Clipper uses Rollup and Jest.

`npm install` for dependencies.

`npm run test` to run tests.

`npm run build` to build to the `dist` folder.

