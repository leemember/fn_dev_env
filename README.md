# FN 개발환경의 이해와 실습

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

---

# 바벨

크로스브라우징의 혼란을 해결해 줄 수 있는 것이 바벨이다. 모든 브라우저에서 동작하도록 호환성을 지켜준다. 타입스크립트, JSX처럼 다른 언어로 분류되는 것도 포함한다.

## 설치 및 기본동작

```
$npm install @babel/core @babel/cli
```

@babel/cli 는 바벨 터미널을 사용하기 위해 설치한다. 바벨을 실행할 때는 <code>npx babel app.js</code> 입력해서 실행하면 된다.

### 바벨은 세 단계로 빌드를 진행됩니다.

1. 파싱 : 분해하는 과정이라고 보면 됩니다.
   > const alert = (msg) => window.alert(msg); 이 코드를 봤을 때 const라는 토큰, alert 라는 토큰 이렇게 분해해서 봅니다.
2. 변환 : es6 를 es5로 변환해주고
3. 출력

마무리로는 출력해준다.

## 커스텀 플러그인

> 바벨에 변환을 담당하는 녀석임 ㅎ
> 커스텀 플러그인을 실행시켜보려면 터미널 창에 <code>npx babel app.js --plugins './my-babel-plugin.js'</code>를 입력해주면 된다. 그럼 결과물은 똑같이 원본 코드랑 같지만 터미널 창에 로그가 찍힌 것을 확인 할 수 있다.

```
Identifier() name: alert
Identifier() name: msg
Identifier() name: window
Identifier() name: alert
Identifier() name: msg
const alert = msg => window.alert(msg);
```

만약 원본코드에 <code>path.node.name = name.split("").reverse().join("");</code> 이렇게 작성한다면 터미널창에는 **const trela = gsm => wodniw.trela(gsm);** 이런식으로 출력된다. 코드를 풀이하자면 path에 담긴 node중 name을 (split) 쪼개고 (reverse) 뒤집고 (join) 합치기

```
//바벨 커스텀 플러그인 입니다.
module.exports = function myBabelPlugin() {
  return {
    visitor: {
      VariableDeclaration(path) {
        console.log("VariableDeclaration() kind", path.node.kind); //const

        //const라는 값은 var로 이 플러그인이 변환 해주도록 es6 => es5 문법으로 !
        if (path.node.kind === "const") {
          path.node.kind = "var";
        }
      },
    },
  };
};

/**
 *
 * 결과물 👇🏻
 * VariableDeclaration() kind const
 * var alert = msg => window.alert(msg);
 */

```

## 플러그인 사용

### 😃 block-scoping

위에 같은 const => var 는 우리가 커스텀 한 것이고 es6 => es5 문법으로 결과를 만들어 주는 것이 <code>block-scoping</code> 플러그인이다. const, let 처럼 블록 스코핑을 따르는 예약어를 함수 스코핑을 사용하는 var로 변경해준다.

```
$npm install -D @babel/plugin-transform-block-scoping
```

<code>npx babel app.js --plugins @babel/plugin-transform-block-scoping</code> 를 터미널창에 입력하면
`var alert = msg => window.alert(msg);` 이렇게 출력된다.

### 😃 transform-arrow-functions

`var alert = msg => window.alert(msg);` var는 브라우저 ie가 인식하는데 => 이 arrow 화살표 함수는 브라우저가 인식하지 못한다. 이거를 또 변환 시켜주는 플러그인을 알아보자.

```
$npm install -D @babel/plugin-transform-arrow-functions
```

이 플러그인까지 다 설치됐다면
<code>npx babel app.js --plugins @babel/plugin-transform-block-scoping --plugins @babel/plugin-transform-arrow-functions</code>
를 터미널창에 입력해서 결과물을 확인해보면

```
var alert = function (msg) {
  return window.alert(msg);
};
```

이렇게 arrow 함수가 사라지고 es5 문법으로 변환된 것을 볼 수 있다.
<br>

### 😃 strict-mode

```
$npm install @babel/plugin-transform-strict-mode
```

안전하게 작업하려면 엄격모드를 사용해야한다. 'use strict' 구문을 추가해야 하므로 <code>strict-mode</code> 플러그인 설치해보자. 그리고 위에서 추가한 플러그인까지 모두 npx로 실행해보자.
<code>npx babel app.js --plugins @babel/plugin-transform-block-scoping --plugins @babel/plugin-transform-arrow-functions</code>

```
👉🏻 "use strict";

var alert = function (msg) {
  return window.alert(msg);
};
```

이렇게 use strict가 찍히면서 엄격모드로 변환된 것이 나타난다 !
그리고 <code>npx babel app.js --plugins @babel/plugin-transform-block-scoping --plugins @babel/plugin-transform-arrow-functions</code> 이렇게 커맨드라인 명령어가 점점 길어지기 때문에 설정 파일로 분리하는 것이 좋을 거 같다. 이것도 웹팩 webpack.config 를 기본 설정파일로 사용하듯 바벨도 babel.config.js를 사용한다.

```
📚 [babel.config.js] 파일 코드입니다.

module.exports = {
  plugins: [
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-strict-mode",
  ],
};
```

바벨 기본 설정파일을 만들어서 설치한 플러그인들을 담아두면 커멘드 창에 <code>npx babel app.js</code> 만 입력해도 알아서 전부 동작된다.

## 프리셋

목적에 맞게 여러가지 플러그인을 세트로 모아놓은 것을 프리셋이라고 한다.

### 커스텀 프리셋

[my-babel-preset.js] 라는 파일을 만들어서 여기에 설치했던 플러그인들을 담아놓는다.

```
module.exports = function myBabelPreset() {
  return {
    Plugins: [
      "@babel/plugin-transform-block-scoping",
      "@babel/plugin-transform-arrow-functions",
      "@babel/plugin-transform-strict-mode",
    ],
  };
};

```

그리고 기존에 [babel.config.js] 파일에는

```
module.exports = {
  presets: ["./my-babel-preset.js"],
};
```

my-babel-preset.js를 프리셋 해준다. 그러면 프리셋에 있는 모든 플러그인들이 실행된다.

## 마무리

사실 이렇게 바벨을 사용하는 것은 실무에서는 잘 쓰지 않는다. 그냥 바벨을 좀 더 이해하기 위한 시행이다.

---

## 바벨 웹팩 실무

### 프리셋 사용하기

- preset-env : 이크마스크립트2015+ 를 변환할 때 사용한다. (인터넷 익스플로러 지원하려면 es5 사용해야 돼서 변환이 필요하다.)
  > babel-reset-ex2015~latest까지 지금은 env 하나로 합쳐졌다.
- preset-flow, preset-react, preset-typescript 는 flow, 리액트, ts를 변환하기 위한 프리셋이다.

```
$npm install -D @babel/preset-env
```

### 타겟 브라우저

특정 브라우저에 지원하는 코드를 말한다. target 옵션에 브라우저 버전명만 지정하면 env 프리셋은 이에 맞는 플러그인들을 찾아 최적의 코드를 출력해 낸다.

> https://caniuse.com/

특정 기능들을 브라우저에서 지원 해주는지 보려면 caniuse 라는 사이트에서 검색함 된다.

```
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "79",
          ie: "11",
        },
      },
    ],
  ],
};
```

이렇게 target에다가 브라우저를 지정한다. 그리고 커맨드 창에 명령어를 입력했을 때

```
👉🏻 타겟 지정 해주기 전
ihyeonjuui-MacBookAir:fn_dev_env leehyunju$ npx babel app.js
"use strict";

const alert = msg => window.alert(msg);

👉🏻 타겟 지정 해준 후
ihyeonjuui-MacBookAir:fn_dev_env leehyunju$ npx babel app.js
"use strict";

var alert = function alert(msg) {
  return window.alert(msg);
};
```

바로 const에서 var로 변환된 것을 확인 할 수 있다. 이렇게 블록 스코핑을 함수 스코핑으로 그리고 화살표 함수도 일반 함수로 대체할 수 있지만, Promise는 es5 함수 스코핑으로 대체할 수 없다 ! 근데 es5버전으로 구현할 수는 있다.

이걸 구현해주는 것이 바로

### 폴리필

```
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "79",
          ie: "11",
        },
        👉🏻 useBuiltIns: "usage", // 폴리필 사용 방식 지정 'entry' , false
        👉🏻 corejs: {
          // 폴리필 버전 지정
          version: 2, // 최신버전은 3이지만 문서에는 2라서 2라함
        },
      },
    ],
  ],
};
```

바벨 기본환경에 폴리필을 설정한 뒤에 <code>npx babel app.js</code> 을 실행시켜보면

```
"use strict";

require("core-js/modules/es6.object.to-string.js");

require("core-js/modules/es6.promise.js");

new Promise();
```

이런 커맨드가 뜨는데 core-js 모듈에 새롭게 생성되었다는 뜻이다.

## 웹팩으로 통합

실무환경에서는 바벨을 직접 터미널에서 빌드하여 사용하는 것보다 웹팩을 통합해서 사용하는 것이 일반적이다. babel-loader로 제공해준다. (위에 내용처럼 안해도 되고 그냥 babel-loader 하나 설치해주고 웹팩 설정환경에 넣어주고 번들링해주면 된다.)

```
$npm i -D babel-loader
```

그리고 웹팩 환경 설정 파일에 바벨 로더를 추가해준다.

```
{
        //js관련 파일들은 바벨 로더 동작시키기
        test: /\.js$/,
        loader: "babel-loader",
        //node_modules 바벨로더 처리 안되게 제외시키기 (exclude)
        exclude: "/node_modules/",
      },
```

이렇게 하고 <code>npm run build</code> 시키면
Module not found: Error: Can't resolve 'core-js/modules/es6.object.to-string.js' in '/Users/leehyunju/Documents/React/fn_dev_env'
@ ./app.js 1:0-49 이런 에러가 뜬다. 이건 core-js라는 모듈을 찾을 수 없다는 것이고 core-js를 설치해주면 된다.

```
npm i core-js@2
```

특정 버전을 설치해주고 싶으면 @골뱅이 뒤에 버전 수 적기

## 마무리

바벨은 다양한 브라우저에서 돌아가는 어플리케이션을 만들기 위한 도구다 (크롬은 거의 es6를 읽어내지만 인터넷 익스플로어에서는 지원하지 않아서 이전 버전 함수로 변환해준다고 보면 된다.) 그리고 바벨의 코어는 파싱과 출력만 담당하고 변환 작업은 플러그인이 처리한다. 여러개 플러그인을 모아놓은 세트를 **프리셋**이라 하고, 환경은 env 프리셋을 사용한다. 바벨이 변환하지 못하는 코드는 폴리필이라 부르는 코드조각을 불러와 결과물을 로딩해서 해결한다. babel-loader로 웹팩과 함께 사용하면 훨씬 단순하고 자동화된 프론트엔드 개발환경을 갖출 수 있다.

---

# SCSS

```
npm install sass-loader node-sass webpack --save-dev
```

- sass-loader : 웹팩에서 sass파일을 만나면 node-sass를 내부적으로 돌려주는 역할을 한다
- node-sass : scss 를 css로 변환해준다.

```
module: {
   rules: [
     {
       test: /\.s[ac]ss$/i, // sass,scss,css
       use: ["style-loader", "css-loader", "sass-loader"],
     },
     (...)
```

- sass-loader : 컴파일 sass to css
- css-loader : css를 CommonJS로 변환
- style-loader : html에 style로 만들어준다

---

# 린트 init

비유하자면 코드에 작은 보푸라기들을 제거해주는 역할이다. 예를 들어 세미콜론(;)이 없어서 또는 쉼표(,)가 없어서 이런 사소한 것들로부터 타입에러가 발생하는 것을 예방 해준다.

## ESlint

린트중에 가장 많이 사용하는 것 ! 이거에 역할은

- 포맷팅 : 들여쓰기, 글자 수 제한등등
- 코드 품질 : 코드가 오류가 가지고 있다면 그것을 체크해준다.

```
$npm i eslint
```

그리고 [.eslintrc.js] 파일을 만든다. 그리고 **Rules를** 설정해 주어야 코드들을 검사해줄 수 있다.

> https://eslint.org/docs/rules/

```
👉🏻 [.eslintrc.js]

module.exports = {
  rules: {
    "no-unexpected-multiline": "error",
  },
};

```

이렇게 설정해주고 일부러 app.js 파일에

```
console.log()(;function () {})();
```

세미콜론을 function 앞에 넣어 틀려보았다.

<img width="536" alt="스크린샷 2021-04-13 오후 7 26 54" src="https://user-images.githubusercontent.com/71499150/114538528-73fa3a80-9c8e-11eb-86c6-2871cf011a16.png">

그러면 <code>error Parsing error: Unexpected token ;</code> 이렇게 에러를 찾아내준다. 만약 eslint 환경 설정을 안해주면

<img width="536" alt="스크린샷 2021-04-13 오후 7 27 09" src="https://user-images.githubusercontent.com/71499150/114538431-5a58f300-9c8e-11eb-898b-ca2f65ab86af.png">

이렇게 문제만 생겼다고 뜨지, 자세하게 어떤 부분으로 인해 오류가 났는지는 안알려준다.

### eslint 추천 규칙(Rules)

```
module.exports = {
  extends: ["eslint:recommended"],
  rules: {
    "no-unexpected-multiline": "error",
    "no-extra-semi": "error",
  },
};
```

- extends: ["eslint:recommended"], : 🔧이 아이콘이 있는 규칙들은 문제가 생기면 자동으로 수정해준다.
- "no-unexpected-multiline": "error" : (()) 이런거 살펴준다.
- "no-extra-semi": "error" : 세미콜론으로 인한 에러들을 잡아내준다.

### eslint 초기화

<code>npx eslint --init</code> 을 커멘드창에 입력하면

<img width="904" alt="스크린샷 2021-04-13 오후 7 43 40" src="https://user-images.githubusercontent.com/71499150/114540547-a3aa4200-9c90-11eb-90fa-554cc3361381.png">

나에게 질문을 던져줌 그리고 내 작업환경으로 맞춰 엔터하면

<img width="375" alt="스크린샷 2021-04-13 오후 7 44 08" src="https://user-images.githubusercontent.com/71499150/114540592-aefd6d80-9c90-11eb-997a-689f08866686.png">

eslintrc.js 파일에 환경이 세팅되어있는 모습을 확인 할 수 있다.

<img width="224" alt="스크린샷 2021-04-13 오후 7 54 57" src="https://user-images.githubusercontent.com/71499150/114541966-516a2080-9c92-11eb-9225-856cd0906031.png">

이건 package.json 에서 script 부분에 lint를 추가해줬다. 실행하고 싶으면 <code>npm run eslint</code>를 하면된다. 그리고 src는 src 폴더에 있는 모든 파일들을 검사해주는 것이고 --fix는 자동으로 오류들을 고쳐주는 명령어다.

<img width="663" alt="스크린샷 2021-04-13 오후 7 55 09" src="https://user-images.githubusercontent.com/71499150/114542253-aad24f80-9c92-11eb-8576-4683ace499e5.png">

eslint를 실행해보니 위에같은 오류들이 나타났는데 여기서
<code>10:7 warning 'foo' is assigned a value but never used @typescript-eslint/no-unused-vars</code> 이 에러는 사용하지 않는 변수라 코드품질에 좋지 않다는 뜻이다.

---

## Prettier

> 코드를 더 예쁘게 해주고 코드 품질을 담당한다. eslint의 formating 부분을 좀 더 강화한 버전이다. 그리고 eslint가 고쳐줄 수 없는 부분들도 자동으로 고쳐준다.

```
$npm i prettier
```

## Prettier + eslint 통합방법

```
$npm i eslint-config-prettier
```

프리티어는 eslint와 통합하는 것을 제공한다. 규칙이 충돌되면 안되어서 이런 것을 방지해주기 위해 나온 것이 eslint-config-prettier 이다.

```
 extends: [
    "eslint:recommended",
👉🏻 "eslint-config-prettier",
    (...)
```

추가해주자! 그럼 eslint와 겹치는 규칙들은 off 시켜 충돌 방지한다. 그리고 이것들을 실행시킬 때는 커맨드 창에 eslint 따로 prettier 따로 run 해줘야하는데, 한 번에 돌려주는 플러그인이 존재한다.

```
$npm i eslint-plugin-prettier
```

바로 이거다.

```
👉🏻[.eslintrc.js]

 plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error", // 규칙을 위반하면 에러를 반환하도록
  },
```

이렇게 플러그인이랑 규칙들을 설정해조야함

```
  extends: [
    "eslint:recommended",
    "eslint-config-prettier",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
```
extends 부분에다가도 <code>"plugin:prettier/recommended",</code> 추가해주기