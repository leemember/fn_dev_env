module.exports = function myBabelPreset() {
  return {
    Plugins: [
      "@babel/plugin-transform-block-scoping",
      "@babel/plugin-transform-arrow-functions",
      "@babel/plugin-transform-strict-mode",
    ],
  };
};
