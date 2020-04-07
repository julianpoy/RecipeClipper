import "regenerator-runtime/runtime";

const puppeteer = require('puppeteer-core');

export const clipRecipeFromUrl = async clipUrl => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: process.env.BROWSERLESS_WS || 'ws://localhost:3000'
  });

  const page = await browser.newPage();

  await page.setBypassCSP(true);

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
  const recipeData = await page.evaluate(() => {
    return window.RecipeClipper.clipRecipe();
  });

  await page.close();
  await browser.close();

  return recipeData;
};

