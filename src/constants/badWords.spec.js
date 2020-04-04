import {
  badWords,
  generalBadWords,
  allRecipesBadWords,
  tastyRecipesBadWords,
} from './badWords';

describe('badWords', () => {
  it('matches snapshot', () => {
    expect(badWords).toMatchSnapshot();
  });
});

describe('generalBadWords', () => {
  it('matches snapshot', () => {
    expect(generalBadWords).toMatchSnapshot();
  });
});

describe('allRecipesBadWords', () => {
  it('matches snapshot', () => {
    expect(allRecipesBadWords).toMatchSnapshot();
  });
});

describe('tastyRecipesBadWords', () => {
  it('matches snapshot', () => {
    expect(tastyRecipesBadWords).toMatchSnapshot();
  });
});
