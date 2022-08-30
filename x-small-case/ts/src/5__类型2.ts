;(function(){
    // {} 用来指定对象中包含哪些属性
    // 属性名后面加问号：表示该属性 可选
    let a: {name: string, age?: number}
    a = {name: 'Bob'}

    // 仅验证某个或某些属性，其他属性不做限制（propName可以随便定义）
    let b: {name: string, [propName: string]: any} 
    b = {name: 'Bob', age: 22, addr: 'SZ'}

    // 函数参数定义
    let c: (a: number, b: number) => number
    c = (a, b) => a + b
    console.log(c(1, 3))

    // 数组
    let d: number[] = [1, 2, 3, 4]
    let e: Array<string> = ['a', 'b', 'c']

    // 元组：就是固定长度的数组
    let f: [string, string] = ['aa', 'bb']
    let g: [number] = [111]

    // 枚举
    enum Gender {
        Male = 1,
        Female = 0
    }
    let h: {name: string, gender: Gender} = {
        name: 'Bob',
        gender: Gender.Male
    }
    console.log(h.gender === Gender.Male)

    // | 表示 “或”， & 表示 “与”
    let i: string | number;
    i = 'Bob';
    i = 32;
    let j: {name: string} & {age: number} & {[propName: string]: any};
    j = {name: 'Bob', age: 32, addr: 'SZ'}

    // 类型别名
    type myType = 1 | 2 | 3 | 4 | 5;
    let k: myType;
    let l: myType;
})()