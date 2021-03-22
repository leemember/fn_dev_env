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
이렇게 각 커뮤니티에서 각자의 스펙을 제안하다가  ES2015에서 표준 모듈 시스템을 내 놓았다. 지금은 바벨과 웹팩을 이용해 모듈 시스템을 사용하는 것이 일반적이다. ES2015 모듈 시스템의 모습을 살펴보자.

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
1. --mode => development, production, none이 있는데 개발환경이냐 운영환경이냐에 따라서  development, production을 설정한다. 
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