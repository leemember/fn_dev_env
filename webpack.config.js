const path =  require('path');

module.exports = {
  //모드는 개발용
  mode: 'development',
  //시작점
  entry: {
    main : './src/app.js',
    main2 : './src/app2.js',
  },
  //path: 아웃풋 디렉토리명을 입력한다. (절대경로)
  output: {
    //노드의 path모듈을 가져와서 이렇게 절대경로를 선정해준다.
    path: path.resolve('./dist'),
    //번들링 될 파일명을 입력한다.
    filename : '[name].js'
    //왜 이런식으로 했냐면 entry가 여러개일수도 있다.그래서 동적으로 파일들을 여러개 생성되게 하려고 이런식으로 아웃풋을 지정했다.
  }
}