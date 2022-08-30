;(function(){
    /**
     * TypeScript的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 
     * 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。
     */

    // readonly vs const
    // 最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 const，若做为属性则使用readonly。
    interface SquareConfig {
        color?: string;
        width?: number;
        [propName: string]: any;
    }
    
    // 可索引的类型

    /**
     * 接口可以在定义类的时候去限制类的结构
     *    接口中的所有属性不能有实际的值
     *    接口只定义对象的结构，而不考虑实际值
     *    在接口中所有的方法都是抽象方法
     */
    interface myInterface {
        _name: string,
        _age: number
    }
    interface myInterface {
        _gender: number
    }
    const p1: myInterface = {
        _name: 'Bob',
        _age: 18,
        _gender: 1
    }
    console.log(p1)

    // 类类型： 定义类时，可以使类去实现一个接口
    class Person implements myInterface {
        _name: string;
        _age: number;
        _gender: number;

        constructor(name: string, age: number, gender: number) {
            this._name = name;
            this._age = age;
            this._gender = gender;
        }
        get name () {
            return this._name
        }
        set name (value: string) {
            this._name = value;
        }
    }
    let p2 = new Person('Bob', 19, 1);
    p2.name = 'BoBo';
    console.log(p2.name)
})()