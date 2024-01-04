# :fork_and_knife: RecipeSage Recipe Clipper
A utility for grabbing recipes from (almost) any website using some CSS selectors plus machine learning, and is used to power [RecipeSage](https://recipesage.com) (https://recipesage.com).

The Recipe Clipper is quite useful within a headless Chromium instance (ex. [Puppeteer](https://github.com/puppeteer/puppeteer)), for grabbing/scraping recipes from the web. 

## :rice: How it Works

The Recipe Clipper has two methods of grabbing content from sites.

First, it works by looking for common CSS selectors present on cooking sites, and grabbing the text within. There's some smarts around picking matches, such as what CSS selectors are preferred.

Second, it uses machine learning to look at the content of the page and grab sections that it thinks are ingredients or instructions. This is currently new, and is used as a fallback method if it can't find content via CSS selectors.

These approaches are very different than many importers that rely on specific site format to grab recipe details. I chose this approach due to it's flexibility and ability to support a large number of sites without a tremendous amount of tweaking.

## :hamburger: Site Support

There is currently no official site support list. Sites are constantly changing

To add support for a specific site, you'll want to find the relevant CSS selectors for the recipe fields on the page and add those to the relevant array within `src/constants/classMatchers.js`.

## :sushi: Usage

Results will be more accurate in browsers that support the `innerText` prop. At the time of writing, this is approximately 98.7% of worldwide browser usage. See support here: https://caniuse.com/#feat=innertext

HTML parsing engines such as JSDOM can be used with this library, but may provide less accurate results than a headless browser, due to support for `innerText`.

To import:
```
const RecipeClipper = require('@julianpoy/recipe-clipper'); // CommonJS
import RecipeClipper from '@julianpoy/recipe-clipper'; // ES6 CommonJS
import { clipRecipe } from '@julianpoy/recipe-clipper/dist/recipe-clipper.mjs'; // ESM
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

You can pass an optional options object into `clipRecipe` as shown below:

```
RecipeClipper.clipRecipe({
  window: window, // Optional: Pass a custom window object - very useful if you want to use this library with JSDOM
  mlDisable: false, // Optional: Disable the machine learning part of this project
  mlClassifyEndpoint: '', // Optional: Provide the endpoint for the machine learning classification server documented below
  mlModelEndpoint: '', // Optional: Provide the machine learning model endpoint if using local in-browser machine learning
  ignoreMLClassifyErrors: false, // Optional: Do not throw an error if machine learning classification fails, just return an empty string for that field instead
})...
```

### Tensorflow & Advanced Recognition

The RecipeClipper can use TensorFlow.js for recognition in many scenarios, greatly improving the overall results.

There are three options here.

1. Run TensorFlow.js in the browser
2. Send strings to an external server for prediction
3. Disable the machine learning portion of this project (not recommended)

#### TensorFlow Option #1
Running TensorFlow.js in the browser

The advantage of this option is that you don't have any external service dependencies. Everything runs only within the browser.
This route is quite slow, however. On an average webpage, you can expect it to take roughly ~30 seconds.

I highly recommend going with option #2 if you can, or disabling the ML part of this project completely (`window.RC_ML_DISABLE = true`, or option `mlDisable: true`).

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
https://github.com/julianpoy/ingredient-instruction-classifier

Then, specify the endpoint of your hosted instance by setting `window.RC_ML_CLASSIFY_ENDPOINT = http://example.com` or by passing an object into `clipRecipe` with `mlClassifyEndpoint: 'http://example.com'`.

#### TensorFlow Option #3
Disabling the TensorFlow part of this project.

This project can still recognize ingredients/instructions without TensorFlow by looking at the classes on elements within the document.
This functionality is limited, however.

To disable machine learning, specify `window.RC_ML_DISABLE = true` or pass an object into `clipRecipe` with the property `mlDisable: true`.

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

The model for the machine learning part of this project is located at:
https://github.com/julianpoy/ingredient-instruction-classifier
