export const matchYield = /(serves|servings|yield|yields|makes):?\s*\d+/i;

export const matchActiveTime = /(active time|prep time):?\s*(\d+ (d(s?)|day(s?)|hour(s?)|hr(s?)|minute(s?)|min(s?))? ?(and)? ?)+/i;

export const matchTotalTime = /(total time):?\s*(\d+ (d(s?)|day(s?)|hour(s?)|hr(s?)|minute(s?)|min(s?))? ?(and)? ?)+/i;

// step 4:
export const matchStep = /^(step *)?\d+:?$/i;

// 1x, 1 x
export const matchScale = /^\d+ *x?$/i;

// total time:
export const matchFieldTitles = /^(total time|prep time|active time|yield|servings|serves):? ?/i;

export const matchSpecialChracters = /[^a-zA-Z0-9 ]/g;
