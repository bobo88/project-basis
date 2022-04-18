;(function(){
    // 使用字面量来进行类型声明
    let a: 10;
    a = 10;

    // 可以使用 ｜ 来连接多个类型（联合类型）
    let sex: 'F' | 'M';
    sex = 'F';
    sex = 'M';

    let c: boolean | string;
    c = true;
    c = 'bob';

    // （不建议使用） any 类型： 表示任意类型，相当于对声明的变量关闭ts类型检测
    let d: any; // 显式声明为any类型
    let e; // 隐式声明为any类型
    d = 10;
    d = true;
    d = 'str';
    e = 11;
    e = true;

    // unknown ： 表示未知类型
    let k: unknown;
    k = 10;
    k = true;
    
    // 注意： any类型可以赋值给其他任何类型，但是 unknown类型不能赋值给其他类型，这是二者的区别。
    // c = d // OK
    // c = k // 报错

    // unknown 类型判断后可以赋值
    if(typeof k === 'boolean') {
        c = k
    }
    // unknown 类型断言
    c = k as boolean;
    c = k as string;

    // void: void用来表示空，以函数为例，就表示没有返回值的函数
    function xx (): void {
        // xx
    }
    // never： 表示永远不会返回结果
    function yy (): never {
        throw new Error('报错了！')
    }

    function fn(num: number) {
        console.log(123)
        if (num > 0) {
            return true
        } else {
            return 123
        }
    }

})()