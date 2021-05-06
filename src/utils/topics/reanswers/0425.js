// 04-25
// 1. 编写一个方法，该方法接收两个参数，分别为 k 和 一个无序的纯数字数组。
// 该方法在执行后，会返回数组中第 k 大的数字。特别注意，如果数组中，有两位数值一样的数字，
// 同数值数字排名并列。如 [3,1,3,2,5,4,5] 中，第 1 大的数字为 5，第2大的数字为 4，第5大的数字为 1？
function getNum (k, arr) {
  const sortArr = arr.sort((a, b) => b - a)
  const set = new Set(sortArr)
  const newArr = Array.from(set)
  if (!newArr[k - 1]) {
    console.log('错误')
    return -1
  }
  return newArr[k - 1]
}

// 2. __proto__与prototype之间有什么关系
// __proto与prototype是一个东西，指向同一个地址
// prototype是一个对象，__proto__是实例化对象上指向构造函数prototype的指针
// 所以  MyFn.prototype === new MyFn().__proto__

// 3. call, apply, bind方法有什么区别，并手写实现bind
// 这些方法都是用来改变函数执行时的上下文，也就是函数里的this
// call(thisObj, p1, p2, ....)   apply(thisObj, [p1, p2, ...])  bind(thisObj)(p1, p2, ...)
if (!Function.prototype.bind) {
  (function () {
    const slice = Array.prototype.slice
    Function.prototype.bind = function (...args) {
      const thatFunc = this
      const context = args[0]
      const params = slice.call(args, 1)
      if (typeof thatFunc !== 'function') {
        throw new Error('not Function')
      }
      return function () {
        const funcArgs = params.concat(slice.call(args))
        return thatFunc.apply(context, funcArgs)
      }
    }
  })()
}
