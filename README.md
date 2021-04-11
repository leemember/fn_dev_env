# FN 개발환경의 이해와 실습

## 웹팩이 필요한 이유와 기본 동작

<br>

## <b>IIFE</b>

> 즉시 실행 함수 표현(IIFE, Immediately Invoked Function Expression)은 정의되자마자 즉시 실행되는 Javascript Function 를 말한다.

```
(function () {
    statements
})();
```

1. 첫 번째는 괄호((), Grouping Operator)로 둘러싸인 익명함수(Anonymous Function)이다. 이는 전역 스코프에 불필요한 변수를 추가해서 오염시키는 것을 방지할 수 있을 뿐 아니라 IIFE 내부안으로 다른 변수들이 접근하는 것을 막을 수 있는 방법이다. <br>

2. 두 번째 부분은 즉시 실행 함수를 생성하는 괄호()이다. 이를 통해 자바스크립트 엔진은 함수를 즉시 해석해서 실행한다.

```
(function () {
    var aName = "Barry";
})();
// IIFE 내부에서 정의된 변수는 외부 범위에서 접근이 불가능하다.
aName // throws "Uncaught ReferenceError: aName is not defined"
```

<br>

## <b>다양한 모듈 스펙</b>

이러한 방식으로 자바스크립트 모듈을 구현하는 대표적인 명세가 AMD와 CommonJS다. CommonJS는 자바스크립트로 사용하는 모든 환경에서 모듈을 하는 것이 목표다. exports 키워드로 모듈을 만들고 require() 함수로 불러 들이는 방식이다. 대표적으로 서버 사이드 플랫폼인 Nodejs에서 이를 사용한다.

<br>

math.js

```
export function sum(a,b) { return a + b;}
```

내보낼 때는 export를 사용하고

<br>

app.js

```
import * as math from './math.js'
```

가져올 때는 import 구문으로 가져올 수 있다.

<br>

- AMD : 비동기로 로딩되는 환경에서 모듈을 사용하는 것이 목표다. 주로 브라우저 환경이다.
- UMD : AMD 기반으로 CommonJS 방식까지 지원하는 통합 형태다.
  이렇게 각 커뮤니티에서 각자의 스펙을 제안하다가 ES2015에서 표준 모듈 시스템을 내 놓았다. 지금은 바벨과 웹팩을 이용해 모듈 시스템을 사용하는 것이 일반적이다. ES2015 모듈 시스템의 모습을 살펴보자.

html 브라우저에서는 이렇게 사용할 수 있다.

```
<script type="module" src="src/math.js"></script>
```

이렇게 되면 script 구문 안에 type="module" 을 입력 해야한다. 하지만 이럴 때는 서버를 돌려야 되는데, npm으로 lite-server를 설치해준다.

```
$npx lite-server
```

이렇게 설치해주면 현재 폴더를 서버로 만들어준다. 그럼 자동으로 브라우저가 켜지면서 콘솔에 3이 찍힌다.

## 엔트리/아웃풋

웹팩은 여러개 파일을 하나의 파일로 만들어 주는 번들러(bundler)다. 하나의 시작점으로부터 의존적인 모듈을 전부 찾아내서 하나의 결과물을 만들어 낸다. app.js 부터 시작해 math.js파일을 찾은 뒤 하나의 파일로 만드는 방식이다.

- 번들 작업을 하는 webpack 패키지와 웹팩 터미널 도구인 webpack-cli를 설치한다.

```
$npm install -D webpack webpack-cli
```

설치 완료하면 node_modules/.bin 폴더에 실행 가능한 명령어가 몇 개 생긴다. webpack과 webpack-cli가 있는데 둘 중 하나를 실행하면 된다. 여기서 사용된 -D는 개발용 dependencies다.

> https://webpack.js.org/

웹팩을 실행할때에는 필수적인 옵션이 있다.

1. --mode => development, production, none이 있는데 개발환경이냐 운영환경이냐에 따라서 development, production을 설정한다.

- development : 개발용 정보를 추가할 때
- production : 운영에 배포하기 위한 것

2. 모듈의 시작점 : entry 라고 한다.

3. entry를 통해 모든걸 하나로 합치고 경로를 저장하는 것은 output 이라고 한다.

```
$node_modules/.bin/webpack --mode development --entry ./src/app.js --output dist/main.js
```

웹팩은 이렇게 여러개의 모듈을 하나의 파일로 만들어주는 역할을 한다.

- 웹팩 설정 파일명 [webpack.config.js] 또는 [webpackfile.js] 라고 한다.

```
{
  "name": "fn_dev_env",
  "version": "1.0.0",
  "description": "<br>",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
  "author": "leehyunju",
  "license": "ISC",
  "dependencies": {
    "react": "^17.0.1"
  },
  "devDependencies": {
    "webpack": "^4.46.0",
    "webpack-cli": "^4.5.0"
  }
}
```

여기서 build를 webpack으로만 하면 현재 프로젝트에 있는 노드모듈을 뒤져가지고 웹팩 명령어를 찾는다. 그럼 웹팩은 기본 webpack.config.js파일을 읽어서 번들링을 해줄 것이다.

## 로더

> 웹팩은 모든 파일을 모듈로 바라본다. 자바스크립트로 만든 모듈 뿐만아니라 스타일시트, 이미지, 폰트까지도 전부 모듈로 보기 때문에 import 구문을 사용하면 자바스크립트 코드 안으로 가져 올 수 있다. 이것이 가능한 이유는 웹팩의 로더 덕분이다. 로더는 타입스크립트 같은 다른 언어를 자바스크립트 문법으로 변환해 주거나 이미지를 data URL 형식의 문자열로 변환한다. 뿐만 아니라 css 파일을 자바스크립트에서 직접 로딩할 수 있도록 해준다.

<br>

## 커스텀 로더 만들기

```
module.exports = function myWebpackLoader(content) {
  return content.replace("console.log(", "alert(");
};
```

> 모듈은 함수형태로 만들어진다. 읽었던 파일 내용은 그대로 리턴해준다.

웹팩에 로더는 각 파일을 처리하기 위한 것

```
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [path.resolve("./my-webpack-loader.js")],
      },
    ],
  },
```

처리할 파일에 이렇게 정규식표현으로 처리할 파일을 명시해주자

## 자주사용하는 로더

### 1. css-loader

> $npm install css-loader
설치하기
만약 웹팩에서 css 로더를 사용하고 싶다면, 이 파일이 Js로 변환될 때 style-loader도 같이 설치해줘야한다.
> $npm install style-loader

```
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
```

나중에 설치한거를 먼저 불러준다.

### 2. 이미지로더 css-loader

> $npm install file-loader

설치 후에 npm run build를 해주면 dist 폴더안에 들어있는 이미지명이 해시값으로 변경된다. 웹팩은 빌더할 때마다 유니크한 값을 생성하는데 그게 바로 .jpg 확장자 앞에 있는 해시값이다.

```
 {
        test: /\.jpg$/,
        loader: "file-loader",
        options: {
          pubilcPath: "./dist/",
          name: "[name].[ext]?[hash]",
        },
      },
```

index.html 파일로 봤을 때 이미지 경로가 src로 되어있어서 dist에 새로운 해시값으로 변경된 이미지 파일이 브라우저에 안담기는 것이다. 그래서 웹팩 설정을 이렇게 해줘야한다! loader이름을 file-loader로 설정한 후 options에 pubilcPath 설정해준다. **publicPath란 ?** 파일로더가 처리하는 파일을 모듈로 사용했을 때 경로 앞에 추가되는 문자열이다.
아웃풋을 dist로 설정했으니 publicPath도 동일하게 dist로 설정해주자.

**name**이란 옵션은 name: "[name].[ext]?[hash]"을 주는데 이 name 옵션은 파일로더가 아웃풋에 호출 됐을 때 사용하는 것이다. 여기서 [name]은 원본 파일명을 뜻하고 .[ext]는 확장자를 뜻한다. ?[hash] 매번 달라지는 해시값을 이용. (쿼리스트링)

### 3. 여러 이미지 사용시 Data URI

- 사용하는 이미지 갯수가 많다면 네트워크 리소스를 사용하는 부담이 있고 사이트 성능에 영향을 줄 수 있다. 한 페이지에서 작은 이미지를 여러개 사용한다면 Data URI Scheme를 이용하는 방법이 더 낫다.

```
npm install url-loader
```

```
{
        test: /\.(jpg|png|gif|svg)$/,
        loader: "url-loader",
        options: {
          publicPath: "./dist/",
          name: "[name].[ext]?[hash]",
          limit: 20000,
        },
      },
```

만약 jpg 뿐만 아니라 다른 확장자 파일들도 빌드해주고 싶다면 ( ) 소괄호 안에다가 여러 종류의 확장자를 적어준다. | 는 또는 이란 뜻이다.
여기서 (jpg|png|gif|svg)에 | 사이 공백 있으면 안된다. 띄어쓰기 금지! <br>

그리고 limit으로 파일 용량도 설정이 가능하다 20000은 20kb를 의미한다. url-loader가 파일들을 처리할 때 20kb 미만은 url-loader로해서 bath 64로 변환처리를 해준다. 그 이상이면 file-loader로 실행되어 파일을 복사해준다. (20kb보다 크면 dist 폴더에 복사됨!)

---

로더 실습

```
"scripts": {
    "build": "webpack --progress"
  },
```

웹팩환경에 설정해준 "build": "webpack --progress" 이것 중에 progress는 빌드 상태를 커멘드 라인에 표시해주는 옵션이다.

<br>

## 플러그인

클래스로 정의한다. 플러그인 클래스 이름은 보통 대문자로 시작한다.

```
class MyWebpackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("My Plugin", (stats) => {
      console.log("My Plugin: done");
    });
  }
}

module.exports = MyWebpackPlugin;
```

메소드 이름은 apply로 지정했다.

<br>

### [my-webpack-plugin.js] 라는 플러그인 파일 생성

```
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
```

## 자주 사용하는 플러그인

### 1. BannerPlugin

> 결과물에 빌드 정보나 커밋 버전 같은 걸 추가할 수 있다. 배포 했을 때 배포가 잘 됐는지 이를 통해 확인한다.

```
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

```

이렇게 했을 시 dist/main.js에 가면 내가 입력한 주석처리한 내용들이 나타난다.

### 2.DefinePlugin

> 어플리케이션은 개발환경과 운영환경으로 나눠서 운영한다. 환경에 따라 API 서버 주소가 다를 수 있다. 같은 소스 코드를 두 환경에 배포하기 위해서 이런 환경 의존적인 정보를 소스가 아닌 곳에 관리하는 게 좋다. 이러한 환경을 제공하기 위해 DefinePlugin를 제공한다.

### 3.HtmlTemPlatePlugin

> Html 파일을 후처리하는데 사용한다. 빌드 타임의 값을 넣거나 코드를 압축할 수 있다.

```
npm install html-webpack-plugin
```

웹팩의 기본 패키지가 아니라 따로 설치 해주어야한다.
패키지 설치해주고 버전이 안맞는다면 뒤에 @4 이런식으로 버전에 맞춰 설치해준다. 얘를 사용하면 좀 더 유동적으로 html 을 만들어 낼 수 있다. 개발버전 / 운영버전 두 가지로 관리가능

```
  <title>Document <%=env %></title>
```

ejs 문법이다.

```
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
    }),
```

웹팩환경에 HtmlWebpackPlugin를 이렇게 설정해주면, 개발용 일 때는 개발용이라는 문구가 title에 나오고 아닐 시에는 안뜬다.

```
 minify: {
        collapseWhitespace: true, //빈칸 제거
        removeComments: true, //주석 제거
      },
```

minify라는 속성도 있다.

### 4.CleanWebpackPlugin

> 빌드 결과물은 아웃풋 경로에 모이는데 과거 파일이 남아 있을 수 있다. 이전 빌드내용이 덮여 씌여지면 상관 없지만 그렇지 않으면 아웃풋 폴더에 여전히 남아 있을 수 있다. 그래서 이 기능은 빌드 이전 결과물을 제거하는 플러그인이다.

```
npm install html-webpack-plugin
```

이 플러그인은 다른 플러그인과 다르게 <code>const { CleanWebpackPlugin } = require("clean-webpack-plugin");</code> 상단에 이렇게 { } 중괄호를 넣어 가져와야한다. defualt로 export 되어있지 않아서임!

### 4.MiniCssExtractPlugin

> 여러 css를 하나 css로 만들어주는 플러그인이다. 그리고 이 플러그인은 다른 플러그인과 다르게 modules에서 loader도 설정해줘야한다.

```
  module: {
    rules: [
      {
        test: /\.css$/,
        👉🏻 use: [MiniCssExtractPlugin.loader, "css-loader"],
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
    ],
  },
```

## 정리

```
🐥 BannerPlugin : 번들링 된 결과물 상단에다가 빌드 정보를 추가하는 역할이다. 잘 배포 되었는지 확인해보는 용도

🐥 DefinePlugin : API 서버 주소를 넣음 좋다.

🐥 HtmlTemplatePlugin : 이 플러그인은 동적으로 생성되는 자바스크립트와 css 그리고 빌드 타임에 결정되는 값들을 템플릿 파일에 넣어서 html파일을 동적으로 만들어낸다.

🐥 CleanWebpackPlugin : src경로에 있던 파일들을 빌드하면 dist폴더에 남는다. 근데 src 폴더에 있는 파일을 삭제해도 dist폴더에 남아있다. 그래서 얘는 src폴더와 dist폴더에 있는 값들이 비례하게 빌드할 때마다 dist에 남아있는 파일이나 폴더들을 제거해주는 역할이다.

🐥 MiniCssExtractPlugin : 번들된 자바스크립트 파일에서 css만 따로 뽑아내서 css파일만 만들어 내는 플러그인이다.
```
