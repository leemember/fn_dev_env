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
