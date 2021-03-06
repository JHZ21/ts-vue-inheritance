import { LinkElement } from "./interface"

// 寻找左数组与右数组不同的值
export function leftArrayDiff<T>(
  leftArr: T[],
  rightArr: T[],
  sameFnc?: (a: any, b: any) => boolean
): T[] {
  return leftArr.filter(leftItem => {
    return !rightArr.some(rightItem =>
      sameFnc ? sameFnc(leftItem, rightItem) : leftItem === rightItem
    )
  })
}

export function isDef(data: any): boolean {
  return data !== undefined && data !== null
}

export function isUndef(data: any): boolean {
  return !isDef(data)
}

// 纯函数
export const hasPermission = (value: string[], roles: string[]): boolean => {
  let permission: boolean = false
  if (value && value instanceof Array && value.length > 0) {
    const permissionRoles: string[] = value
    permission = roles.some(role => {
      return permissionRoles.includes(role)
    })
  }
  return permission
}

export function resSuccess(res: any): boolean {
  return res && res.data && res.data.code === 200
}

export function vaild_local(data: any, max_minute: number = 30): boolean {
  // max_minute = 0
  let is_vail: boolean = false
  let now_time = new Date().getTime()
  let storage_time: number
  if (data && (storage_time = (data as any)._time)) {
    is_vail = storage_time + max_minute * 60e3 > now_time
  }
  return is_vail
}

export function props_not_empty(obj: any): boolean {
  return Object.keys(obj).every(key => {
    let val: any = obj[key]
    return !!val || val === false
  })
}

export function deep_copy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function id_random(): number {
  return Math.floor(Math.random() * 10e4)
}

// 返回一个function ，可以生成func函数结果组成的随机长度数组
export function funcOfRepeatFunc(n: number, m: number, func: any): any {
  if (m === undefined) {
    m = n
  }
  return function() {
    const return_val: any[] = []
    let num = Math.floor(Math.random() * (m - n)) + n
    for (; num--; ) {
      return_val.push(func())
    }
    return return_val
  }
}

// 封装指定长度范围的 funcOfRepeatFunc
export function reapeatNToM(n: number, m?: number) {
  return partial(funcOfRepeatFunc, n, m)
}

// set fontSize of html
export function setHtmlFontSize() {
  document.addEventListener("DOMContentLoaded", () => {
    // 获取html元素
    const html: HTMLHtmlElement | null = document.querySelector("html")
    // 根据屏幕宽度动态计算fontSize
    let fontSize: number = window.innerWidth / 10
    // 当fontSize大于50时，设置最大值为50
    fontSize = fontSize > 50 ? 50 : fontSize
    // 设置html的fontSize属性，使rem生效，1rem = fontSize + 'px'
    html && (html.style.fontSize = fontSize + "px")
  })
}

// return fromat: yyyy/mm/dd
export function timeStampToTargetFormat(timeStamp: number): string {
  const dateObj = new Date(timeStamp)
  const return_str: string = `${dateObj.getFullYear()}/${dateObj.getMonth() +
    1}/${dateObj.getDate()}`
  return return_str
}

export function partial(...args: any) {
  if (args.length > 1) {
    const new_args: any[] = [].slice.call(args, 1)
    return function(...add_args: any) {
      return args[0](...new_args, ...add_args)
    }
  }
}
export function pipe(...args: Array<any>) {
  if (args.length < 1) return args
  const aArgs = Array.from(args)
  const first_func = aArgs.splice(-1)[0]
  return function(...args1: any) {
    return aArgs.reduceRight(function(result, func) {
      return func(result)
    }, first_func(...args1))
  }
}

export function injectLink(href: string): void {
  // <link rel="stylesheet" href="http://at.alicdn.com/t/font_1610918_9qmk8rct8ts.css">
  const new_link: LinkElement = document.createElement("link")
  new_link.rel = "stylesheet"
  new_link.href = href
  const first_link: { parentNode: any } = document.querySelectorAll("link")[0]
  first_link.parentNode.insertBefore(new_link, first_link)
}
