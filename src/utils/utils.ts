
// 1. 手写实现EventBus
class EventBus {
  constructor () {
    this.eventList = []
  }

  private eventList!: string[]

  public emit (eventClass: string, argument2s: any[]) {
    argument2s[0] = 11
  }
}

export const getKeyData = (key: number, array: number[]) => {
  const sortObj: { [prop: number]: number } = {}
  array.sort((a, b) => a - b)
  let k = 1
  sortObj[1] = array[0]
  array.forEach(n => {
    if (sortObj[k] !== n) {
      k = k + 1
      sortObj[k] = n
    }
  })
  return sortObj[key] || -1
}

// 2021-04-27
// 1. Promise.allSettled的了解与实现
// 返回一个在所有给定的promise都已经fulfilled或rejected后的promise，并带有一个对象数组，每个对象表示对应的promise结果。
// Promise.prototype.allFunc = (promises: Promise<any>[]) => {
//   const promiseLength = promises.length
//   let count = 0
//   let result: any[] = []
//   return new Promise(resolve => {
//     promises.forEach(func => {
//       func.then(res => {
//         count ++
//         result.push(res)
//         if (count === promiseLength) {
//           resolve(result)
//         }
//       }, err => {
//         count ++
//         result.push(err)
//         if (count === promiseLength) {
//           resolve(result)
//         }
//       }).catch(err => {
//         count ++
//         result.push(err)
//         if (count === promiseLength) {
//           resolve(result)
//         }
//       })
//     })
//   })
// }
// 2. 什么是同步，什么是异步
// 同步：开始后进程阻塞，执行结束后才能继续进行下一项事件的执行
// 异步：开始后不影响其他事件的继续执行操作

// 3. 宏任务与微任务
// 讲不清 T T

// 2021-04-28
// 1. vue组件种的通信方法
/**
 * 1. prop
 * 2. vuex
 * 3. inject,provide
 * 4. eventBus
 * 5. $attrs,$listener
 */

// 2. v-show与v-if的区别
// v-show是显隐，v-if是控制组件是否渲染

// 3. keep-alive组件
// keep-alive可对组件进行保活，不会进行销毁
