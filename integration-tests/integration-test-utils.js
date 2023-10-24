import "regenerator-runtime/runtime";
import * as jsdom from "jsdom";
import sanitizeHtml from "sanitize-html";

import { clipRecipe } from '../dist/recipe-clipper.esm';

const replaceBrWithBreak = (html) => {
  return html.replaceAll(new RegExp(/<br( \/)?>/, "g"), "\n");
};

export const clipRecipeFromUrl = async clipUrl => {
  const response = await fetch(clipUrl);
  const html = await response.text();

  const dom = new jsdom.JSDOM(html);
  const { window } = dom;

  Object.defineProperty(window.Element.prototype, 'innerText', {
    get() {
      const html = replaceBrWithBreak(this.innerHTML);
      return sanitizeHtml(html, {
        allowedTags: [], // remove all tags and return text content only
        allowedAttributes: {}, // remove all tags and return text content only
      });
    },
  });

  window.fetch = fetch;

  return await clipRecipe({
    window,
    mlClassifyEndpoint: 'http://localhost:3060',
  });
};

