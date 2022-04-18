;(function(){
    function Add<T>(a: T): T {
        return a
    }
    const res = Add<number>(1)
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