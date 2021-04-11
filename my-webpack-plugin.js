class MyWebpackPlugin {
  apply(compiler) {
    //종료될 때 실행되는 플러그인
    // compiler.hooks.done.tap("My Plugin", (stats) => {
    //   console.log("My Plugin: done");
    // });

    compiler.plugin("emit", (compilation, callback) => {
      const source = compilation.assets["main.js"].source();

      compilation.assets["main.js"].source = () => {
        const banner = [
          "/**",
          " * 이것은 배너 플러그인이 처리한 결과입니다.",
          " * Build Date : 2021-04-11",
          " */",
        ].join("\n");
        return banner + "\n\n" + source;
      };
      callback();
    });
  }
}

module.exports = MyWebpackPlugin;
