// 1. 防抖和节流
// 防抖  在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。
// 节流  规定在一个单位时间内，只能触发一次函数
function debounce (fun, delay) {
  return function (args) {
    const that = this
    const _args = args
    clearTimeout(fun.id)
    fun.id = setTimeout(function () {
      fun.call(that, _args)
    }, delay)
  }
}

function throttle (fun, delay) {
  let last, deferTimer
  return function (...args) {
    const that = this
    const _args = args
    const now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fun.apply(that, _args)
      }, delay)
    } else {
      last = now
      fun.apply(that, _args)
    }
  }
}

// 2. XSS攻击
// 通过js脚本注入进行攻击
// 可以通过过滤用户输入的文本进行防范

// 3. 禁止js读取cookie
//
