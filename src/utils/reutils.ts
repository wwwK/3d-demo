/****************************************************************/
// 04-21
// 1. 手写实现EventBus
// 核心实现 emit分发事件，on监听事件
// class EventBus {
//   constructor () {
//     this.msgList = {}
//   }

//   private msgList: { [prop: string]: Function[] } = {}

//   public on (name: string, fun: Function) {
//     if (this.msgList.hasOwnProperty(name)) {
//       this.msgList[name].push(fun)
//     } else {
//       this.msgList[name] = [fun]
//     }
//   }

//   public emit (name: string, data: any) {
//     if (!this.msgList.hasOwnProperty(name)) {
//       return
//     }
//     this.msgList[name].forEach(fun => {
//       fun(data)
//     })
//   }

//   public off (name: string) {
//     if (this.msgList.hasOwnProperty(name)) {
//       delete this.msgList[name]
//     }
//   }
// }

// // 2. 装饰者模式
// // 用于加强一个对象的描述，不改变对象自身
// class Luban {
//   fire () {
//     console.log('基础伤害')
//   }
// }
// class FirstSkill {
//   constructor (luban: any) {
//     this.luban = luban
//   }

//   private luban!: any

//   fire () {
//     this.luban.fire()
//     console.log('发射手雷')
//   }
// }
// const luban1 = new Luban()
// const luban2 = new FirstSkill(luban1)
// luban2.fire()

// Function.prototype.before = function (beforeFn: Function) {
//   let _this = this
//   return function () {
//     beforeFn.apply(this, arguments)
//     return _this.apply(this, arguments)
//   }
// }
// // 使用
// window.onload = function () {
//   console.log('页面加载')
// }
// window.onload = window.onload.before(() => {
//   console.log('onload 触发前执行')
// })

// 3. js设计模式，js单例设计模式
// 在函数Function的原型链上进行装饰拓展

// ### 单利模式核心思想：
// 限制类实例化次数只能一次，一个类只有一个实例，并提供一个访问它的全局访问点。
/****************************************************************/

/****************************************************************/
// 04-22
// 1. 什么是纯函数，使用纯函数有什么好处
/****************************************************************/
