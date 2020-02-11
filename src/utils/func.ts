import { LinkElement } from "./interface";

// set fontSize of html
export function setHtmlFontSize() {
  document.addEventListener("DOMContentLoaded", () => {
    // 获取html元素
    const html: HTMLHtmlElement | null = document.querySelector("html");
    // 根据屏幕宽度动态计算fontSize
    let fontSize: number = window.innerWidth / 10;
    // 当fontSize大于50时，设置最大值为50
    fontSize = fontSize > 50 ? 50 : fontSize;
    // 设置html的fontSize属性，使rem生效，1rem = fontSize + 'px'
    html && (html.style.fontSize = fontSize + "px");
  });
}

// return fromat: yyyy/mm/dd
export function timeStampToTargetFormat(timeStamp: number): string {
  const dateObj = new Date(timeStamp);
  const return_str: string = `${dateObj.getFullYear()}/${dateObj.getMonth() +
    1}/${dateObj.getDate()}`;
  return return_str;
}

export function partial(...args: any) {
  if (args.length > 1) {
    const new_args: any[] = [].slice.call(args, 1);
    return function(...add_args: any) {
      return args[0](...new_args, ...add_args);
    };
  }
}
export function pipe(...args: Array<any>) {
  if (args.length < 1) return args;
  const aArgs = Array.from(args);
  const first_func = aArgs.splice(-1)[0];
  return function(...args1: any) {
    return aArgs.reduceRight(function(result, func) {
      return func(result);
    }, first_func(...args1));
  };
}

export function injectLink(href: string): void {
  // <link rel="stylesheet" href="http://at.alicdn.com/t/font_1610918_9qmk8rct8ts.css">
  const new_link: LinkElement = document.createElement("link");
  new_link.rel = "stylesheet";
  new_link.href = href;
  const first_link: { parentNode: any } = document.querySelectorAll("link")[0];
  first_link.parentNode.insertBefore(new_link, first_link);
}
