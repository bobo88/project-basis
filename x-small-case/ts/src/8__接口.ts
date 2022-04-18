;(function(){
    type myType = {
        name: string,
        age: number
    }

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

    // 定义类时，可以使类去实现一个接口
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