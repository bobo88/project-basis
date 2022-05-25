
;(function(){
    // 类型防护 守卫
    // typeof 
    // 真值缩小：条件、 &&、 ||、 if语句、 布尔否定(!)
    // 等值缩小： ===、 ==、 !==、 !=
    // in 操作符缩小
    // instanceof 操作符缩小： x instanceof Foo
    // 分配缩小： let x = Math.random() < 0.5 ? 10 : 'Hello'   // let x: string | number
    // 控制流分析
    // 使用类型谓词
    console.log(Direction.Left) // 3

    console.log(Direction2.Left) // 3
 })()