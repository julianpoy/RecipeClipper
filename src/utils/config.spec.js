import { generateConfig } from './config';

describe('generateConfig', () => {
  it('returns default config when no options are provided', () => {
    const config = generateConfig();
    expect(config).toEqual({
      window,
      options: {
        window,
        mlDisable: null,
        mlModelEndpoint: null,
        mlClassifyEndpoint: null,
        ignoreMLClassifyErrors: null,
      },
    });
  });

  it('returns custom config when options are provided', () => {
    const config = generateConfig({
      mlDisable: true,
      mlModelEndpoint: 'example',
      mlClassifyEndpoint: 'example2',
      ignoreMLClassifyErrors: true,
    });
    expect(config).toEqual({
      window,
      options: {
        window,
        mlDisable: true,
        mlModelEndpoint: 'example',
        mlClassifyEndpoint: 'example2',
        ignoreMLClassifyErrors: true,
      },
    });
  });

  it('allows user to override window', () => {
    const fakeWindow = { test: 'test' };
    const config = generateConfig({
      window: fakeWindow,
    });
    expect(config).toEqual({
      window: fakeWindow,
      options: {
        window: fakeWindow,
        mlDisable: null,
        mlModelEndpoint: null,
        mlClassifyEndpoint: null,
        ignoreMLClassifyErrors: null,
      },
    });
  });
});
