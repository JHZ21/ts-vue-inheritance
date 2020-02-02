import { LinkElement } from "./interface";

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
