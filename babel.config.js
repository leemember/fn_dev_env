module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "79",
          ie: "11",
        },
        useBuiltIns: "usage", // 폴리필 사용 방식 지정 'entry' , false
        corejs: {
          // 폴리필 버전 지정
          version: 2, // 최신버전은 3이지만 문서에는 2라서 2라함
        },
      },
    ],
  ],
};
