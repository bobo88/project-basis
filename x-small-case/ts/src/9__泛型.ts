;(function(){
    // 泛型约束

    function Add<T extends number>(a: T, b: T): number {
        return a + b
    }
    const res = Add(1, 3)
    console.log(res)

    class MyClass<T> {
        name: T;
        constructor(name: T) {
            this.name = name;
        }
    }
    let p = new MyClass('Bob');
    console.log(p)

})()