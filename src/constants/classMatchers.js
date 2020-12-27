const classMatchers = {
  imageURL: [
    [
      'wprm-recipe-image', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
      'tasty-recipes-image', // TastyRecipes recipe embed tool - https://sallysbakingaddiction.com/quiche-recipe/
      'hero-photo', // AllRecipes - https://www.allrecipes.com/recipe/231244/asparagus-mushroom-bacon-crustless-quiche/
      'o-RecipeLead__m-RecipeMedia', // FoodNetwork - https://www.foodnetwork.com/recipes/paula-deen/spinach-and-bacon-quiche-recipe-2131172
      'recipe-lede-image', // Delish - https://www.delish.com/cooking/recipe-ideas/a25648042/crustless-quiche-recipe/
      'recipe-body', // Generic, idea from Delish - https://www.delish.com/cooking/recipe-ideas/a25648042/crustless-quiche-recipe/
      'recipe__hero', // Food52 - https://food52.com/recipes/81867-best-quiche-recipe
      'content', // Generic, recognize content-body if matched directly
    ],
    [
      'recipe-image',
      'hero',
      'recipe-content', // Generic, search for largest image within any recipe content block
      'recipe-body', // Generic, search for largest image within any recipe content block
      'recipe-intro', // Generic, search for largest image within any recipe content block
      'recipe-', // Generic, search for largest image within any recipe content block
    ],
  ],
  title: [
    [
      'wprm-recipe-name', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
    ],
    [],
  ],
  description: [
    [
      'wprm-recipe-summary', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
    ],
    [],
  ],
  yield: [
    ['recipe-yield', 'recipe-servings', 'yield', 'servings'],
    ['yield', 'servings'],
  ],
  activeTime: [
    ['activeTime', 'active-time', 'prep-time', 'time-active', 'time-prep'],
    ['activeTime', 'active-time', 'prep-time', 'time-active', 'time-prep'],
  ],
  totalTime: [
    ['totalTime', 'total-time', 'time-total'],
    ['totalTime', 'total-time', 'time-total'],
  ],
  ingredients: [
    [
      'wprm-recipe-ingredients-container', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
      'wprm-recipe-ingredients', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
      'tasty-recipes-ingredients', // Tasty recipes embed tool - https://myheartbeets.com/paleo-tortilla-chips/
      'o-Ingredients', // FoodNetwork - https://www.foodnetwork.com/recipes/paula-deen/spinach-and-bacon-quiche-recipe-2131172
      'recipe-ingredients',
      'recipe-ingredients-section', // Taste.com.au - https://www.taste.com.au/recipes/healthy-feta-mint-beef-patties-griled-vegies-hummus-recipe/pxacqmfu?r=recipes/dinnerrecipesfortwo&c=1j53ce29/Dinner%20recipes%20for%20two
      'ingredient-list', // Bon Appetit - https://www.bonappetit.com/recipe/extra-corny-cornbread-muffins
      'ingredientlist', // Generic
    ],
    ['ingredients'],
  ],
  instructions: [
    [
      'wprm-recipe-instructions', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
      'tasty-recipes-instructions', // Tasty recipes embed tool - https://myheartbeets.com/paleo-tortilla-chips/
      'recipe-directions__list', // AllRecipes - https://www.allrecipes.com/recipe/231244/asparagus-mushroom-bacon-crustless-quiche/
      'o-Method', // FoodNetwork - https://www.foodnetwork.com/recipes/paula-deen/spinach-and-bacon-quiche-recipe-2131172
      'steps-area', // Bon Appetit - https://www.bonappetit.com/recipe/chocolate-babka
      'recipe-method-section', // Taste.com.au - https://www.taste.com.au/recipes/healthy-feta-mint-beef-patties-griled-vegies-hummus-recipe/pxacqmfu?r=recipes/dinnerrecipesfortwo&c=1j53ce29/Dinner%20recipes%20for%20two

      'recipe__list--steps', // Food52.com - https://food52.com/recipes/81867-best-quiche-recipe
      'recipesteps', // BettyCrocker.com - https://www.bettycrocker.com/recipes/ultimate-chocolate-chip-cookies/77c14e03-d8b0-4844-846d-f19304f61c57
      'instruction-list', // Bon Appetit - https://www.bonappetit.com/recipe/extra-corny-cornbread-muffins
      'instructionlist', // Generic
      'preparation-steps', // https://www.maangchi.com/recipe/kimchi-bokkeumbap
      'preparationsteps', // Generic
      'instructions', // Generic
      'recipe-steps', // Generic
      'recipe-instructions', // Generic
      'directions', // Generic
    ],
    ['instructions', 'directions', 'recipe-method'],
  ],
  notes: [
    [
      'notes',
      'recipe-notes',
      'recipe-footnotes',
      'recipe__tips', // King Arthur Flour - https://www.kingarthurflour.com/recipes/chocolate-cake-recipe
      'wprm-recipe-notes-container', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
    ],
    ['recipe-notes'],
  ],
};

export default classMatchers;
