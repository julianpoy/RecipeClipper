const global = {
  window: null,
  options: {
    window: null,
    mlDisable: null,
    mlModelEndpoint: null,
    mlClassifyEndpoint: null,
  },
};

/* istanbul ignore next */
try {
  if (window) {
    global.window = window;
    global.options.window = window;
    global.options.mlDisable = window.RC_ML_DISABLE;
    global.options.mlModelEndpoint = window.RC_ML_MODEL_ENDPOINT;
    global.options.mlClassifyEndpoint = window.RC_ML_CLASSIFY_ENDPOINT;
  }
} catch (_) {
  // Do nothing
}

export default global;
