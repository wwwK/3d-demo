// 04-22
// 1. 什么事纯函数，使用纯韩式有什么好处
// 纯函数
// 返回的结果只依赖其参数，并且执行过程中无副作用
// 副作用：函数执行的过程中对外部产生了可观察的变化
// 纯函数是对给定的输入返还相同输出的函数
// 好处:
// 1. 可以产生测试代码
// 2. 可读性更强
// 3. 可缓存
function memoize (fn) {
  const cache = []
  return function () {
    cache.push(fn.apply(this, arguments))
    return cache
  }
}

const sum = memoize(function (a, b) {
  return a + b
})
console.log(sum(1, 2))
console.log(sum(1, 2))
console.log(sum(1, 2))
// 4. 易于组合，纯函数可以通过组合以及管道组合出更为复杂的功能

// 2. 实现add(1)(2)(3)
// 函数柯里化，把接受多个参数的函数转变为接受一个单一参数，并且返回接受余下参数且返回结果的新函数的技术
function add (a) {
  return function (b) {
    return function (c) {
      return a + b + c
    }
  }
}
console.log(add(1)(2)(3)) // 6
// 参数复用
function curringCheck (reg) {
  return function (text) {
    return reg.test(text)
  }
}
const hasNumber = curringCheck(/\d+/g)
const hasLetter = curringCheck(/[a-z]+/g)

hasNumber('test1') // true
hasNumber('sydjshjdh') // false
hasLetter('1233333') // false

// 通用柯里化函数

// 3. 函数式编程里的compose，并实现
// compose 的函数作用就是组合函数的，将函数串联起来执行。将多个函数组合起来，一个函数的输出结果是另一个函数的输入参数，一旦第一个函数开始执行，就会像多米诺骨牌一样推导执行了
