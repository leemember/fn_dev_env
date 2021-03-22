//가져올 때는 import 키워드를 통해 가져온다.
// 모든 export를 math로 가져올 수도 있고, "sum만" 가져올 수도 있다.
import * as math from './math.js'
// import { sum } from './math.js'

console.log(math.sum(1, 2));