// 外部枚举
declare const enum Direction2 {
    Down = 1,
    Up,
    Left,
    Right
}
// 普通枚举
enum Direction {
    Down = 1,
    Up,
    Left,
    Right
}
;(function(){
    console.log(Direction.Left) // 3

    console.log(Direction2.Left) // 3
 
 
 })()