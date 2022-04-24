;(function(){
   // 通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。

   // 类型断言有两种形式。 其一是“尖括号”语法：
   let someVal: any = 'xxxx'
   let strLen: number = (<string>someVal).length

   // 另一个为as语法
   let strVal: any = 'yyyy'
   let strLength: number = (strVal as string).length

   // 注意： 当你在TypeScript里使用JSX时，只有 as语法断言是被允许的。



})()