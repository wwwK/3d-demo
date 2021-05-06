// 04-23
// 1. js中的基本数据类型，介绍一下js的包装对象
// 基础数据类型  引用数据类型
// 基础数据类型  undefined null boolean number string symbol bigInt
// 引用数据类型 object
// 内置对象 Boolean String Number Array Function Date Math Object RegExp
// 包装对象  以上的 Boolean String Number

// 2. 如何判断this
// 2-1 事件调用，谁触发的事件，函数里的this指向的就是谁
// 2-2 全局环境，没有任何函数包裹的情况
// 直接打印获得的是window  一个js模块化的文件中打印的是导出的对象
// 2-3 函数内部
// 普通函数里，指向的是window，在严格模式下，为undefined
// 对象里面的函数：
const obj = {
  b: {
    fn: function () {
      console.log(this)
    }
  }
}
const fn = obj.b.fn
obj.b.fn() // 指向 obj.b
fn() // 指向 window
// 构造函数里
// 指向的是实例化对象
// 如果构造函数里有return，return的值是个对象，则指向return的值，否则按照规则

// 3. 如何中断ajax请求
// 对于原生的XHR来说，使用abort方法可以取消ajax请求
