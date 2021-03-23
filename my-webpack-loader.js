module.exports = function myWebpackLoader(content) {
  return content.replace("console.log(", "alert(");
};

// 모듈은 함수형태로 만들어진다.
// 읽었던 파일 내용은 그대로 리턴해준다.
