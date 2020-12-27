export const generalBadWords = [
  'instructions',
  'directions',
  'procedure',
  'preparation',
  'method',
  'you will need',
  'how to make it',
  'ingredients',
  'total time',
  'active time',
  'prep time',
  'time',
  'yield',
  'servings',
  'notes',
  'select all ingredients',
  'select all',
];
export const allRecipesBadWords = [
  'ingredient checklist',
  'instructions checklist',
  'decrease serving',
  'increase serving',
  'adjust',
  'the ingredient list now reflects the servings specified',
  'footnotes',
  'i made it  print',
  '[add all ingredients to shopping list]',
];
export const tastyRecipesBadWords = [
  'scale 1x2x3x',
];

export const badWords = [
  generalBadWords,
  allRecipesBadWords,
  tastyRecipesBadWords,
].flat();
