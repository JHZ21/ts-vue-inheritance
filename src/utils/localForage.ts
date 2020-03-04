import localForage from "localforage"
import { vaild_local } from "./func"

export function setLocalForage(key: string, data: any) {
  if (!data._time) data._time = new Date().getTime()
  return localForage.setItem(key, data)
}

export function getLocalForage(key: string) {
  return localForage.getItem(key)
}

// max_minute 默认有30分种
export function getVailLocalForage(
  key: string,
  max_minute?: number
): Promise<unknown> {
  return getLocalForage(key).then(data => {
    // data 为 undef null  或者 不可挂载属性的， 返回原值
    if (!data || !(data as any)._time) return data
    // 如果过期了,就主动清除
    if (vaild_local(data, max_minute)) {
      return data
    } else {
      removeLocalForage(key)
      return undefined
    }
  })
}

export function removeLocalForage(key: string) {
  return localForage.removeItem(key)
}

export function clearLocalForage() {
  return localForage.clear()
}

export function lengthLocalForage() {
  localForage.length()
}

export function support() {
  const indexedDB =
    window.indexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).mozIndexedDB ||
    null
  return !!indexedDB
}