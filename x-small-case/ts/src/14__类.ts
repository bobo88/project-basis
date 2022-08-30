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

    abstract class Department {
        constructor(public name: string) {
        }
        printName(): void {
            console.log('Department name: ' + this.name);
        }
        abstract printMeeting(): void; // 必须在派生类中实现
    }
    
    class AccountingDepartment extends Department {
        constructor() {
            super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
        }
        printMeeting(): void {
            console.log('The Accounting Department meets each Monday at 10am.');
        }
        generateReports(): void {
            console.log('Generating accounting reports...');
        }
    }

    let department: Department; // 允许创建一个对抽象类型的引用
    // department = new Department(); // 错误: 不能创建一个抽象类的实例
    department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
    department.printName();
    department.printMeeting();
    // department.generateReports(); // 错误: 方法在声明的抽象类中不存在

 })()