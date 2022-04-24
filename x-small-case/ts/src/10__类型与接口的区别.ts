;(function(){
    // 1. 拓展方式的区别
    interface Animal {
        name: string
    }
    interface Bear extends Animal {
        honey: boolean
    }
    // 实例
    const bear: Bear = {
        name: 'vivi',
        honey: true
    }
    console.log('bear: ', bear)

    type Person = {
        name: string
    }
    type School = {
        age: number
    }
    type Student = Person & School
    // 实例
    const s1: Student = {
        name: 'xiaoming',
        age: 10
    }
    console.log('s1: ', s1)
    console.log('----------------------------------------------')

    // 2. 向现有的类型添加字段
    interface MyGlobal {
        name: string
    }
    interface MyGlobal {
        age: number,
        addr: string
    }
    const my: MyGlobal = {
        name: 'Bob',
        age: 18,
        addr: 'SZ'
    }
    // type 不能同名拓展


})()