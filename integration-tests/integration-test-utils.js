import "regenerator-runtime/runtime";

const puppeteer = require('puppeteer-core');

export const clipRecipeFromUrl = async clipUrl => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: process.env.BROWSERLESS_WS || 'ws://localhost:3000'
  });

  const page = await browser.newPage();

  await page.setBypassCSP(true);

  let recipeData;
  try {
    await page.goto(clipUrl, {
      waitUntil: "networkidle2",
      timeout: 25000
    });

    await page.evaluate(() => {
      try {
        window.scrollTo(0, document.body.scrollHeight);
      } catch(e) {}
    });

    await page.addScriptTag({ path: './dist/recipe-clipper.umd.js' });
    recipeData = await page.evaluate(() => {
      return window.RecipeClipper.clipRecipe();
    });
  } catch(e) {
    await page.close();
    await browser.close();

    throw e;
  }

  return recipeData;
};

