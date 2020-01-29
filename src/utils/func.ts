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

// test
// interface Count {
//   (a: number, b: number): number;
// }

// const add: Count = function(a, b) {
//   return a + b;
// };
// const mult: Count = function(a, b) {
//   return a * b;
// };
// const res_1add2: any = partial(add, 1, 2);
// const res_1add: any = partial(add, 1);
// const res_2mult: any = partial(mult, 2);
// const res_com: any = pipe(res_2mult, res_2mult, res_1add, res_1add);

// console.log(res_1add2());
// console.log(res_1add(3));
// console.log(res_com(2));
