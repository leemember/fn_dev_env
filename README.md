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

바로 const에서 var로 변환된 것을 확인 할 수 있다.
