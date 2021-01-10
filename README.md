# :fork_and_knife: RecipeSage Recipe Clipper
A utility for grabbing recipes from (almost) any website using some CSS selectors, and used to power [RecipeSage](https://recipesage.com) (https://recipesage.com).

The Recipe Clipper is quite useful within a headless Chromium instance (ex. [Puppeteer](https://github.com/puppeteer/puppeteer)), for grabbing/scraping recipes from the web. 

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

To grab recipe text within the page and print it out:
```
RecipeClipper.clipRecipe().then(recipeData => {
  console.log("Done", recipeData);
});
```

### Tensorflow & Advanced Recognition

The RecipeClipper can use TensorFlow.js for recognition in many scenarios, greatly improving the overall results.

There are two options here.

1. Run TensorFlow.js in the browser
2. Send strings to an external server for prediction

#### TensorFlow Option #1
Running TensorFlow.js in the browser

The advantage of this option is that you don't have any external service dependencies. Everything runs only within the browser.
This route is quite slow, however. On an average webpage, you can expect it to take roughly ~30 seconds.

I highly recommend going with option #2 if you can, or disabling the ML part of this project completely (`window.RC_ML_DISABLE = true`).

```
const loadScript = (src, cb) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = cb;
  document.head.appendChild(script);
}

loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs", () => {
  loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder", () => {
    loadScript("/path/to/recipe-clipper.umd.js", () => {
      window.RecipeClipper.clipRecipe().then(recipeData => {
        console.log("Done", recipeData);
      });
    });
  });
})

```

#### TensorFlow Option #2
Running a dedicated server for TensorFlow

You can run a server instance here:
https://github.com/julianpoy/recipe-ml

Then, specify the endpoint of your hosted instance by setting `window.RC_ML_CLASSIFY_ENDPOINT = http://example.com`.

## :ramen: Setup, Testing & Building

The Recipe Clipper uses Rollup and Jest.

`npm install` for dependencies.

`npm run test` to run tests.

`npm run lint` to run a lint check.

`npm run lint:fix` to run a lint check and fix syntax errors via eslint.

`npm run integration` to run a integration checks defined in `integration-tests/index.spec.js` within a puppeteer browser instance.

`npm run build` to build to the `dist` folder.

## :bread: Contributing

You're welcome to open a PR to the repository. Here are some contributing guidelines:

- All pull requests should be titled with `fix(...):` or `feat(...):`
- All code changes should be tested if possible
- Maintain modularity and break logic into smaller functions whenever possible
- Site-specific code should be kept to a minimum, and should be separate from generic matching logic
