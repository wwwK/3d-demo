// 04-21
// 1. 手写实现EventBus
// 核心实现 emit分发事件，on监听事件
class EventBus {
  constructor () {
    this.msgList = {}
  }

  private msgList!: { [prop: string]: Function[] }

  public on (name: string, fun: Function) {
    if (this.msgList.hasOwnProperty(name)) {
      this.msgList[name].push(fun)
    } else {
      this.msgList[name] = [fun]
    }
  }

  public emit (name: string, data: any) {
    if (!this.msgList.hasOwnProperty(name)) {
      return
    }
    this.msgList[name].forEach(fun => {
      fun(data)
    })
  }

  public off (name: string) {
    if (this.msgList.hasOwnProperty(name)) {
      delete this.msgList[name]
    }
  }
}
