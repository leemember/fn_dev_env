//바벨 커스텀 플러그인 입니다.
module.exports = function myBabelPlugin() {
  return {
    visitor: {
      //path라는 객체를 받게된다.
      Identifier(path) {
        const name = path.node.name;

        // 바벨이 만든 ast  노드 출력
        console.log("Identifier() name:", name);

        // 변환작업 : 코드 문자열을 역순으로 변환한다.
        //path에 담긴 node중 name을 (split) 쪼개고 (reverse) 뒤집고 (join) 합치기
        path.node.name = name.split("").reverse().join("");
      },
    },
  };
};
