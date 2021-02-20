export const generateConfig = (options) => {
  // Default structure
  const config = {
    window: null,
    options: {
      window: null,
      mlDisable: null,
      mlModelEndpoint: null,
      mlClassifyEndpoint: null,
    },
  };

  // Window-based options
  /* istanbul ignore next */
  try {
    if (window) {
      config.window = window;
      config.options.window = window;
      config.options.mlDisable = window.RC_ML_DISABLE || null;
      config.options.mlModelEndpoint = window.RC_ML_MODEL_ENDPOINT || null;
      config.options.mlClassifyEndpoint = window.RC_ML_CLASSIFY_ENDPOINT || null;
    }
  } catch (_) {
    // Do nothing
  }

  // Argument-based options
  if (options) {
    config.window = options.window || config.window;
    config.options = {
      ...config.options,
      ...options,
    };
  }

  return config;
};
