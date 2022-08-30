;(function(){
    class Dog {
        name: string;
        age: number;
        constructor(name: string, age: number) {
            this.name = name;
            this.age = age;
        }
    }

    let dog1 = new Dog('小黑', 4);
    let dog2 = new Dog('旺财', 3);
    console.log(dog1, dog2)

    // extends 继承
    abstract class Person {
        name: string;
        age: number;
        addr: string;

        constructor(name: string, age: number, addr: string) {
            this.name = name;
            this.age = age;
            this.addr = addr;
        }
        
        sayHello (msg: string) {
            console.log(`${this.name} say ${msg}`)
        }
    }
    class Student extends Person {
        school: string;

        constructor(name: string, age: number, addr: string, school: string) {
            super(name, age, addr);
            this.school = school;
        }
    }

    let s1 = new Student('Bob', 20, 'SZ', 'Uni');
    console.log(s1);
    console.log(s1.sayHello('你好'))

    // let p1 = new Person('xx', 10, 'xxx') // 报错： 抽象类，不能直接实例化

})()