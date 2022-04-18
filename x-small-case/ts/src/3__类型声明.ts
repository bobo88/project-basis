/**
 * 1. 变量的类型声明：
 * 2. 函数的参数类型声明：
 * 3. 函数的返回值类型声明：
 * 
 * 注意： 要小写
 */
;(function(){
    let str: string = 'abc'
    let num: number = 124

    function Test (a: number, b: number): number {
        return a + b
    }

    Test(1, 5);
})()
