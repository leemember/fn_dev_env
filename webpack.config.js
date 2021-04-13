const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //모드는 개발용
  mode: "development",
  //시작점
  entry: {
    main: "./app.js",
  },
  //path: 아웃풋 디렉토리명을 입력한다. (절대경로)
  output: {
    //노드의 path모듈을 가져와서 이렇게 절대경로를 선정해준다.
    path: path.resolve("./dist"),
    //번들링 될 파일명을 입력한다.
    filename: "[name].js",
    //왜 이런식으로 했냐면 entry가 여러개일수도 있다.그래서 동적으로 파일들을 여러개 생성되게 하려고 이런식으로 아웃풋을 지정했다.
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: "url-loader",
        options: {
          // publicPath: "./dist/",
          name: "[name].[ext]?[hash]",
          limit: 20000, //파일 용량도 설정이 가능하다 2kb
        },
      },
      {
        //js관련 파일들은 바벨 로더 동작시키기
        test: /\.js$/,
        loader: "babel-loader",
        //node_modules 바벨로더 처리 안되게 제외시키기 (exclude)
        exclude: "/node_modules/",
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
      Build Date: ${new Date().toLocaleString()}
      Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
      Author: 이현주(LeeHyunJu)
      `,
    }),
    new webpack.DefinePlugin({
      //문자열 넣고 싶을 때는 이렇게 출력한다.
      TWO: JSON.stringify("1+1"),
      "api.domain": JSON.stringify("http://dev.api.domain.com"),
    }),
    // new HtmlWebpackPlugin({
    //   template: "./src/index.html",
    //   templateParameters: {
    //     env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
    //   },
    //   //불필요한 용량들을 제거해주는거
    //   minify:
    //     process.env.NODE_ENV === "procution"
    //       ? {
    //           collapseWhitespace: true, //빈칸 제거
    //           removeComments: true, //주석 제거
    //         }
    //       : false,
    // }),
    new MiniCssExtractPlugin({ filename: "[name].css" }),

    new CleanWebpackPlugin(),
  ],
};
